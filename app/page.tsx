"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ShieldCheck, KeyRound, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!rollNo.trim()) {
      setError('Roll Number is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(rollNo, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials! Please check your details.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scroll-container h-full">
      <div className="flex flex-col items-center justify-center bg-background px-4 py-8 min-h-full">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      </div>

      {/* Main content */}
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm border border-primary/5">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              Gate Pass System
            </h1>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Happy Holidays! Safe Homes!
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo" className="text-xs sm:text-sm">Roll Number / ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="rollNo"
                    type="text"
                    placeholder="STU001"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="pl-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 text-sm"
                    required
                  />
                </div>
                {password && password.length < 8 && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Password must be at least 8 characters
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-xs sm:text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base h-10 sm:h-11"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {"Don't have an account?"}{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
