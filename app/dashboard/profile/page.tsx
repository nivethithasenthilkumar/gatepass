"use client";

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, User, Phone, Mail, Building2, MapPin, CheckCircle2, Shield } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photo, setPhoto] = useState<string | null>(user?.photo || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow camera access to take a photo.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // In a real app, you'd upload the base64 string to a server/storage
      // For now, we'll just mock the update in the local context
      await apiService.getCurrentUser(); // Just to check connectivity
      updateUser({ ...user, photo: photo || undefined });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'student': return 'Student';
      case 'advisor': return 'Advisor';
      case 'hod': return 'HOD';
      case 'warden': return 'Warden';
      case 'deputy_warden': return 'Deputy Warden';
      case 'principal': return 'Principal';
      case 'security': return 'Security';
      default: return user?.role;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden bg-muted flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <button 
                  onClick={startCamera}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{getRoleName()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera View */}
        {isCameraOpen && (
          <Card className="overflow-hidden border-primary shadow-xl ring-2 ring-primary/20">
            <CardHeader className="p-4 bg-primary/5">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Capture Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">Capture</Button>
                <Button onClick={stopCamera} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold">ID / Roll Number</Label>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.rollNo}</span>
                </div>
              </div>

              {user?.department && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">Department</Label>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.department}</span>
                  </div>
                </div>
              )}

              {user?.year && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">Year / Batch</Label>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.year} Year</span>
                  </div>
                </div>
              )}

              {user?.floorNo && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">Assigned Floor</Label>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Floor {user.floorNo}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold">Phone Number</Label>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {user?.role === 'student' ? user.parentPhone : '+91 9XXXX XXXXX'}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full gap-2 mt-4" 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
