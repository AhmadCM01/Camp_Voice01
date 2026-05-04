'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '/login', label: 'For Students' },
  { href: '/admin/login', label: 'For Admin' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isMarketing = pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,253,245,0.95)' : 'rgba(255,253,245,0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid rgba(230,235,230,1)' : '1px solid transparent',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#1A531A] flex items-center justify-center text-[#FFFFFF] font-black text-sm tracking-tight shadow-md group-hover:bg-[#154515] transition-colors">
                CV
              </div>
              <span className="text-[#2A2A2A] font-bold text-lg tracking-tight">Camp<span className="text-[#1A531A]">Voice</span></span>
            </Link>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center gap-7">
              {isMarketing ? (
                navLinks.map((link) => (
                  link.href.startsWith('#') ? (
                    <button
                      key={link.href}
                      onClick={() => scrollTo(link.href)}
                      className="text-sm font-semibold text-[#525252] hover:text-[#1A531A] transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-semibold text-[#525252] hover:text-[#1A531A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))
              ) : (
                [{ href: '/', label: 'Home' }, { href: '/login', label: 'Sign In' }].map((l) => (
                  <Link key={l.href} href={l.href} className="text-sm font-semibold text-[#525252] hover:text-[#1A531A] transition-colors">
                    {l.label}
                  </Link>
                ))
              )}
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#2A2A2A] border border-[#E6EBE6] bg-[#F8FBF8] rounded-full px-5 py-2 hover:border-[#1A531A] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-[#FFFFFF] bg-[#1A531A] rounded-full px-5 py-2 hover:bg-[#154515] transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#2A2A2A] p-2 hover:text-[#1A531A] transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-[#FFFDF5]/98 backdrop-blur-xl flex flex-col pt-20 px-6 md:hidden"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: mobileOpen ? 1 : 0, y: mobileOpen ? 0 : -16, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.22 }}
      >
        <nav className="flex flex-col gap-1">
          {isMarketing ? navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-xl font-bold text-[#2A2A2A] py-3.5 border-b border-[#E6EBE6] text-left hover:text-[#1A531A] transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-bold text-[#2A2A2A] py-3.5 border-b border-[#E6EBE6] text-left hover:text-[#1A531A] transition-colors"
              >
                {link.label}
              </Link>
            )
          )) : (
            [{ href: '/', label: 'Home' }].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-xl font-bold text-[#2A2A2A] py-3.5 border-b border-[#E6EBE6] hover:text-[#1A531A] transition-colors">
                {l.label}
              </Link>
            ))
          )}
        </nav>
        <div className="flex flex-col gap-3 mt-8">
          <Link href="/login" onClick={() => setMobileOpen(false)} className="text-center font-semibold text-[#2A2A2A] border border-[#E6EBE6] bg-[#F8FBF8] rounded-full px-5 py-3 hover:border-[#1A531A] transition-colors">
            Sign In
          </Link>
          <Link href="/register" onClick={() => setMobileOpen(false)} className="text-center font-semibold text-[#FFFFFF] bg-[#1A531A] rounded-full px-5 py-3 hover:bg-[#154515] transition-colors">
            Get Started Free
          </Link>
        </div>
      </motion.div>
    </>
  );
}
