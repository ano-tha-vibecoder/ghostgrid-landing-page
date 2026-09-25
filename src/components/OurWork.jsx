import React from "react";
import Title from "./Title";
import { motion } from "framer-motion";
import { ArrowRight } from './icons';
import { CropShieldVisual, LyfVisual, GhostTraderVisual, CardioRiskVisual } from './ProductVisuals';

// Set `image` to a real screenshot (e.g. import from ../assets) to replace the illustrated placeholder

const workData = [
  {
    title: "CropShield AI",
    tag: "Computer vision · AgriTech",
    description: "AI-driven decision support for agricultural monitoring, problem detection, and operational insight.",
    image: null,
    Visual: CropShieldVisual,
  },
  {
    title: "CardioRisk",
    tag: "Machine learning · HealthTech",
    description: "A web app for doctors and medical personnel that uses machine learning to predict heart disease, stroke, and other cardiovascular risks from patient data.",
    image: null,
    Visual: CardioRiskVisual,
  },
  {
    title: "LYF",
    tag: "Product platform",
    description: "Digital experience and platform thinking built to simplify real user journeys and improve product value.",
    image: null,
    Visual: LyfVisual,
  },
  {
    title: "Ghost Trader",
    tag: "Analytics · FinTech",
    description: "A practical trading and analysis product designed around decision-making workflows and operational clarity.",
    image: null,
    Visual: GhostTraderVisual,
  },
];

const OurWork = () => {
  return (
    <section id="our-work" className="relative px-4 py-24 sm:px-8">
      <div className="section-divider absolute inset-x-0 top-0 mx-auto max-w-5xl" />
      <div className="mx-auto max-w-6xl">
        <Title
          eyebrow="Solutions"
          title="Selected solutions"
          desc="GhostGrid builds technology that matters. These products reflect how the team thinks, designs, and delivers practical systems for real-world use."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {workData.map((work, index) => (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
              key={work.title}
              className="glass group overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#29A6FF]/40"
            >
              <div className="relative overflow-hidden">
                {work.image ? (
                  <img src={work.image} loading="lazy" decoding="async" className="h-56 w-full sm:h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt={work.title} />
                ) : (
                  <div className="h-56 w-full sm:h-64 transition-transform duration-700 group-hover:scale-105" role="img" aria-label={`${work.title} illustration`}>
                    <work.Visual />
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#070C17] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <p className="eyebrow mb-2 text-[10px]">{work.tag}</p>
                <h3 className="text-xl font-bold tracking-[-0.02em] text-white">{work.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{work.description}</p>
                <a href="#contact-us" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#6BEBFF] transition group-hover:gap-2.5">
                  Discuss a similar project
                  <ArrowRight set="light" size={16} primaryColor="#6BEBFF" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurWork;
