import React from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App.jsx'

// Renders the full page (waiting for lazy sections) to static HTML at build time
export async function render() {
  const { prelude } = await prerenderToNodeStream(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
