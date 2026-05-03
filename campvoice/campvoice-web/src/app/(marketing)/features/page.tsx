'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Bell, Paperclip, LayoutDashboard, Tag, GitBranch, BarChart2, CheckCircle, X, Minus, ArrowRight } from 'lucide-react';
import { fadeUp, fadeIn, stagger } from '@/lib/animations';

const studentFeatures = [
  {
    icon: FileText,
    title: 'Complaint Submission',
    desc: 'Submit any campus issue in under 2 minutes. Choose a category, describe the problem, and attach evidence — all from your phone or laptop.',
  },
  {
    icon: Search,
    title: 'Real-Time Tracking',
    desc: 'See exactly where your complaint stands. Every status update — Pending, In Progress, Resolved — is visible from your personal dashboard.',
  },
  {
    icon: Paperclip,
    title: 'File Attachments',
    desc: 'Upload photos and documents directly with your complaint. Visual evidence makes your case undeniable and speeds up resolution.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    desc: 'Get notified by email the moment your complaint is picked up, updated, or resolved. You\'re never left in the dark.',
  },
];

const adminFeatures = [
  {
    icon: LayoutDashboard,
    title: 'Centralized Dashboard',
    desc: 'Every complaint — across all departments and categories — flows into a single, clean dashboard for your administrative team.',
  },
  {
    icon: Tag,
    title: 'Status Management',
    desc: 'Move complaints from Pending to In Progress to Resolved with a single click. Status changes are timestamped and logged.',
  },
  {
    icon: GitBranch,
    title: 'Assignment & Routing',
    desc: 'Route complaints to the correct department automatically based on category, reducing response time and miscommunication.',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Reports',
    desc: 'Track resolution rates, average response times, and recurring issue patterns. Data that turns reactive management into proactive improvement.',
  },
];

const comparison = [
  { feature: 'Real-time tracking', cv: true, box: false, email: false },
  { feature: 'Accountability trail', cv: true, box: false, email: null },
  { feature: 'Speed of routing', cv: true, box: false, email: null },
  { feature: 'Evidence uploads', cv: true, box: false, email: null },
  { feature: 'Analytics & reporting', cv: true, box: false, email: false },
];

function FeatureCard({ icon: Icon, title, desc }: { icon: ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white/80 backdrop-blur-sm border border-zinc-200/70 rounded-2xl p-7 hover:shadow-md hover:border-emerald-200 transition-all duration-300 group"
    >
      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
        <Icon className="w-5 h-5 text-emerald-700" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function CheckCell({ value }: { value: boolean | null }) {
  if (value === true) return <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-400 mx-auto" />;
  return <Minus className="w-4 h-4 text-zinc-300 mx-auto" />;
}

export default function FeaturesPage() {
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
            Platform Features
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-7">
            Everything you need.
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-xl text-emerald-200 max-w-2xl leading-relaxed">
            From the moment a student submits a complaint to the moment administration marks it resolved — CampVoice handles the entire lifecycle.
          </motion.p>
        </div>
      </section>

      {/* ─── FOR STUDENTS ─── */}
      <section className="bg-zinc-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">For Students</p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900">Raise issues. Track resolution.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {studentFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </motion.div>
        </div>
      </section>

      {/* ─── FOR ADMINISTRATION ─── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">For Administration</p>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900">Manage. Assign. Resolve.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {adminFeatures.map((f) => <FeatureCard key={f.title} {...f} />)}
          </motion.div>
        </div>
      </section>

      {/* ─── NIGERIAN CONDITIONS ─── */}
      <section className="bg-zinc-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">Built for Nigerian Conditions</p>
            <h2 className="text-3xl font-black text-zinc-900 mb-10">Works even on slow networks.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap justify-center gap-4">
            {['Works on 3G', 'Low data usage', 'No app install needed (PWA-ready)'].map((chip) => (
              <motion.div
                key={chip}
                variants={fadeUp}
                className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-800 font-semibold px-5 py-3 rounded-full shadow-sm text-sm"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {chip}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-3">Why CampVoice?</p>
            <h2 className="text-3xl font-black text-zinc-900">CampVoice vs. the old way.</h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left p-5 font-bold text-zinc-700">Capability</th>
                  <th className="text-center p-5 font-bold text-emerald-800 bg-emerald-50">CampVoice</th>
                  <th className="text-center p-5 font-semibold text-zinc-500">Suggestion Box</th>
                  <th className="text-center p-5 font-semibold text-zinc-500">Email</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-zinc-100 ${i % 2 === 1 ? 'bg-zinc-50/50' : ''}`}>
                    <td className="p-5 font-medium text-zinc-700">{row.feature}</td>
                    <td className="p-5 bg-emerald-50/50"><CheckCell value={row.cv} /></td>
                    <td className="p-5"><CheckCell value={row.box} /></td>
                    <td className="p-5"><CheckCell value={row.email} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-emerald-800 py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-radial-gradient(circle at 20px 20px, #ffffff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative max-w-2xl mx-auto text-center px-4">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-black text-white mb-6">
            Tired of complaints being ignored? So are we.
          </motion.h2>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block mt-2">
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold rounded-full px-8 py-4 shadow-lg hover:bg-zinc-50 transition-colors">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
