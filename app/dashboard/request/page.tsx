"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  FileText, 
  AlertTriangle, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ClipboardCheck
} from 'lucide-react';

export default function RequestPassPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    purpose: '',
    nativePlace: '',
    outDateTime: '',
    inDateTime: '',
    passType: 'CASUAL',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiService.createGatePass(formData);
      router.push('/dashboard/passes');
    } catch (error) {
      console.error('Failed to create gate pass:', error);
      alert('Failed to create gate pass. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl font-bold">New Request</h1>
        </div>

        <Card className="border-none shadow-xl bg-gradient-to-br from-background to-muted/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Request Details
            </CardTitle>
            <CardDescription className="text-xs">
              Provide necessary information for your leave approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pass Type
                </Label>
                <RadioGroup
                  value={formData.passType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, passType: value }))}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`relative flex items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${formData.passType === 'CASUAL' ? 'border-primary bg-primary/5 text-primary' : 'border-muted bg-muted/20 text-muted-foreground'}`}>
                    <RadioGroupItem value="CASUAL" id="casual" className="sr-only" />
                    <Label htmlFor="casual" className="cursor-pointer font-bold text-sm text-center">
                      Casual
                    </Label>
                  </div>
                  <div className={`relative flex items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${formData.passType === 'EMERGENCY' ? 'border-destructive bg-destructive/5 text-destructive' : 'border-muted bg-muted/20 text-muted-foreground'}`}>
                    <RadioGroupItem value="EMERGENCY" id="emergency" className="sr-only" />
                    <Label htmlFor="emergency" className="cursor-pointer font-bold text-sm text-center flex items-center gap-2">
                      Emergency
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Purpose of Leave</Label>
                <div className="relative">
                  <Textarea
                    id="purpose"
                    placeholder="E.g., Medical checkup, Home visit..."
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    className="min-h-[100px] bg-muted/30 border-none focus-visible:ring-primary rounded-xl"
                    required
                  />
                  <FileText className="absolute right-3 top-3 w-4 h-4 text-muted-foreground opacity-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nativePlace" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination</Label>
                <div className="relative">
                  <Input
                    id="nativePlace"
                    placeholder="Enter destination city/place"
                    value={formData.nativePlace}
                    onChange={(e) => setFormData(prev => ({ ...prev, nativePlace: e.target.value }))}
                    className="bg-muted/30 border-none focus-visible:ring-primary rounded-xl pl-10"
                    required
                  />
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="outDateTime" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Departure</Label>
                  <div className="relative">
                    <Input
                      id="outDateTime"
                      type="datetime-local"
                      value={formData.outDateTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, outDateTime: e.target.value }))}
                      className="bg-muted/30 border-none focus-visible:ring-primary rounded-xl pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inDateTime" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expected Return</Label>
                  <div className="relative">
                    <Input
                      id="inDateTime"
                      type="datetime-local"
                      value={formData.inDateTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, inDateTime: e.target.value }))}
                      className="bg-muted/30 border-none focus-visible:ring-primary rounded-xl pl-10"
                      required
                    />
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-2xl shadow-lg shadow-primary/20 text-sm font-bold uppercase tracking-widest gap-2">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
