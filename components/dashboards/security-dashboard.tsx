"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Scan, 
  User, 
  Clock, 
  LogIn, 
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Search,
  History,
  Loader2
} from 'lucide-react';

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
  qrCode?: string;
  scannedOut?: string;
  scannedIn?: string;
}

export function SecurityDashboard() {
  const { user } = useAuth();
  const [approvedPasses, setApprovedPasses] = useState<GatePass[]>([]);
  const [scannedOutPasses, setScannedOutPasses] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanInput, setScanInput] = useState('');
  const [scannedPass, setScannedPass] = useState<GatePass | null>(null);
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [approved, scannedOut] = await Promise.all([
        apiService.getApprovedGatePasses(),
        apiService.getGatePasses() // This will get all passes for security
      ]);
      setApprovedPasses(approved);
      setScannedOutPasses(scannedOut.filter((p: GatePass) => p.scannedOut && !p.scannedIn));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setScanMessage(null);
    setScannedPass(null);

    if (!scanInput.trim()) {
      setScanMessage({ type: 'error', text: 'Please enter a QR code or Pass ID' });
      return;
    }

    try {
      // Try to get gate pass by ID (extract ID from QR code if needed)
      const passId = scanInput.includes('GATEPASS:') 
        ? scanInput.split('|')[0].split(':')[1]
        : scanInput;

      const pass = await apiService.getGatePassById(passId);
      
      if (pass.status !== 'APPROVED') {
        setScanMessage({ type: 'error', text: 'This pass is not approved' });
        return;
      }

      setScannedPass(pass);
    } catch (error) {
      setScanMessage({ type: 'error', text: 'Invalid QR Code or Pass ID' });
    }
  };

  const handleLogEntry = async (type: 'out' | 'in') => {
    if (!scannedPass) return;

    setActionLoading(true);
    try {
      if (type === 'out') {
        await apiService.scanOut(scannedPass.id.toString());
      } else {
        await apiService.scanIn(scannedPass.id.toString());
      }

      setScanMessage({ 
        type: 'success', 
        text: `Student ${type === 'out' ? 'exit' : 'entry'} logged successfully!` 
      });
      setScanInput('');
      
      // Refresh data
      await fetchData();
      
      setTimeout(() => {
        setScannedPass(null);
        setScanMessage(null);
      }, 3000);
    } catch (error) {
      setScanMessage({ 
        type: 'error', 
        text: `Failed to log ${type === 'out' ? 'exit' : 'entry'}. Please try again.` 
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Security Dashboard</h2>
        <p className="text-muted-foreground">Scan QR codes and manage gate entry/exit</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="pt-3 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-success/10 flex-shrink-0">
                <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{approvedPasses.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Passes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-accent/10 flex-shrink-0">
                <LogOut className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{scannedOutPasses.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Students Out</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                <LogOut className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">
                  {approvedPasses.filter(p => p.scannedOut).length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Exits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 flex-shrink-0">
                <LogIn className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">
                  {approvedPasses.filter(p => p.scannedIn).length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner Section */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Enter QR code or Pass ID to verify student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter QR Code or Pass ID..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  className="pl-10 text-sm sm:text-base h-10 sm:h-12"
                />
              </div>
              <Button size="lg" onClick={handleScan} className="gap-2 w-full sm:w-auto">
                <QrCode className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">Verify</span>
              </Button>
            </div>

            {/* Scan Message */}
            {scanMessage && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                scanMessage.type === 'success' 
                  ? 'bg-success/10 text-success border border-success' 
                  : 'bg-destructive/10 text-destructive border border-destructive'
              }`}>
                {scanMessage.type === 'success' 
                  ? <CheckCircle2 className="w-5 h-5" />
                  : <AlertTriangle className="w-5 h-5" />
                }
                <span className="font-medium">{scanMessage.text}</span>
              </div>
            )}

            {/* Scanned Pass Details */}
            {scannedPass && (
              <div className="p-6 rounded-lg border-2 border-success bg-success/5">
                <div className="flex flex-col gap-2 sm:gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="w-6 sm:w-8 h-6 sm:h-8 text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-xl font-bold">{scannedPass.student.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{scannedPass.student.rollNo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-muted-foreground">Department:</span>
                      <p className="font-medium truncate">{scannedPass.student.department}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Year:</span>
                      <p className="font-medium">{scannedPass.student.year?.displayName || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Hostel:</span>
                      <p className="font-medium">
                        {scannedPass.student.hostel === 'DAYSCHOLAR' 
                          ? 'Day Scholar' 
                          : `${scannedPass.student.hostel} - Room ${scannedPass.student.roomNo || 'N/A'}`}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Destination:</span>
                      <p className="font-medium truncate">{scannedPass.nativePlace}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Purpose: {scannedPass.purpose}</p>
                    <div className="flex flex-col gap-1 text-xs sm:text-sm">
                      <span>Out: {new Date(scannedPass.outDateTime).toLocaleString()}</span>
                      <span>Return: {new Date(scannedPass.inDateTime).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
                    {scannedPass.scannedOut && !scannedPass.scannedIn ? (
                      <Badge className="bg-accent text-accent-foreground text-xs">Currently Out</Badge>
                    ) : scannedPass.scannedIn ? (
                      <Badge className="bg-success text-success-foreground text-xs">Returned</Badge>
                    ) : (
                      <Badge className="bg-success text-success-foreground text-xs">Pass Valid</Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {!scannedPass.scannedOut && (
                      <Button 
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full sm:w-auto"
                        onClick={() => handleLogEntry('out')}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                        ) : (
                          <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
                        )}
                        Log Exit
                      </Button>
                    )}
                    {scannedPass.scannedOut && !scannedPass.scannedIn && (
                      <Button 
                        size="lg"
                        className="bg-success hover:bg-success/90 text-success-foreground gap-2 w-full sm:w-auto"
                        onClick={() => handleLogEntry('in')}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                        ) : (
                          <LogIn className="w-4 sm:w-5 h-4 sm:h-5" />
                        )}
                        Log Entry
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Currently Out */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Students Currently Outside
          </CardTitle>
          <CardDescription>{scannedOutPasses.length} students are currently outside campus</CardDescription>
        </CardHeader>
        <CardContent>
          {scannedOutPasses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No students currently outside</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scannedOutPasses.map((pass) => (
                <div 
                  key={pass.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{pass.student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pass.student.rollNo} | {pass.student.hostel} | Going to: {pass.nativePlace}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-accent text-accent-foreground">Out</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since: {new Date(pass.scannedOut!).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}