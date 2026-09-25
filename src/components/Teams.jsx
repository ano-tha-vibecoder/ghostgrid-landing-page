import React from "react";
import Title from "./Title";
import { motion } from "framer-motion";
import { Discovery, Work, Setting, Star } from './icons';

const reasons = [
  {
    title: 'Strategy before code',
    icon: Discovery,
    description: 'GhostGrid starts from the real business problem, then identifies the right technical path instead of jumping into generic build work.',
  },
  {
    title: 'Hands-on delivery',
    icon: Work,
    description: 'The work is not limited to decks or recommendations. GhostGrid designs, builds, and helps deploy the systems that matter.',
  },
  {
    title: 'Practical engineering',
    icon: Setting,
    description: 'The team balances technical feasibility, business constraints, and execution realities so solutions are durable and useful.',
  },
  {
    title: 'Built with intent',
    icon: Star,
    description: 'GhostGrid is structured to help organizations move from uncertainty to clarity, then from concept to operational value.',
  },
];

const Teams = () => {
  return (
    <section id="why-ghostgrid" className="relative px-4 py-24 sm:px-8">
      <div className="section-divider absolute inset-x-0 top-0 mx-auto max-w-5xl" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob right-[-10%] top-[20%] h-[460px] w-[460px] bg-[radial-gradient(closest-side,rgba(139,107,255,0.22),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <Title
          eyebrow="Why GhostGrid"
          title="Consulting and engineering, one team"
          desc="Strategic thinking with hands-on engineering. Consulting and implementation work together — not as separate stages, but as one path to value."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map(({ title, icon: Icon, description }, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              key={title}
              className="glass group rounded-3xl p-6 transition hover:border-[#8B6BFF]/40"
            >
              <div className="icon-tile h-12 w-12 transition-transform duration-300 group-hover:-rotate-6">
                <Icon set="bulk" size={24} primaryColor="#6BEBFF" secondaryColor="#8B6BFF" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teams;
