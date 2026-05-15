"use client";

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusText, getStatusColor } from '@/lib/types';
import { 
  QrCode, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Calendar,
  MapPin,
  ChevronRight,
  History,
  ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyPassesPage() {
  const router = useRouter();
  const [gatePasses, setGatePasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGatePasses();
  }, []);

  const fetchGatePasses = async () => {
    try {
      const passes = await apiService.getGatePasses();
      setGatePasses(passes);
    } catch (error) {
      console.error('Failed to fetch gate passes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">My QR Passes</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <QrCode className="w-10 h-10 animate-pulse text-primary opacity-20" />
            <p className="text-sm text-muted-foreground animate-pulse">Fetching your passes...</p>
          </div>
        ) : gatePasses.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="py-16 text-center space-y-4">
              <History className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <div>
                <p className="font-bold text-muted-foreground">No Passes Found</p>
                <p className="text-xs text-muted-foreground/60">Your approved QR passes will appear here.</p>
              </div>
              <Button size="sm" onClick={() => router.push('/dashboard/request')}>
                Request Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {gatePasses.map((pass) => (
              <Card key={pass.id} className="border-none shadow-md overflow-hidden bg-gradient-to-br from-background to-muted/30">
                <CardContent className="p-0">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={pass.passType === 'EMERGENCY' ? 'destructive' : 'secondary'} className="text-[10px] font-black uppercase tracking-tighter">
                        {pass.passType}
                      </Badge>
                      <Badge className={`${getStatusColor(pass.status.toLowerCase() as any)} text-[10px] font-black uppercase tracking-tighter`}>
                        {getStatusText(pass.status.toLowerCase() as any)}
                      </Badge>
                    </div>

                    <div className="flex gap-4">
                      {pass.status === 'APPROVED' && pass.qrCode ? (
                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                          <div className="p-2 bg-white rounded-xl shadow-inner border border-border/50 group hover:scale-105 transition-transform">
                            <img 
                              src={pass.qrCode} 
                              alt="QR Code" 
                              className="w-20 h-20"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-primary animate-pulse uppercase">Active Pass</p>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-muted/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashed">
                          <QrCode className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2 min-w-0">
                        <h3 className="font-bold text-sm line-clamp-1">{pass.purpose}</h3>
                        <div className="space-y-1">
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-primary" /> {pass.nativePlace}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-primary" /> {new Date(pass.outDateTime).toLocaleDateString()}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-primary" /> {new Date(pass.outDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Simple Approval History in Cards */}
                    {pass.approvals.length > 0 && (
                      <div className="pt-3 border-t border-border/50 flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                        {pass.approvals.map((approval: any, idx: number) => (
                          <div key={idx} className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase truncate max-w-[50px]">{approval.role.split('_')[0]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
