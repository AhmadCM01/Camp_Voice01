'use client';

import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} disabled={!onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-olive-600 relative"
          onClick={() => router.push('/notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
          ) : null}
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-bold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none text-gray-900">{user?.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
