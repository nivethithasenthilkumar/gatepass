"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  User, 
  Bell, 
  LayoutDashboard, 
  PlusCircle, 
  QrCode 
} from 'lucide-react';

export function MobileBottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  // Navigation items for Staff (Non-students)
  const staffItems = [
    { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Alerts', icon: Bell, path: '/dashboard/alerts' },
    { label: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  // Navigation items for Students
  const studentItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Request', icon: PlusCircle, path: '/dashboard/request' },
    { label: 'QR Pass', icon: QrCode, path: '/dashboard/passes' },
    { label: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  const items = user.role === 'student' ? studentItems : staffItems;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 w-full px-2">
        {items.map((item) => {
          const ActiveIcon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-primary/10' : 'hover:bg-muted/50'}`}>
                <ActiveIcon className={`${active ? 'w-6 h-6' : 'w-5 h-5 opacity-70'}`} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-tighter transition-all ${active ? 'scale-100' : 'scale-95 opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
