import React from 'react';
import { motion } from 'framer-motion';
import { TickSquare } from './icons';
import Title from './Title';
import { LogoMark } from './Logo';

const points = [
  'Technology strategy grounded in business reality.',
  'Hands-on delivery from problem framing to deployment.',
  'Practical engineering without hype or over-engineering.',
];

const About = () => {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative px-4 py-24 sm:px-8"
    >
      <div className="gradient-border relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#070C17]/80 p-6 sm:p-10 lg:p-12">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <LogoMark className="animate-spin-slow pointer-events-none absolute -right-24 -top-24 h-80 w-80 opacity-[0.07]" />

        <div className="relative">
          <Title
            eyebrow="About"
            title="Company first. Founder second."
            desc="GhostGrid exists to help businesses, organizations, and entrepreneurs move from uncertainty to technical clarity and working solutions."
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 text-slate-300">
              <p className="text-base leading-8">
                GhostGrid is a technology consulting company focused on where digital systems can create real operational value. We work with organizations that need more than a recommendation deck: they need a path to a practical technical decision, a well-structured build, and a deployment that matches their reality.
              </p>
              <p className="text-base leading-8">
                The company brings together strategic thinking, software development, and implementation experience. The goal is simple: translate business and organizational problems into technology that works, is maintainable, and supports long-term growth.
              </p>
            </div>

            <div className="glass rounded-3xl p-6">
              <p className="eyebrow">GhostGrid principles</p>
              <ul className="mt-5 space-y-4">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                    <span className="mt-0.5 shrink-0">
                      <TickSquare set="bulk" size={20} primaryColor="#29A6FF" secondaryColor="#8B6BFF" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
