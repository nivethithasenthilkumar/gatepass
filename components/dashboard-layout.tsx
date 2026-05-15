"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Users, 
  Shield 
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getGreeting = (name: string) => {
    const hour = new Date().getHours();
    let timeMsg = "";
    if (hour < 12) timeMsg = "Good Morning";
    else if (hour < 17) timeMsg = "Good Afternoon";
    else timeMsg = "Good Evening";
    
    return (
      <span className="flex items-center justify-center gap-2 animate-pulse">
        ✨ {timeMsg}, {name}! Welcome back to your Gate Pass Portal! ✨
      </span>
    );
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'student': return <GraduationCap className="w-5 h-5" />;
      case 'advisor': return <Users className="w-5 h-5" />;
      case 'hod': return <Building2 className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getRoleName = () => {
    switch (user.role) {
      case 'student': return 'Student';
      case 'advisor': return 'Advisor';
      case 'hod': return 'HOD';
      case 'warden': return 'Warden';
      case 'deputy_warden': return 'Deputy Warden';
      case 'principal': return 'Principal';
      case 'security': return 'Security';
      default: return user.role;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Scrollable Area */}
      <div className="scroll-container flex flex-col">
        {/* Mobile-Only Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md shadow-sm">
          <div className="w-full px-4">
            <div className="flex h-16 items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-foreground leading-none">Gate Pass</h1>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Management</p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <p className="text-xs font-bold text-foreground truncate max-w-[80px]">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{getRoleName()}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-destructive/10 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Greeting Banner */}
        <div className="bg-gradient-to-r from-primary to-purple-700 text-primary-foreground py-2 px-4">
          <p className="text-[11px] text-center font-medium">
            {user.role === 'student' 
              ? getGreeting(user.name.split(' ')[0])
              : `Good Day, ${user.name.split(' ')[0]}! Check alerts.`}
          </p>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full px-4 py-4 pb-24">
          {children}
        </main>
      </div>

      {/* Fixed Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
