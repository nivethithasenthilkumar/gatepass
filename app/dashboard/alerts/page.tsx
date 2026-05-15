"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiService } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusText, getStatusColor } from '@/lib/types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  MapPin,
  Building2,
  Home,
  AlertTriangle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface GatePass {
  id: number;
  student: any;
  purpose: string;
  nativePlace: string;
  outDateTime: string;
  inDateTime: string;
  passType: string;
  status: string;
  createdAt: string;
  approvals: any[];
}

export default function AlertsPage() {
  const { user } = useAuth();
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<GatePass | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchGatePasses();
  }, []);

  const fetchGatePasses = async () => {
    try {
      const passes = await apiService.getPendingGatePasses();
      setGatePasses(passes);
    } catch (error) {
      console.error('Failed to fetch gate passes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pass: GatePass) => {
    setActionLoading(pass.id);
    try {
      await apiService.approveGatePass(pass.id.toString(), 'APPROVED');
      await fetchGatePasses();
    } catch (error) {
      console.error('Failed to approve gate pass:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (selectedPass && rejectReason) {
      setActionLoading(selectedPass.id);
      try {
        await apiService.approveGatePass(selectedPass.id.toString(), 'REJECTED', rejectReason);
        await fetchGatePasses();
        setShowRejectDialog(false);
        setSelectedPass(null);
        setRejectReason('');
      } catch (error) {
        console.error('Failed to reject gate pass:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Checking for alerts...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-xl font-bold">Pending Alerts</h1>
            <p className="text-xs text-muted-foreground">Requests requiring your attention</p>
          </div>
          <Badge variant="destructive" className="animate-pulse h-6">
            {gatePasses.length} New
          </Badge>
        </div>

        {gatePasses.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">All caught up!</p>
                <p className="text-xs text-muted-foreground">No pending student requests at the moment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {gatePasses.map((pass) => (
              <Card key={pass.id} className={`${pass.passType === 'EMERGENCY' ? 'border-l-4 border-l-destructive shadow-md' : 'border-l-4 border-l-primary'}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                          {pass.student.photo ? (
                            <img src={pass.student.photo} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{pass.student.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                            {pass.student.rollNo} • {pass.student.department}
                          </p>
                        </div>
                      </div>
                      <Badge variant={pass.passType === 'EMERGENCY' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {pass.passType}
                      </Badge>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-sm font-medium italic">"{pass.purpose}"</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {pass.nativePlace}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(pass.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-success hover:bg-success/90 h-10 gap-1"
                        onClick={() => handleApprove(pass)}
                        disabled={actionLoading === pass.id}
                      >
                        {actionLoading === pass.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-destructive border-destructive hover:bg-destructive/5 h-10 gap-1"
                        onClick={() => {
                          setSelectedPass(pass);
                          setShowRejectDialog(true);
                        }}
                        disabled={actionLoading === pass.id}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="max-w-[90vw] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>Why are you rejecting this gate pass?</DialogDescription>
            </DialogHeader>
            <Textarea 
              placeholder="Enter reason..." 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter className="flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={!rejectReason || actionLoading === selectedPass?.id}>
                {actionLoading === selectedPass?.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
