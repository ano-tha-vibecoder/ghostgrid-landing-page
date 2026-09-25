import { handleChat } from '../server/chat.js'

// Vercel Function (Web signature). Streams NDJSON chat events back to the widget.
export const maxDuration = 60

export function POST(request) {
  return handleChat(request)
}
