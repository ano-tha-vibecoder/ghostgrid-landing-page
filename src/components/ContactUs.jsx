import React, { useState } from "react";
import Title from "./Title";
import toast from "react-hot-toast";
import { submitToWeb3Forms } from "../lib/web3forms";
import { motion } from "framer-motion";
import { User, Message, Send, TimeCircle, ShieldDone, Calendar } from './icons';

const perks = [
  { icon: TimeCircle, title: "Reply within one business day", text: "A real person reads every message." },
  { icon: Calendar, title: "Free 30-minute discovery call", text: "Map the problem before any commitment." },
  { icon: ShieldDone, title: "Confidential by default", text: "Happy to sign an NDA before we talk." },
];

const inputClass =
  "w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500";
const fieldClass =
  "flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-[#29A6FF]/60 focus-within:bg-[#29A6FF]/[0.04]";

const ContactUs = () => {
  const [sending, setSending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSending(true);

    try {
      await submitToWeb3Forms(new FormData(event.target));
      toast.success("Thanks. Your message is on its way.");
      event.target.reset();
    } catch (error) {
      toast.error(error.message || "Unable to send your message right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact-us" className="relative px-4 py-24 sm:px-8">
      <div className="section-divider absolute inset-x-0 top-0 mx-auto max-w-5xl" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob animate-aurora-a left-1/2 top-1/3 h-[520px] w-[760px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(41,166,255,0.22),rgba(139,107,255,0.12),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <Title
          eyebrow="Contact"
          title="Start a conversation"
          desc="Have a problem worth solving? Tell GhostGrid what you’re working on, and we’ll help you map the right technical path forward."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-4">
            {perks.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass flex items-start gap-4 rounded-2xl p-5"
              >
                <div className="icon-tile h-11 w-11 shrink-0 rounded-xl">
                  <Icon set="bulk" size={22} primaryColor="#6BEBFF" secondaryColor="#8B6BFF" />
                </div>
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="mt-1 text-sm text-slate-400">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className="gradient-border glass grid gap-4 rounded-[28px] p-5 sm:grid-cols-2 sm:p-8"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Your name</span>
              <div className={fieldClass}>
                <User set="light" size={20} primaryColor="#64748B" />
                <input type="text" name="name" placeholder="Your full name" className={inputClass} required />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Email address</span>
              <div className={fieldClass}>
                <Message set="light" size={20} primaryColor="#64748B" />
                <input type="email" name="email" placeholder="you@company.com" className={inputClass} required />
              </div>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-200">What do you need help with?</span>
              <textarea
                rows={6}
                name="message"
                placeholder="Tell us about the problem, opportunity, or system you need to build."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#29A6FF]/60 focus:bg-[#29A6FF]/[0.04]"
                required
              />
            </label>

            <button type="submit" disabled={sending} className="btn-primary px-8 py-3.5 text-sm disabled:opacity-60 sm:col-span-2 sm:w-max">
              {sending ? "Sending…" : "Send message"}
              <Send set="light" size={18} primaryColor="#05080F" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
