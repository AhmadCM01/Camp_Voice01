'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  FileText, Search, CheckCircle, ArrowRight, ChevronDown, Smartphone
} from 'lucide-react';
import type { Variants } from 'framer-motion';

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Data ───────────────────────────────────────────────── */
const steps = [
  { icon: FileText, step: '01', title: 'Submit', desc: 'Fill a short form from any device. Select a category, describe the issue, and attach evidence.' },
  { icon: Search, step: '02', title: 'Track', desc: 'Log in anytime to see real-time status. Pending → In Progress → Resolved.' },
  { icon: CheckCircle, step: '03', title: 'Resolved', desc: 'Get notified the moment your issue is resolved. Every action is logged with a timestamp.' },
];

const studentPoints = [
  'Submit complaints in under 2 minutes from your phone',
  'Attach photos and documents as evidence',
  'Track every status change in real time',
  'Email notification when your issue is resolved',
];

const adminPoints = [
  'Centralised inbox for complaints across all categories',
  'Assign, route, and update status with one click',
  'Every action timestamped — total accountability',
  'Weekly reports and resolution analytics',
];

const stats = [
  { value: '50K+', label: 'Students at ABU' },
  { value: '< 48h', label: 'Avg. resolution time' },
  { value: '4', label: 'Complaint categories' },
  { value: '100%', label: 'Audit-logged actions' },
];

/* ─── Sub-components ─────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
      {children}
    </span>
  );
}

function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="bg-white text-gray-900 antialiased overflow-x-hidden">

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 pb-20 overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #00D97E 0%, transparent 70%)' }}
        />
        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #00D97E 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <motion.div variants={stagger} initial="hidden" animate="visible" className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 border border-green-600 bg-green-50 text-green-600 text-[13px] font-semibold rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
            </span>
            Live at Ahmadu Bello University, Zaria
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] mb-6">
            Every student complaint,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
              tracked to resolution.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            CampVoice gives Nigerian university students a powerful voice to report issues directly to university administration — and ensures every complaint gets tracked until it&apos;s properly resolved.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-bold rounded-full px-8 py-4 text-base shadow-[0_0_32px_rgba(0,217,126,0.25)] hover:bg-green-700 transition-colors"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <Link
              href="/mobile"
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 font-semibold rounded-full px-6 py-3 hover:bg-green-50 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              Download Mobile App
            </Link>
          </motion.div>

          {/* Social proof chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            {['50,000+ Students at ABU', '4 Complaint Categories', 'Real-Time Tracking'].map((chip) => (
              <span key={chip} className="bg-[#0D1A16] border border-[#1D3D30] text-[#7DB89A] text-xs font-semibold px-4 py-2 rounded-full">
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
        >
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </motion.div>
      </section>

      {/* ─── PROBLEM ────────────────────────────────────────── */}
      <section id="problem" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F0FDF8] max-w-xl mx-auto leading-tight">
              The old way doesn&apos;t work.
            </h2>
          </ScrollReveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              { color: 'text-red-400 bg-red-900/20 border-red-900/40', label: 'Written Complaints', desc: 'Letters handed to departmental offices land in a tray and disappear. No tracking. No accountability.' },
              { color: 'text-amber-400 bg-amber-900/20 border-amber-900/40', label: 'Office Walk-Ins', desc: 'Students chase administrators in person — wasting hours across multiple offices with no guarantee.' },
              { color: 'text-orange-400 bg-orange-900/20 border-orange-900/40', label: 'Email Complaints', desc: 'Emails get buried or ignored. There\'s no escalation path, no status visibility, no outcome.' },
            ].map((card) => (
              <motion.div
                key={card.label}
                variants={fadeUp}
                className={`border rounded-2xl p-7 ${card.color}`}
              >
                <h3 className="font-bold text-base mb-3">{card.label}</h3>
                <p className="text-sm leading-relaxed opacity-80">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#0D1A16]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <SectionLabel>Simple Process</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black max-w-lg mx-auto leading-tight">
              From complaint to resolution in 3 steps.
            </h2>
          </ScrollReveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 relative"
          >
            {/* Connector line */}
            <div aria-hidden className="hidden md:block absolute top-10 left-[calc(16.5%+20px)] right-[calc(16.5%+20px)] h-px border-t border-dashed border-emerald-900" />
            {steps.map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                className="bg-[#0D1A16] border border-[#1D3D30] rounded-2xl p-8 hover:border-emerald-800/60 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-900 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-5xl font-black text-[#122B22] select-none">{s.step}</span>
                </div>
                <h3 className="font-bold text-[#F0FDF8] mb-2">{s.title}</h3>
                <p className="text-sm text-[#7DB89A] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── STUDENTS ───────────────────────────────────────── */}
      <section id="students" className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <SectionLabel>For Students</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black mb-7 leading-tight">
              Your voice, <span className="text-emerald-400">finally heard.</span>
            </h2>
            <ul className="space-y-4 mb-9">
              {studentPoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-[#7DB89A] leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link href="/register" className="inline-flex items-center gap-2 bg-emerald-400 text-[#08100E] font-bold rounded-full px-6 py-3 text-sm hover:bg-emerald-300 transition-colors">
                Create Free Account
              </Link>
            </motion.div>
          </ScrollReveal>

          {/* Mockup */}
          <ScrollReveal>
            <div className="bg-[#0D1A16] border border-[#1D3D30] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold text-[#3A6357] uppercase tracking-wider">My Complaints</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-900 font-semibold px-3 py-1 rounded-full">2 Active</span>
              </div>
              {[
                { title: 'Broken water pipe — Block C', cat: 'Maintenance', status: 'In Progress', c: 'bg-blue-950 text-blue-400 border-blue-900' },
                { title: 'Missing exam result — BUS 201', cat: 'Academic', status: 'Pending', c: 'bg-amber-950 text-amber-400 border-amber-900' },
              ].map((item) => (
                <div key={item.title} className="bg-[#122B22] border border-[#1D3D30] rounded-xl p-4 mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F0FDF8] truncate">{item.title}</p>
                    <p className="text-xs text-[#3A6357] mt-0.5">{item.cat}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${item.c}`}>{item.status}</span>
                </div>
              ))}
              <div className="bg-emerald-950/50 border border-emerald-900/50 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#F0FDF8]">Hostel electricity restored</p>
                  <p className="text-xs text-emerald-400 mt-0.5">Resolved in 18 hrs</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── ADMIN ──────────────────────────────────────────── */}
      <section id="admin" className="py-24 px-4 bg-[#0D1A16]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Mockup */}
          <ScrollReveal>
            <div className="bg-[#08100E] border border-[#1D3D30] rounded-2xl p-6 order-last lg:order-first">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold text-[#3A6357] uppercase tracking-wider">Admin Queue</span>
                <span className="text-xs bg-red-950 text-red-400 border border-red-900 font-semibold px-3 py-1 rounded-full">12 Unresolved</span>
              </div>
              {[
                { title: 'Faulty generator, Hall 4', dept: 'Facilities', u: 'High', c: 'bg-red-950 text-red-400 border-red-900' },
                { title: 'Missing marks — ENG 301', dept: 'Faculty of Engineering', u: 'Medium', c: 'bg-amber-950 text-amber-400 border-amber-900' },
              ].map((item) => (
                <div key={item.title} className="bg-[#0D1A16] border border-[#1D3D30] rounded-xl p-4 mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F0FDF8] truncate">{item.title}</p>
                    <p className="text-xs text-[#3A6357] mt-0.5">{item.dept}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${item.c}`}>{item.u}</span>
                </div>
              ))}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[['84%', 'Resolution Rate'], ['31 hrs', 'Avg. Resolution']].map(([v, l]) => (
                  <div key={l} className="bg-[#0D1A16] border border-[#1D3D30] rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-emerald-400">{v}</p>
                    <p className="text-xs text-[#3A6357] mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <SectionLabel>For Administration</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black mb-7 leading-tight">
              Resolve faster, <span className="text-emerald-400">report better.</span>
            </h2>
            <ul className="space-y-4 mb-9">
              {adminPoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-[#7DB89A] leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────── */}
      <section id="stats" ref={statsRef} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <SectionLabel>By the Numbers</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black">Built for scale.</h2>
          </ScrollReveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {stats.map((s) => (
              <motion.div
                key={s.value}
                variants={fadeUp}
                className="bg-[#0D1A16] border border-[#1D3D30] rounded-2xl p-8 text-center hover:border-emerald-900 transition-colors"
              >
                <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2">{s.value}</p>
                <p className="text-xs text-[#3A6357] font-medium leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────── */}
      <section id="cta" className="py-24 px-4 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'repeating-radial-gradient(circle at 20px 20px, #00D97E 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,217,126,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight">
              Ready to transform student feedback at your university?
            </h2>
            <p className="text-[#7DB89A] text-lg mb-10">
              Join thousands of ABU students who no longer have to chase administrators in person.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-emerald-400 text-[#08100E] font-bold rounded-full px-10 py-4 text-base shadow-[0_0_48px_rgba(0,217,126,0.3)] hover:bg-emerald-300 transition-colors"
              >
                Get CampVoice Free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
