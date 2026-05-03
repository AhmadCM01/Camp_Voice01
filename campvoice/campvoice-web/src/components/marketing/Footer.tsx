import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1A531A] border-t border-[#154515] text-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FFFDF5] flex items-center justify-center text-[#1A531A] font-black text-xs">
                CV
              </div>
              <span className="font-bold text-lg text-[#FFFFFF]">Camp<span className="text-[#E6EBE6]">Voice</span></span>
            </div>
            <p className="text-[#E6EBE6] text-sm max-w-xs leading-relaxed">
              Making Nigerian university administration transparent and accountable — one complaint at a time.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6EBE6] mb-5 opacity-80">Platform</h4>
            <ul className="space-y-3">
              {[{ href: '/', label: 'Home' }, { href: '/login', label: 'Sign In' }, { href: '/register', label: 'Get Started' }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#FFFDF5] hover:text-[#E6EBE6] hover:underline transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6EBE6] mb-5 opacity-80">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-sm text-[#FFFDF5] hover:text-[#E6EBE6] hover:underline transition-all">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#154515] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#E6EBE6]">
            © {new Date().getFullYear()} CampVoice. Built for Ahmadu Bello University, Zaria.
          </p>
          <p className="text-xs text-[#E6EBE6] font-semibold tracking-widest uppercase opacity-80">
            Transparency · Accountability · Efficiency
          </p>
        </div>
      </div>
    </footer>
  );
}
