import React from "react";
import assets from "../assets/assets";
import { motion } from "framer-motion";
import { ArrowRight } from './icons';
import Logo from "./Logo";

const socials = [
  { icon: assets.linkedin_icon, label: "LinkedIn" },
  { icon: assets.twitter_icon, label: "Twitter" },
  { icon: assets.instagram_icon, label: "Instagram" },
  { icon: assets.facebook_icon, label: "Facebook" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-8">
      {/* CTA band */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,#0B2A4A_0%,#122251_45%,#2A1760_100%)] px-6 py-14 text-center sm:px-12"
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="aurora-blob animate-aurora-a -right-20 -top-20 h-72 w-72 bg-[#8B6BFF]/40" />
        <div className="aurora-blob animate-aurora-b -bottom-24 -left-16 h-72 w-72 bg-[#29A6FF]/40" />
        <div className="relative">
          <h3 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
            Ready to put AI to work?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Tell us where the friction is. We’ll show you where technology can create real value.
          </p>
          <a href="#contact-us" className="btn-primary mt-8 px-7 py-3.5 text-sm sm:text-base">
            Book a strategy call
            <ArrowRight set="light" size={20} primaryColor="#05080F" />
          </a>
        </div>
      </motion.div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col justify-between gap-10 lg:flex-row">
        <div className="max-w-sm space-y-5">
          <Logo markClassName="h-12 w-12" textClassName="text-2xl" />
          <p className="text-sm leading-6 text-slate-400">
            GhostGrid helps businesses and organizations find where technology can create real value, then turn that direction into implemented systems.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div>
            <p className="font-bold text-white">Company</p>
            <ul className="mt-4 space-y-3 text-slate-400">
              <li><a className="transition hover:text-white" href="#about">About</a></li>
              <li><a className="transition hover:text-white" href="#why-ghostgrid">Why GhostGrid</a></li>
              <li><a className="transition hover:text-white" href="#contact-us">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white">Services</p>
            <ul className="mt-4 space-y-3 text-slate-400">
              <li><a className="transition hover:text-white" href="#services">AI automation</a></li>
              <li><a className="transition hover:text-white" href="#services">Custom software</a></li>
              <li><a className="transition hover:text-white" href="#services">Data & insight</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white">Work</p>
            <ul className="mt-4 space-y-3 text-slate-400">
              <li><a className="transition hover:text-white" href="#our-work">Solutions</a></li>
              <li><a className="transition hover:text-white" href="#services">Our approach</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} GhostGrid. All rights reserved.</p>
        <div className="flex items-center gap-2">
          {socials.map(({ icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] opacity-70 transition hover:border-[#29A6FF]/50 hover:opacity-100"
            >
              <img src={icon} alt="" className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
