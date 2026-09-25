import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const ServicesCard = ({ service, index }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const divRef = useRef(null);
  const Icon = service.icon;

  const handleMouseMove = (e) => {
    const bounds = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      ref={divRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
      className={`glass group relative overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:border-[#29A6FF]/40 ${service.wide ? 'md:col-span-2' : ''}`}
    >
      <div
        className={`pointer-events-none absolute z-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(41,166,255,0.35),rgba(139,107,255,0.15),transparent)] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ top: position.y - 160, left: position.x - 160 }}
      />

      <div className="relative z-10">
        <div className="icon-tile h-14 w-14 transition-transform duration-300 group-hover:scale-110">
          <Icon set="bulk" size={28} primaryColor="#6BEBFF" secondaryColor="#8B6BFF" />
        </div>
        <h3 className="mt-6 text-xl font-bold tracking-[-0.02em] text-white">{service.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{service.description}</p>
        {service.tags && (
          <div className="mt-5 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ServicesCard;
