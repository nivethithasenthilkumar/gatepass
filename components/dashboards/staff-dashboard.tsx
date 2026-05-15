"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BarChart3,
  CalendarDays
} from 'lucide-react';
import Link from 'next/link';

export function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    total: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const passes = await apiService.getPendingGatePasses();
        setStats(prev => ({ ...prev, pending: passes.length }));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative group">
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Action Required</p>
                <h3 className="text-2xl font-black">{stats.pending} Pending Requests</h3>
              </div>
              <Link href="/dashboard/alerts">
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-lg hover:scale-110 transition-all">
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
            </div>
            <Link href="/dashboard/alerts" className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
              <Bell className="w-3 h-3" />
              Check Alerts Now
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-accent/5 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center gap-2">
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">--</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-accent/5 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">--</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar/Today Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border border-dashed text-center">
              <p className="text-xs text-muted-foreground">No events scheduled for today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Overview */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Duty Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-bold">Duty Status</span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-success border-success/30 bg-success/5">
                On Duty
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground px-1">
              You are currently monitoring {user?.role === 'advisor' ? `Year ${user.year} of ${user.department}` : `${user?.department || 'all'} students`}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}