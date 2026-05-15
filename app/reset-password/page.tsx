"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [rollNo, setRollNo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Enter your Roll Number to receive a password reset link
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>Password Recovery</CardTitle>
            <CardDescription>
              {"We'll send a reset link to your registered email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#22CFCD] mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#1C1C1C]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
                <p className="text-muted-foreground mb-4">
                  {"We've sent a password reset link to your registered email address."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {"Didn't receive the email? Check your spam folder or try again."}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number / ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rollNo"
                      type="text"
                      placeholder="Enter your Roll Number"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
