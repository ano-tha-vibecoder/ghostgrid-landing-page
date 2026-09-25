import React, { Suspense, lazy, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Chat, CloseSquare } from '../icons'

// The panel (and its chat logic) is fetched on first open, not on page load
const ChatPanel = lazy(() => import('./ChatPanel'))
const preload = () => import('./ChatPanel')

const ChatLauncher = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Suspense fallback={null}>
        <AnimatePresence>{open && <ChatPanel onClose={() => setOpen(false)} />}</AnimatePresence>
      </Suspense>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={preload}
        onFocus={preload}
        onTouchStart={preload}
        aria-label={open ? 'Close chat' : 'Chat with the GhostGrid assistant'}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        className={`group fixed bottom-5 right-5 z-[61] items-center gap-2 rounded-full bg-gradient-to-br from-[#6BEBFF] via-[#29A6FF] to-[#7C5CFF] p-[1.5px] shadow-[0_12px_40px_-8px_rgba(41,166,255,0.8)] sm:bottom-6 sm:right-6 ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <span className="flex items-center gap-2 rounded-full bg-[#070B14] py-3 pl-3 pr-3 transition group-hover:bg-[#0B1424] sm:pr-5">
          <span className="relative flex">
            {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#29A6FF]/40" />}
            {open ? (
              <CloseSquare set="bold" size={26} primaryColor="#6BEBFF" />
            ) : (
              <Chat set="bold" size={26} primaryColor="#6BEBFF" />
            )}
          </span>
          <span className="hidden text-sm font-bold text-white sm:inline">{open ? 'Close' : 'Ask GhostGrid AI'}</span>
        </span>
      </motion.button>
    </>
  )
}

export default ChatLauncher
