import { GoogleGenAI, ThinkingLevel } from '@google/genai'
import { SYSTEM_PROMPT } from './systemPrompt.js'

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash'

// Public endpoint: cap what one visitor can send so a single session can't run up the bill
const MAX_MESSAGES = 24
const MAX_CHARS = 2000
const MAX_TOTAL_CHARS = 16000
const MAX_BODY_BYTES = 32 * 1024
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 20 }
const MAX_MODEL_TURNS = 3

const contactTool = {
  name: 'prepare_contact_request',
  description:
    "Show the visitor a confirmation card to send their details to the GhostGrid team. Call only after the visitor has given their name, email, and what they need. Nothing is sent until the visitor presses Send on the card.",
  parametersJsonSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "Visitor's full name" },
      email: { type: 'string', description: "Visitor's email address" },
      company: { type: 'string', description: 'Company or organization, if given' },
      summary: { type: 'string', description: 'One or two sentences on what the visitor needs help with' },
    },
    required: ['name', 'email', 'summary'],
    additionalProperties: false,
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort per-IP limiter. Serverless instances don't share memory, so this slows abuse
// down rather than stopping it; use a shared store (e.g. Upstash Redis) for a hard limit.
const hits = new Map()
const rateLimited = (ip) => {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > RATE_LIMIT.max
}

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const validateMessages = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return false
  if (messages[0].role !== 'user' || messages.at(-1).role !== 'user') return false
  let total = 0
  return messages.every(
    (m) =>
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0 &&
      m.content.length <= MAX_CHARS &&
      (total += m.content.length) <= MAX_TOTAL_CHARS
  )
}

const validateLead = (args) => {
  const lead = {
    name: typeof args?.name === 'string' ? args.name.trim().slice(0, 120) : '',
    email: typeof args?.email === 'string' ? args.email.trim().slice(0, 200) : '',
    company: typeof args?.company === 'string' ? args.company.trim().slice(0, 120) : '',
    summary: typeof args?.summary === 'string' ? args.summary.trim().slice(0, 1000) : '',
  }
  if (!lead.name || !lead.summary || !EMAIL_RE.test(lead.email)) return null
  return lead
}

export async function handleChat(request) {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' })

  // Only accept calls from pages served by this site (or origins listed in ALLOWED_ORIGINS).
  // Browsers always send Origin on this POST, so a missing header means a non-browser client.
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const originHost = (() => {
    try {
      return new URL(origin).host
    } catch {
      return null
    }
  })()
  if (!origin || (originHost !== host && !allowed.includes(origin))) {
    return json(403, { error: 'Forbidden' })
  }

  // Vercel sets x-real-ip to the connecting client; x-forwarded-for is the fallback for local dev
  const ip =
    request.headers.get('x-real-ip') || (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return json(429, { error: "You've sent a lot of messages. Please wait a few minutes, or use the contact form." })
  }

  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
    return json(413, { error: 'Message too long' })
  }
  let body
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'Message too long' })
    body = JSON.parse(raw)
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }
  if (!validateMessages(body?.messages)) return json(400, { error: 'Invalid messages' })

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set')
    return json(500, { error: 'The assistant is not configured yet.' })
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const contents = body.messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event) => controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))

      // One model turn. Retries once if it fails before anything reached the visitor
      // (typically a transient overload), since a retry after partial output would repeat text.
      const runTurn = async () => {
        for (let attempt = 0; ; attempt++) {
          const modelParts = []
          const calls = []
          let sentText = false
          try {
            const response = await ai.models.generateContentStream({
              model: MODEL,
              contents,
              config: {
                systemInstruction: SYSTEM_PROMPT,
                tools: [{ functionDeclarations: [contactTool] }],
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
                maxOutputTokens: 2048,
                abortSignal: request.signal,
              },
            })
            // Keep every part the model returns (including thought signatures) so the
            // follow-up request after a function call replays the turn exactly
            for await (const chunk of response) {
              for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
                modelParts.push(part)
                if (part.text && !part.thought) {
                  send({ type: 'text', text: part.text })
                  sentText = true
                }
                if (part.functionCall) calls.push(part.functionCall)
              }
            }
            return { modelParts, calls, sentText }
          } catch (err) {
            if (sentText || attempt >= 1 || request.signal?.aborted) throw err
            console.warn('Gemini request failed, retrying once:', err?.message)
          }
        }
      }

      try {
        for (let turn = 0; turn < MAX_MODEL_TURNS; turn++) {
          const { modelParts, calls, sentText } = await runTurn()

          if (turn === 0 && !sentText && calls.length === 0) {
            // Empty reply (e.g. a safety block): never leave the visitor with nothing
            send({ type: 'text', text: "I can't help with that one, but I'm happy to answer questions about GhostGrid's services, or you can reach the team through the contact form." })
          }
          if (calls.length === 0) break

          contents.push({ role: 'model', parts: modelParts })
          const responses = calls.map((call) => {
            if (call.name !== contactTool.name) {
              return { functionResponse: { id: call.id, name: call.name, response: { error: 'Unknown tool' } } }
            }
            const lead = validateLead(call.args)
            if (!lead) {
              return {
                functionResponse: {
                  id: call.id,
                  name: call.name,
                  response: { error: 'Missing or invalid name, email, or summary. Ask the visitor for the missing details.' },
                },
              }
            }
            send({ type: 'lead', lead })
            return {
              functionResponse: {
                id: call.id,
                name: call.name,
                response: { status: 'Confirmation card shown. Not sent yet; the visitor must press Send.' },
              },
            }
          })
          contents.push({ role: 'user', parts: responses })
        }
        send({ type: 'done' })
      } catch (err) {
        if (!request.signal?.aborted) {
          console.error('Gemini request failed:', err)
          send({ type: 'error', error: 'Sorry, something went wrong on our side. Please try again, or use the contact form.' })
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' },
  })
}
