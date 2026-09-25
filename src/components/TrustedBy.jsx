import React from 'react'
import { motion } from "framer-motion";
import { Discovery, Wallet, Work, Document, Heart } from './icons'

const industries = [
  { name: 'Agriculture', icon: Discovery },
  { name: 'Healthcare', icon: Heart },
  { name: 'Financial Services', icon: Wallet },
  { name: 'SMEs & Startups', icon: Work },
  { name: 'Research & Education', icon: Document },
]

const stack = [
  'Large Language Models', 'Retrieval-Augmented Generation', 'Computer Vision', 'Workflow Automation',
  'Predictive Analytics', 'Clinical ML', 'Cloud Infrastructure', 'Data Engineering', 'AI Agents', 'MLOps', 'Custom APIs',
]

const TrustedBy = () => {
  return (
    <section className="relative px-4 pb-16 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl"
      >
        <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          Delivering value across industries
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map(({ name, icon: Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="glass flex items-center gap-3 rounded-2xl p-4 transition last:col-span-2 hover:border-[#29A6FF]/40 sm:last:col-span-1 lg:flex-col lg:items-start lg:p-5"
            >
              <div className="icon-tile h-11 w-11 shrink-0 rounded-xl">
                <Icon set="bulk" size={22} primaryColor="#6BEBFF" secondaryColor="#8B6BFF" />
              </div>
              <p className="text-sm font-bold text-white sm:text-base">{name}</p>
            </motion.div>
          ))}
        </div>

        {/* Capability marquee */}
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="animate-marquee flex w-max gap-10">
            {[...stack, ...stack].map((item, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold text-slate-500">
                {item}
                <span className="h-1 w-1 rounded-full bg-[#29A6FF]/60" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default TrustedBy
