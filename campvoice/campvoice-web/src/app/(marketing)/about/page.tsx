'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { fadeUp, fadeIn, stagger } from '@/lib/animations';

const values = [
  {
    icon: Eye,
    title: 'Transparency',
    desc: 'Every complaint is logged, visible, and tracked. Students can see exactly where their issue stands at every stage of the process.',
  },
  {
    icon: Shield,
    title: 'Accountability',
    desc: 'Administrators are notified, assigned, and timestamped on every action. There is no more "we never received it" for any complaint.',
  },
  {
    icon: Zap,
    title: 'Efficiency',
    desc: 'Structured categories, smart routing, and digital workflows mean issues reach the right desk within minutes — not weeks.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-emerald-800 text-white pt-36 pb-24 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'repeating-radial-gradient(circle at 20px 20px, #ffffff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p variants={fadeIn} initial="hidden" animate="visible" className="text-sm font-bold uppercase tracking-widest text-emerald-300 mb-4">
            About CampVoice
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-7"
          >
            Built to give every Nigerian student a voice.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xl text-emerald-200 max-w-2xl leading-relaxed"
          >
            CampVoice is a digital infrastructure layer between students and university management — turning informal complaints into accountable, trackable resolutions.
          </motion.p>
        </div>
      </section>

      {/* ─── VISION + MISSION ─── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">Our Vision</p>
            <h2 className="text-3xl font-black text-zinc-900 mb-6">A university system where no complaint goes unanswered.</h2>
            <p className="text-zinc-600 leading-relaxed mb-4">
              We envision an era in Nigerian higher education where every student feels empowered to report a problem — knowing it will land in the right hands, be actioned, and be resolved. Not next semester. This week.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              CampVoice aims to become the standard complaint management infrastructure for public and private universities across Nigeria — helping institutions become genuinely student-centred.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">Our Mission</p>
            <h2 className="text-3xl font-black text-zinc-900 mb-6">Three clear commitments.</h2>
            <ul className="space-y-5">
              {[
                { title: 'Remove friction', desc: 'Make it as easy as sending a WhatsApp message to raise a campus issue formally.' },
                { title: 'Create accountability', desc: 'Ensure every complaint is assigned, managed, and resolved with a clear audit trail.' },
                { title: 'Enable improvement', desc: 'Give university leadership data insights to identify and address systemic issues.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{item.title}</p>
                    <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="bg-zinc-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">Core Values</p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900">What we stand for.</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="bg-white/80 backdrop-blur-sm border border-zinc-200/70 rounded-2xl p-8 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                  <v.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{v.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── ORIGIN ─── */}
      <section className="bg-white py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeIn} className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-4">
              Why We Built This
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-zinc-900 mb-7">
              Because &quot;submit a written complaint&quot; isn&apos;t good enough anymore.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-600 leading-relaxed mb-6 text-lg">
              For years, Nigerian university students have been handing complaint letters to departmental offices, watching them be placed in trays — and never hearing back. Issues that could be resolved in days stretch into semesters.
            </motion.p>
            <motion.p variants={fadeUp} className="text-zinc-600 leading-relaxed mb-6">
              CampVoice was built because we experienced this first-hand at Ahmadu Bello University. A broken generator in the hostel that took three months to fix. Missing exam scores that almost derailed a semester. All because there was no structured channel for accountability.
            </motion.p>
            <motion.p variants={fadeUp} className="text-zinc-500 text-sm italic mb-12">
              Team profiles coming soon — we&apos;re a small group of students and engineers who care deeply about improving the campus experience.
            </motion.p>
            <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-emerald-800 text-white font-bold rounded-full px-8 py-4 shadow-lg hover:bg-emerald-700 transition-colors"
              >
                Start with your university
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
