'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Smartphone, QrCode, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MobilePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios'>('android');

  const showAndroidComingSoon = () => toast.info('Google Play coming soon.');
  const showIosComingSoon = () => toast.info('iOS distribution coming soon.');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get CampVoice on Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
                Mobile Device
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Take your student complaint system anywhere. Submit issues, track progress, and get notifications - all from your phone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Android */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedPlatform === 'android'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-400'
              }`}
              onClick={() => setSelectedPlatform('android')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Android</h3>
                <p className="text-gray-600 mb-6">
                  For Android devices running Android 6.0 and above
                </p>
                <ul className="space-y-3 text-left text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Submit complaints on the go</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Offline mode support</span>
                  </li>
                </ul>
                <Link
                  href="#download-android"
                  className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download for Android
                </Link>
              </div>
            </motion.div>

            {/* iOS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedPlatform === 'ios'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-400'
              }`}
              onClick={() => setSelectedPlatform('ios')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">iOS</h3>
                <p className="text-gray-600 mb-6">
                  For iPhone and iPad running iOS 12.0 and above
                </p>
                <ul className="space-y-3 text-left text-gray-600 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Native iOS experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Face ID & Touch ID support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Widget support</span>
                  </li>
                </ul>
                <Link
                  href="#download-ios"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold rounded-lg px-6 py-3 hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download for iOS
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CampVoice Mobile?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the full power of CampVoice optimized for mobile devices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your data is encrypted and stored securely. We never share your information with third parties.'
              },
              {
                icon: QrCode,
                title: 'Quick Access',
                description: 'Scan QR codes to quickly report issues at specific locations around campus.'
              },
              {
                icon: Smartphone,
                title: 'Push Notifications',
                description: 'Get instant updates when your complaint is viewed, updated, or resolved.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <feature.icon className="w-8 h-8 text-green-600 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Instructions */}
      <section id="download-android" className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Download CampVoice for Android
          </h2>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <QrCode className="w-12 h-12 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 mb-2">Scan QR Code</p>
                <p className="text-gray-600">Point your phone camera at this QR code to download</p>
              </div>
            </div>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showAndroidComingSoon();
              }}
              className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold rounded-lg px-8 py-4 hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Google Play (Coming Soon)
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Requires Android 6.0 or later • 50MB storage space
          </p>
        </div>
      </section>

      {/* iOS Download */}
      <section id="download-ios" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Download CampVoice for iOS
          </h2>
          <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <QrCode className="w-12 h-12 text-white" />
              <div className="text-left">
                <p className="font-semibold text-white mb-2">Scan QR Code</p>
                <p className="text-gray-300">Point your iPhone camera at this QR code to download</p>
              </div>
            </div>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showIosComingSoon();
              }}
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold rounded-lg px-8 py-4 hover:bg-gray-100 transition-colors"
            >
              <Download className="w-5 h-5" />
              App Store (Coming Soon)
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Requires iOS 12.0 or later • Compatible with iPhone and iPad
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students already using CampVoice to make their voices heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold rounded-lg px-8 py-4 hover:bg-green-700 transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 font-semibold rounded-lg px-8 py-4 hover:bg-green-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
