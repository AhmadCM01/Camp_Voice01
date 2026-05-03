'use client';

import Link from 'next/link';
import {
  FileText, Search, CheckCircle, ArrowRight, Smartphone
} from 'lucide-react';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 pb-20">
        {/* Background decoration */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #00D97E 0%, transparent 70%)' }}
        />
        
        <div className="relative max-w-4xl mx-auto z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-green-600 bg-green-50 text-green-600 text-sm font-semibold rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
            </span>
            Live at Ahmadu Bello University, Zaria
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] mb-6">
            Every student complaint,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
              tracked to resolution.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            CampVoice gives Nigerian university students a powerful voice to report issues directly to university administration — and ensures every complaint gets tracked until it&apos;s properly resolved.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-bold rounded-full px-8 py-4 text-base shadow-lg hover:bg-green-700 transition-colors"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mobile"
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 font-semibold rounded-full px-6 py-3 hover:bg-green-50 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              Download Mobile App
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-3">
            {['50,000+ Students at ABU', '4 Complaint Categories', 'Real-Time Tracking'].map((chip) => (
              <span key={chip} className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Simple Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                step: '01',
                title: 'Submit',
                desc: 'Fill a short form from any device. Select a category, describe the issue, and attach evidence.'
              },
              {
                icon: Search,
                step: '02',
                title: 'Track',
                desc: 'Log in anytime to see real-time status. Pending → In Progress → Resolved.'
              },
              {
                icon: CheckCircle,
                step: '03',
                title: 'Resolved',
                desc: 'Get notified the moment your issue is resolved. Every action is logged with a timestamp.'
              },
            ].map((step) => (
              <div key={step.step} className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-green-400 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-5xl font-black text-gray-400 select-none">{step.step}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Why Choose CampVoice?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the full power of CampVoice optimized for mobile devices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Submit complaints in under 2 minutes',
                desc: 'Quick form completion with smart categorization and photo uploads.'
              },
              {
                title: 'Track every status change in real time',
                desc: 'Get instant notifications when your complaint moves through the resolution process.'
              },
              {
                title: 'Email notifications for resolved issues',
                desc: 'Automatic email alerts when your complaint is marked as resolved.'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5">
            Ready to Transform Your University Experience?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Join thousands of students already using CampVoice to make their voices heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-bold rounded-full px-10 py-4 text-lg shadow-xl hover:bg-green-700 transition-colors"
            >
              Create Your Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
