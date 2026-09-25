import React from 'react'
import { motion } from "framer-motion";

const Title = ({ eyebrow, title, desc }) => {
  return (
    <div className="flex flex-col items-center text-center">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="eyebrow mb-4 rounded-full border border-[#29A6FF]/20 bg-[#29A6FF]/[0.06] px-3.5 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#6BEBFF] to-[#8B6BFF]" />
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-4 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl"
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="mx-auto mb-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base"
        >
          {desc}
        </motion.p>
      )}
    </div>
  )
}

export default Title
