'use client';

import Link from 'next/link';
import {
  FileText, Search, CheckCircle, ArrowRight, Smartphone, Building, Users, Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const androidUrl = process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL;

  const scrollToDownload = () => {
    const el = document.getElementById('mobile-app-download');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openDownload = (url?: string, fallbackMessage?: string) => {
    if (!url) {
      toast.info(fallbackMessage || 'Download link coming soon.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#2A2A2A]">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-10"
          style={{ 
            background: 'radial-gradient(ellipse at 50% 0%, rgb(26 83 26) 0%, transparent 70%)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A531A' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative max-w-4xl mx-auto z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[#1A531A] bg-[#F8FBF8] text-[#1A531A] text-sm font-semibold rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A531A] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A531A]" />
            </span>
            Live at Ahmadu Bello University, Zaria
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] mb-6 text-[#2A2A2A]">
            Your Voice.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A531A] to-[#2A7A2A]">
              Your Campus.
            </span>
            <br />
            <span className="text-[#1A531A]">
              Real Solutions.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[#525252] max-w-3xl mx-auto leading-relaxed mb-10">
            CampVoice gives Nigerian university students a powerful voice to report issues directly to university administration and ensures every complaint gets tracked until it&apos;s properly resolved.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#1A531A] text-white font-bold rounded-full px-8 py-4 text-base shadow-lg shadow-[#1A531A]/20 hover:bg-[#154515] transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Report an Issue <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={scrollToDownload}
              className="inline-flex items-center gap-2 border-2 border-[#1A531A] text-[#1A531A] font-semibold rounded-full px-6 py-3 hover:bg-[#F8FBF8] transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              Mobile App Download
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-3">
            {['50,000+ Students Served', '4 Complaint Categories', 'Real-Time Tracking'].map((chip) => (
              <span key={chip} className="bg-[#F8FBF8] border border-[#E6EBE6] text-[#525252] text-xs font-semibold px-4 py-2 rounded-full">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-[#F8FBF8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 text-[#2A2A2A]">
              Simple Process
            </h2>
            <p className="text-lg text-[#525252] max-w-3xl mx-auto">
              From reporting to resolution - clear steps every time
            </p>
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
              <div key={step.step} className="bg-[#FFFDF5] border border-[#E6EBE6] rounded-3xl p-8 hover:border-[#1A531A] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#F8FBF8] border border-[#1A531A] flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-[#1A531A]" />
                  </div>
                  <span className="text-5xl font-black text-[#E6EBE6] select-none">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-[#2A2A2A] mb-2">{step.title}</h3>
                <p className="text-[#525252] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Download */}
      <section id="mobile-app-download" className="py-24 px-4 bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 text-[#2A2A2A]">
              Mobile app download
            </h2>
            <p className="text-lg text-[#525252] max-w-3xl mx-auto">
              Lightweight builds optimized to load fast and respond instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#F8FBF8] border border-[#E6EBE6] rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFDF5] border border-[#1A531A] flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#1A531A]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2A2A2A]">Android</h3>
                  <p className="text-sm text-[#525252]">Direct APK download</p>
                </div>
              </div>
              <p className="text-[#525252] leading-relaxed mb-6">
                Download the latest APK and install on your device. If prompted, allow installs from unknown sources for your browser.
              </p>
              <button
                type="button"
                onClick={() => openDownload(androidUrl, 'Android APK link coming soon.')}
                className="inline-flex items-center gap-2 bg-[#1A531A] text-white font-bold rounded-full px-6 py-3 shadow-lg shadow-[#1A531A]/20 hover:bg-[#154515] transition-colors"
              >
                Download APK <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="students" className="py-24 px-4 bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 text-[#2A2A2A]">
              What Can You Report?
            </h2>
            <p className="text-lg text-[#525252] max-w-3xl mx-auto">
              Every aspect of campus life covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building,
                title: 'Maintenance',
                desc: 'Broken facilities, equipment issues, electrical problems',
              },
              {
                icon: Users,
                title: 'Academic',
                desc: 'Course-related problems, grading issues, library concerns',
              },
              {
                icon: Building,
                title: 'Hostel',
                desc: 'Housing problems, utilities, room maintenance',
              },
              {
                icon: Clock,
                title: 'Security',
                desc: 'Safety concerns, campus security, emergency issues',
              }
            ].map((category) => (
              <div key={category.title} className="bg-[#F8FBF8] border border-[#E6EBE6] rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FFFDF5] border border-[#1A531A] flex items-center justify-center">
                  <category.icon className="w-8 h-8 text-[#1A531A]" />
                </div>
                <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">{category.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section id="admin" className="py-20 px-4 bg-[#1A531A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5">
            Trusted by the ABU Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { number: '50,000+', label: 'Students Served' },
              { number: '95%', label: 'Resolution Rate' },
              { number: '24hrs', label: 'Avg Response Time' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.number}</div>
                <div className="text-[#E6EBE6] text-sm uppercase tracking-wider font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-[#F7F5F0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Why Choose CampVoice?
            </h2>
            <p className="text-lg text-[#475569] max-w-3xl mx-auto">
              Experience the full power of CampVoice optimized for Nigerian universities
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
              <div key={feature.title} className="bg-[#F8FBF8] border border-[#E7E5E4] rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-[#2A2A2A] mb-2">{feature.title}</h3>
                <p className="text-[#525252] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-24 px-4 bg-[#FFFDF5]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1A531A] rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2A7A2A] rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
            
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-3xl md:text-5xl font-black text-[#FFFFFF] mb-6 leading-tight">
                Experience CampVoice on the move
              </h2>
              <p className="text-[#E6EBE6] text-lg md:text-xl mb-10 max-w-xl">
                Download the mobile version for a seamless, optimized experience. Track complaints, receive instant push notifications, and submit issues directly from your phone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={() => openDownload(androidUrl, 'Android APK link coming soon.')}
                  className="flex items-center justify-center gap-3 bg-[#FFFDF5] text-[#1A531A] px-6 py-3.5 rounded-xl border border-[#E6EBE6] font-semibold"
                >
                  <Smartphone className="w-5 h-5" />
                  Download Android APK
                </button>
              </div>
            </div>
            
            <div className="hidden md:block w-64 h-80 bg-[#FFFDF5] rounded-3xl border-8 border-[#2A2A2A] shadow-2xl relative z-10 overflow-hidden transform rotate-3">
              <div className="absolute top-0 left-0 right-0 h-6 bg-[#2A2A2A] flex justify-center items-center">
                 <div className="w-16 h-1.5 bg-[#424242] rounded-full"></div>
              </div>
              <div className="p-4 pt-10 h-full flex flex-col gap-3">
                <div className="w-full h-8 bg-[#E6EBE6] rounded-md"></div>
                <div className="w-3/4 h-4 bg-[#E6EBE6] rounded-md"></div>
                <div className="w-full h-24 bg-[#E6EBE6] rounded-xl mt-4"></div>
                <div className="w-full h-24 bg-[#E6EBE6] rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-[#FFFDF5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#525252] max-w-3xl mx-auto">
              Quick answers to help you get started with CampVoice.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[{
              q: 'How does complaint tracking work?',
              a: 'After you submit a complaint, CampVoice generates a tracking number. You can monitor status updates (e.g., Submitted → In Review → In Progress → Resolved) from your dashboard.',
            }, {
              q: 'Is my identity anonymous to everyone?',
              a: 'Your details are protected from the public. University administrators handling the report may still need your information to follow up and resolve the issue effectively.',
            }, {
              q: 'What types of issues can I report?',
              a: 'Maintenance, security, hostel issues, utilities, academic-related concerns, and other campus problems that affect student wellbeing.',
            }, {
              q: 'How fast will I get a response?',
              a: 'Response time depends on the category and workload, but you will always see status updates as your complaint progresses.',
            }, {
              q: 'Can I attach photos or evidence?',
              a: 'Yes, attachments are supported where available. If uploads are temporarily unavailable on your device, you can still submit the report and add details in the description.',
            }, {
              q: 'Will I receive notifications?',
              a: 'Yes. You can receive notifications when your complaint status changes. Email notifications are available, and push notifications are supported on the mobile app.',
            }].map((item) => (
              <div key={item.q} className="bg-[#F8FBF8] border border-[#E7E5E4] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">{item.q}</h3>
                <p className="text-[#525252] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#F8FBF8]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5 text-[#2A2A2A]">
            Ready to Transform Your University Experience?
          </h2>
          <p className="text-lg text-[#525252] mb-10">
            Join thousands of students already using CampVoice to make their voices heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#1A531A] text-white font-bold rounded-full px-10 py-4 text-lg shadow-lg shadow-[#1A531A]/20 hover:bg-[#154515] transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Your Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border-2 border-[#1A531A] text-[#1A531A] font-semibold rounded-full px-8 py-4 hover:bg-[#FFFDF5] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
