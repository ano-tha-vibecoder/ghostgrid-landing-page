import React from 'react'
import Title from './Title'
import ServicesCard from './ServicesCard'
import { motion } from "framer-motion";
import { Swap, Category, Setting, Chart, Discovery, Search, Edit, Upload, Graph } from './icons'

const capabilities = [
  {
    title: 'AI & Workflow Automation',
    description: 'Eliminate repetitive work, reduce human error, and deploy AI systems that actually support operations instead of creating more noise.',
    icon: Swap,
    tags: ['AI agents', 'Document processing', 'LLM integration'],
    wide: true,
  },
  {
    title: 'Custom Software',
    description: 'Build the tools, portals, and internal systems your business needs when off-the-shelf software can’t keep up with real processes.',
    icon: Category,
  },
  {
    title: 'Operational Transformation',
    description: 'Unify disconnected systems, messy processes, and manual handoffs into a clearer operating model that scales.',
    icon: Setting,
  },
  {
    title: 'Data & Insight Systems',
    description: 'Turn fragmented data into decision-ready visibility so teams can act faster, forecast more accurately, and reduce guesswork.',
    icon: Chart,
  },
  {
    title: 'Technology Roadmaps',
    description: 'Cut through the uncertainty and define the technical path, priorities, and investment logic before budgets are wasted.',
    icon: Discovery,
  },
]

const approach = [
  { step: '01', title: 'Diagnose', icon: Search, text: 'We identify the actual bottleneck, business risk, and opportunity hiding inside the current system.' },
  { step: '02', title: 'Design', icon: Edit, text: 'We map the right technology, workflow, and roadmap without overbuilding or adding complexity for its own sake.' },
  { step: '03', title: 'Build', icon: Upload, text: 'We engineer practical solutions with the right stack, structure, and operational discipline to ship clearly.' },
  { step: '04', title: 'Scale', icon: Graph, text: 'We help transition from prototype or pilot into a dependable system that performs in the real world.' },
]

const Services = () => {
  return (
    <section id="services" className="relative px-4 py-24 sm:px-8">
      <div className="section-divider absolute inset-x-0 top-0 mx-auto max-w-5xl" />
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="aurora-blob left-[-10%] top-[10%] h-[500px] w-[500px] bg-[radial-gradient(closest-side,rgba(41,166,255,0.22),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <Title
          eyebrow="Capabilities"
          title="What GhostGrid solves"
          desc="We help teams cut through complexity, remove operational bottlenecks, and turn uncertainty into systems that drive real value."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((service, index) => (
            <ServicesCard key={service.title} service={service} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="gradient-border relative mt-20 overflow-hidden rounded-[32px] bg-[#070C17]/80 p-6 sm:p-10"
        >
          <div className="bg-dots pointer-events-none absolute inset-0" />
          <div className="relative mb-10 text-center">
            <p className="eyebrow">Our approach</p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">From friction to momentum</h3>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {approach.map(({ step, title, icon: Icon, text }) => (
              <div key={step} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="icon-tile h-11 w-11 rounded-xl">
                    <Icon set="bulk" size={22} primaryColor="#6BEBFF" secondaryColor="#8B6BFF" />
                  </div>
                  <span className="text-3xl font-extrabold text-white/10">{step}</span>
                </div>
                <h4 className="mt-5 text-lg font-bold text-white">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
