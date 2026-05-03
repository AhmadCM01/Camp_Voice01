'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, PlusCircle, LogOut, ShieldCheck } from 'lucide-react';

export function Sidebar() {
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

  return (
    <aside className="w-64 bg-olive-900 text-white min-h-screen flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-olive-800">
        <h1 className="text-2xl font-bold tracking-tight">Camp<span className="text-olive-300">Voice</span></h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
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
  );
}
