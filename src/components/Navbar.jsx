import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Category, CloseSquare } from './icons';
import Logo from "./Logo";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#services", label: "Capabilities" },
  { href: "#our-work", label: "Solutions" },
  { href: "#why-ghostgrid", label: "Why GhostGrid" },
  { href: "#about", label: "About" },
];

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-white/[0.06] bg-[#05080F]/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <a href="#hero" aria-label="GhostGrid home" className="transition hover:opacity-90">
          <Logo />
        </a>

        <div className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 text-sm text-slate-300 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#contact-us" className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Book a strategy call
            <ArrowRight set="light" size={18} primaryColor="#05080F" />
          </a>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="glass flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            <Category set="bulk" size={22} primaryColor="#29A6FF" secondaryColor="#8B6BFF" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-72 flex-col gap-2 border-l border-white/10 bg-[#070B14]/95 p-6 backdrop-blur-xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo markClassName="h-8 w-8" textClassName="text-lg" />
                <button type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
                  <CloseSquare set="light" size={26} primaryColor="#94A3B8" />
                </button>
              </div>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-xl px-4 py-3 text-base text-slate-200 transition hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact-us" onClick={() => setSidebarOpen(false)} className="btn-primary mt-4 px-5 py-3 text-sm">
                Book a strategy call
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
