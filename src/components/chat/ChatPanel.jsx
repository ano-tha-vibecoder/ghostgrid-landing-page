import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CloseSquare, TickSquare, User } from '../icons'
import { LogoMark } from '../Logo'
import { submitToWeb3Forms } from '../../lib/web3forms'

const STORAGE_KEY = 'gg-chat'
const MAX_CHARS = 2000

const GREETING = {
  role: 'assistant',
  content: "Hi, I'm the GhostGrid assistant. Tell me what you're working on, and I'll show you where AI and custom technology could help.",
  local: true,
}

const SUGGESTIONS = [
  'What does GhostGrid do?',
  'Can AI automate our workflows?',
  'Tell me about CardioRisk',
  'I want to book a strategy call',
]

const loadHistory = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved) && saved.length) return saved
  } catch {
    /* storage unavailable or corrupt */
  }
  return [GREETING]
}

// Only real conversation turns go to the API; the greeting and contact cards stay in the UI.
// Long chats keep their most recent turns within the server's limits, starting on a user turn.
const MAX_API_MESSAGES = 24
const MAX_API_CHARS = 15000
const toApiMessages = (items) => {
  const turns = items
    .filter((m) => !m.local && (m.role === 'user' || m.role === 'assistant') && m.content.trim())
    .map(({ role, content }) => ({ role, content: content.slice(0, MAX_CHARS) }))
  let total = 0
  let start = turns.length
  while (start > 0 && turns.length - start < MAX_API_MESSAGES && total + turns[start - 1].content.length <= MAX_API_CHARS) {
    total += turns[--start].content.length
  }
  while (start < turns.length && turns[start].role !== 'user') start++
  return turns.slice(start)
}

const LeadCard = ({ item, onSend }) => {
  const { lead, status } = item
  return (
    <div className="gradient-border glass rounded-2xl p-4 text-sm">
      <p className="eyebrow text-[10px]">Send to the GhostGrid team?</p>
      <dl className="mt-3 space-y-1.5 text-slate-300">
        {[
          ['Name', lead.name],
          ['Email', lead.email],
          lead.company && ['Company', lead.company],
          ['Needs', lead.summary],
        ]
          .filter(Boolean)
          .map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <dt className="w-16 shrink-0 text-slate-500">{label}</dt>
              <dd className="min-w-0 break-words text-slate-200">{value}</dd>
            </div>
          ))}
      </dl>
      {status === 'sent' ? (
        <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-300">
          <TickSquare set="bulk" size={18} primaryColor="#34D399" secondaryColor="#34D399" />
          Sent. The team will be in touch.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={onSend}
            disabled={status === 'sending'}
            className="btn-primary mt-4 w-full px-4 py-2.5 text-sm disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
          {status === 'error' && <p className="mt-2 text-xs text-rose-300">Couldn't send. Please try again or use the contact form.</p>}
        </>
      )}
    </div>
  )
}

const ChatPanel = ({ onClose }) => {
  const [items, setItems] = useState(loadHistory)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [items])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      abortRef.current?.abort()
    }
  }, [onClose])

  const appendToLastAssistant = (text) =>
    setItems((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      next[next.length - 1] = { ...last, content: last.content + text }
      return next
    })

  const send = async (text) => {
    const content = text.trim().slice(0, MAX_CHARS)
    if (!content || busy) return

    const history = [...items, { role: 'user', content }]
    setItems([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)

    const aborter = new AbortController()
    abortRef.current = aborter
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: toApiMessages(history) }),
        signal: aborter.signal,
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'The assistant is unavailable right now.')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.trim()) continue
          const event = JSON.parse(line)
          if (event.type === 'text') appendToLastAssistant(event.text)
          if (event.type === 'lead') {
            // Card goes before the assistant's follow-up text
            setItems((prev) => [...prev, { role: 'lead', lead: event.lead, status: 'pending' }, { role: 'assistant', content: '' }])
          }
          if (event.type === 'error') throw new Error(event.error)
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setItems((prev) => [...prev, { role: 'assistant', content: err.message, local: true, error: true }])
      }
    } finally {
      // Drop empty assistant bubbles left by a lead card or an error
      setItems((prev) => prev.filter((m) => m.role !== 'assistant' || m.content))
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  const sendLead = async (index) => {
    const setStatus = (status) =>
      setItems((prev) => prev.map((m, i) => (i === index ? { ...m, status } : m)))
    const { lead } = items[index]
    setStatus('sending')
    try {
      const form = new FormData()
      form.append('name', lead.name)
      form.append('email', lead.email)
      form.append('message', `${lead.summary}${lead.company ? `\n\nCompany: ${lead.company}` : ''}\n\n(Sent from the website chat assistant)`)
      form.append('subject', 'New enquiry from the GhostGrid chat assistant')
      await submitToWeb3Forms(form)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const lastIsEmptyAssistant = busy && items.at(-1)?.role === 'assistant' && !items.at(-1).content

  return (
    <motion.div
      role="dialog"
      aria-label="GhostGrid assistant"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#070B14] sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px] sm:rounded-[28px] sm:border sm:border-white/10 sm:shadow-[0_30px_80px_-20px_rgba(41,166,255,0.45)]"
    >
      {/* header */}
      <div className="relative flex items-center gap-3 border-b border-white/[0.06] bg-gradient-to-r from-[#0B2A4A] via-[#122251] to-[#2A1760] px-5 py-4">
        <LogoMark className="h-9 w-9 drop-shadow-[0_0_12px_rgba(41,166,255,0.6)]" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white">GhostGrid Assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> AI-powered · usually replies instantly
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="rounded-full p-1 transition hover:bg-white/10">
          <CloseSquare set="light" size={24} primaryColor="#CBD5E1" />
        </button>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
        {items.map((m, i) =>
          m.role === 'lead' ? (
            <LeadCard key={i} item={m} onSend={() => sendLead(i)} />
          ) : m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-[#29A6FF] to-[#7C5CFF] px-4 py-2.5 text-sm text-white">
                {m.content}
              </p>
            </div>
          ) : (
            m.content && (
              <div key={i} className="flex items-end gap-2">
                <LogoMark className="mb-1 h-6 w-6 shrink-0" />
                <p
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-6 ${
                    m.error ? 'border-rose-400/30 bg-rose-500/10 text-rose-200' : 'border-white/[0.06] bg-white/[0.04] text-slate-200'
                  }`}
                >
                  {m.content}
                </p>
              </div>
            )
          )
        )}

        {lastIsEmptyAssistant && (
          <div className="flex items-end gap-2" aria-label="Assistant is typing">
            <LogoMark className="mb-1 h-6 w-6 shrink-0" />
            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3.5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6BEBFF]" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {items.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-[#29A6FF]/30 bg-[#29A6FF]/[0.06] px-3 py-1.5 text-xs font-semibold text-[#9BDCFF] transition hover:border-[#29A6FF]/60 hover:bg-[#29A6FF]/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="border-t border-white/[0.06] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 pl-4 transition focus-within:border-[#29A6FF]/60">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={MAX_CHARS}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            placeholder="Ask about AI, automation, our work…"
            aria-label="Message"
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-[16px] text-white outline-none placeholder:text-slate-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="btn-primary h-10 w-10 shrink-0 rounded-xl p-0 disabled:opacity-40"
          >
            <Send set="bold" size={18} primaryColor="#05080F" />
          </button>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] text-slate-500">
          <User set="light" size={12} primaryColor="#64748B" />
          AI assistant. It can make mistakes; the team confirms details on a call.
        </p>
      </form>
    </motion.div>
  )
}

export default ChatPanel
