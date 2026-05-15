"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Shield,
  User,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Generate random sprinkles
  const [sprinkles, setSprinkles] = useState<{id: number, x: number, y: number, size: number, delay: number}[]>([]);

  useEffect(() => {
    const newSprinkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }));
    setSprinkles(newSprinkles);

    const fetchStats = async () => {
      try {
        const passes = await apiService.getGatePasses();
        setStats({
          pending: passes.filter((p: any) => !['APPROVED', 'REJECTED'].includes(p.status)).length,
          approved: passes.filter((p: any) => p.status === 'APPROVED').length,
          rejected: passes.filter((p: any) => p.status === 'REJECTED').length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Student Profile Overview Card with Sprinkles */}
      <Card className="bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden group min-h-[160px]">
        {/* Animated Sprinkles Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {sprinkles.map((s) => (
            <div 
              key={s.id}
              className="absolute bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                opacity: 0.4
              }}
            />
          ))}
          {/* Floating tiny balls */}
          <div className="absolute top-4 right-10 w-2 h-2 bg-accent rounded-full animate-bounce delay-75"></div>
          <div className="absolute bottom-10 left-1/2 w-3 h-3 bg-white/10 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
        
        <CardContent className="p-6 relative z-10 flex flex-col justify-center h-full">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground p-1 rounded-lg shadow-lg">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter drop-shadow-sm flex items-center gap-2">
                Hi {user?.name}!
                <span className="inline-block animate-bounce">👋</span>
              </h2>
              <div className="flex items-center gap-2 opacity-90 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full border border-white/5 w-fit">
                <GraduationCap className="w-3 h-3 text-accent" />
                {user?.rollNo} • {user?.department}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/request" className="block">
          <Card className="bg-accent text-accent-foreground border-none shadow-lg hover:scale-105 transition-transform cursor-pointer overflow-hidden relative group">
            <div className="absolute top-[-10px] right-[-10px] w-12 h-12 bg-white/20 rounded-full group-hover:scale-150 transition-transform"></div>
            <CardContent className="p-5 flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
                <PlusCircle className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">New Request</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/passes" className="block">
          <Card className="bg-white text-foreground border-none shadow-lg hover:scale-105 transition-transform cursor-pointer overflow-hidden relative group">
            <div className="absolute bottom-[-10px] left-[-10px] w-12 h-12 bg-primary/5 rounded-full group-hover:scale-150 transition-transform"></div>
            <CardContent className="p-5 flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
                <QrCode className="w-7 h-7 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">My Passes</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Breakdown */}
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Live Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-4 rounded-3xl bg-muted/30 border border-border/50 gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-xl font-black">{stats.pending}</span>
              <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Pending</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-3xl bg-primary/5 border border-primary/10 gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-xl font-black">{stats.approved}</span>
              <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Active</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-3xl bg-destructive/5 border border-destructive/10 gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <span className="text-xl font-black">{stats.rejected}</span>
              <span className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter">Rejected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Alert for Students */}
      <Card className="border-none bg-gradient-to-br from-accent/10 to-accent/5 shadow-inner">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <p className="text-[10px] font-black text-accent uppercase tracking-widest">Important Reminder</p>
              </div>
              <p className="text-xs font-bold mt-1 text-muted-foreground leading-relaxed">
                Campus entry closes at <span className="text-foreground">9:00 PM</span> sharp. Plan your return accordingly!
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}