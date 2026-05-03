import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'CampVoice — Student Complaint & Feedback System',
  description: 'CampVoice gives Nigerian university students a transparent, accountable channel to raise issues — and gives administration the tools to actually resolve them.',
  keywords: ['student complaints', 'university feedback', 'ABU Zaria', 'Ahmadu Bello University', 'campus issues'],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#08100E]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
