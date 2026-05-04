'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, PlusCircle, LogOut, ShieldCheck } from 'lucide-react';

export function Sidebar({
  mobileOpen = false,
  onNavigate,
}: {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/complaints/new', label: 'New Complaint', icon: PlusCircle },
  ];
  
  const adminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
  ];

  const superAdminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
    { href: '/admin/users', label: 'Manage Admins', icon: ShieldCheck },
  ];
  
  const links = user?.role === 'super_admin' ? superAdminLinks : user?.role === 'admin' ? adminLinks : studentLinks;

  const NavLinks = ({ mode }: { mode: 'desktop' | 'mobile' }) => (
    <nav className={mode === 'desktop' ? 'flex-1 py-6 px-3 space-y-1' : 'py-4 px-3 space-y-1'}>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'bg-olive-800 text-white' : 'text-olive-200 hover:bg-olive-800/50 hover:text-white'
            }`}
          >
            <link.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-olive-300' : 'text-olive-400'}`} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="w-64 bg-olive-900 text-white min-h-screen flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-olive-800">
          <h1 className="text-2xl font-bold tracking-tight">Camp<span className="text-olive-300">Voice</span></h1>
        </div>
        <NavLinks mode="desktop" />
        <div className="p-4 border-t border-olive-800">
          <button
            onClick={() => logout()}
            className="flex w-full items-center px-3 py-2.5 rounded-md text-sm font-medium text-olive-200 hover:bg-danger/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onNavigate} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-olive-900 text-white flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-olive-800">
              <h1 className="text-2xl font-bold tracking-tight">Camp<span className="text-olive-300">Voice</span></h1>
            </div>
            <NavLinks mode="mobile" />
            <div className="p-4 border-t border-olive-800">
              <button
                onClick={() => {
                  onNavigate?.();
                  logout();
                }}
                className="flex w-full items-center px-3 py-2.5 rounded-md text-sm font-medium text-olive-200 hover:bg-danger/20 hover:text-red-400 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
