'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from '@/firebase';
import { 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Mountain, Loader2, AlertCircle, Lock, Mail, Car } from 'lucide-react';
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = 'orozcomarvinpaul@gmail.com';

function LoginContent() {
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && user.email === ADMIN_EMAIL) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email === ADMIN_EMAIL) {
        toast({ title: "Welcome back!", description: "Access granted to dashboard." });
        router.push('/admin');
      } else {
        setLoginError("Unauthorized account. Access restricted.");
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setLoginError("Maling email o password. Pakisubukang muli.");
      } else {
        setLoginError("Nagkaroon ng problema sa pag-login. Pakisiguradong tama ang iyong credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] p-4 font-body">
      <Card className="w-full max-w-md bg-white border-none shadow-2xl rounded-[40px] overflow-hidden pt-12 pb-8">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#0E2356] flex items-center justify-center shadow-xl">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-[#0E2356] tracking-tighter uppercase">Admin Access</CardTitle>
            <CardDescription className="text-[#E31B23] font-black uppercase text-[10px] tracking-widest">
              Secure Portal for Michael Orozco
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {loginError && (
            <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-600 rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-bold uppercase tracking-tight">
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-4 w-4 text-gray-300" />
                <Input 
                  type="email"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-gray-100 h-12 pl-12 rounded-xl focus:border-[#E31B23] font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-4 w-4 text-gray-300" />
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-gray-100 h-12 pl-12 rounded-xl focus:border-[#E31B23] font-bold"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#0E2356] hover:bg-[#1a2f6b] text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Dashboard"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-6 border-t border-gray-50 mt-6 pt-8">
            <p className="text-[9px] text-center text-gray-300 uppercase tracking-[0.2em] font-black">
              AUTHORIZED PERSONNEL ONLY
            </p>
            <Link href="/" className="text-[#0E2356] hover:text-[#E31B23] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
              Return to Website
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}