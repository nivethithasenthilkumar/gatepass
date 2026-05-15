"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole, Department, Year, HostelType } from '@/lib/types';
import { validatePassword, validatePhoneNumber, validateRollNumber, validateName } from '@/lib/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole,
    department: '' as Department,
    year: '' as Year,
    hostel: '' as HostelType,
    roomNo: '',
    floorNo: '',
    parentPhone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const newErrors: Record<string, string> = {};

    // Validate Roll Number
    const rollNoVal = validateRollNumber(formData.rollNo);
    if (!rollNoVal.isValid) newErrors.rollNo = rollNoVal.error || '';

    // Validate Name
    const nameVal = validateName(formData.name);
    if (!nameVal.isValid) newErrors.name = nameVal.error || '';

    // Validate Password
    const passVal = validatePassword(formData.password);
    if (!passVal.isValid) newErrors.password = passVal.error || '';

    // Validate Password match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate Phone Number (only for students)
    if (formData.role === 'student' && formData.parentPhone) {
      const phoneVal = validatePhoneNumber(formData.parentPhone);
      if (!phoneVal.isValid) newErrors.parentPhone = phoneVal.error || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError('Please fix the errors below');
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const result = await register({
        rollNo: formData.rollNo,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        department: formData.department || undefined,
        year: formData.year || undefined,
        hostel: formData.hostel || undefined,
        roomNo: formData.roomNo || undefined,
        floorNo: formData.floorNo || undefined,
        parentPhone: formData.parentPhone || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/'), 1500);
      } else {
        setError(result.message || 'Registration failed');
        setIsLoading(false);
      }
    }, 500);
  };

  const isStudent = formData.role === 'student';
  const isAcademicStaff = formData.role === 'advisor' || formData.role === 'hod';
  const isHostelStaff = formData.role === 'warden' || formData.role === 'deputy_warden';

  return (
    <div className="scroll-container">
      <div className="flex flex-col items-center justify-center p-4 pt-4 pb-8 min-h-fit">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm border border-primary/5">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
              Create Account
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Gate Pass Management
            </p>
          </div>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">Registration Form</CardTitle>
            <CardDescription className="text-xs">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {success ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Registration Successful!</h3>
                <p className="text-muted-foreground">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rollNo" className="text-xs">Roll Number / ID *</Label>
                    <Input
                      id="rollNo"
                      placeholder="e.g., STU001"
                      value={formData.rollNo}
                      onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                      required
                      className={`h-9 text-sm ${fieldErrors.rollNo ? 'border-destructive' : ''}`}
                    />
                    {fieldErrors.rollNo && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.rollNo}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className={`h-9 text-sm ${fieldErrors.name ? 'border-destructive' : ''}`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                    required
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="advisor">Advisor</SelectItem>
                      <SelectItem value="hod">HOD</SelectItem>
                      <SelectItem value="warden">Warden</SelectItem>
                      <SelectItem value="deputy_warden">Deputy Warden</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(isStudent || (isAcademicStaff && formData.role !== 'hod')) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs">Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, department: value as Department }))}
                        required
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="CCE">CCE</SelectItem>
                          <SelectItem value="AIML">AIML</SelectItem>
                          <SelectItem value="AIDS">AIDS</SelectItem>
                          <SelectItem value="MECH">MECH</SelectItem>
                          <SelectItem value="CIVIL">CIVIL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="year" className="text-xs">Year *</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, year: value as Year }))}
                        required
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {formData.role === 'hod' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="department" className="text-xs">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value as Department }))}
                      required
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="CCE">CCE</SelectItem>
                        <SelectItem value="AIML">AIML</SelectItem>
                        <SelectItem value="AIDS">AIDS</SelectItem>
                        <SelectItem value="MECH">MECH</SelectItem>
                        <SelectItem value="CIVIL">CIVIL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(isStudent || isHostelStaff) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="hostel" className="text-xs">Hostel / Day Scholar *</Label>
                      <Select
                        value={formData.hostel}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, hostel: value as HostelType }))}
                        required
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.role === 'deputy_warden' ? (
                            <>
                              <SelectItem value="G">Girls Hostel (G)</SelectItem>
                              <SelectItem value="BH1">Boys Hostel (BH)</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="G">Girls Hostel (G)</SelectItem>
                              <SelectItem value="BH1">Boys Hostel 1 (BH1)</SelectItem>
                              <SelectItem value="BH2">Boys Hostel 2 (BH2)</SelectItem>
                              <SelectItem value="BH3">Boys Hostel 3 (BH3)</SelectItem>
                              {isStudent && <SelectItem value="dayscholar">Day Scholar</SelectItem>}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {isStudent && formData.hostel && formData.hostel !== 'dayscholar' && (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="floorNo" className="text-xs">Floor Number *</Label>
                          <Input
                            id="floorNo"
                            placeholder="e.g., 1"
                            value={formData.floorNo}
                            onChange={(e) => setFormData(prev => ({ ...prev, floorNo: e.target.value }))}
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="roomNo" className="text-xs">Room Number *</Label>
                          <Input
                            id="roomNo"
                            placeholder="e.g., 101"
                            value={formData.roomNo}
                            onChange={(e) => setFormData(prev => ({ ...prev, roomNo: e.target.value }))}
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                      </>
                    )}

                  </div>
                )}

                {isStudent && (
                  <div className="space-y-1.5">
                    <Label htmlFor="parentPhone" className="text-xs">Parent Phone Number *</Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      placeholder="e.g., 9876543210"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      maxLength={10}
                      required
                      className={`h-9 text-sm ${fieldErrors.parentPhone ? 'border-destructive' : ''}`}
                    />
                    {fieldErrors.parentPhone && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.parentPhone}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className={`h-9 text-sm ${fieldErrors.password ? 'border-destructive' : ''}`}
                    />
                    {fieldErrors.password && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs">Confirm *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className={`h-9 text-sm ${fieldErrors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-2 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-destructive text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 shadow-sm"
                  disabled={isLoading || !formData.role}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
