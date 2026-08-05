
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
import { Mountain, Loader2, AlertCircle, Lock, Mail } from 'lucide-react';
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

  // Redirect if already logged in with correct email
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
        toast({ title: "Login Successful", description: `Welcome back, Marvin!` });
        router.push('/admin');
      } else {
        setLoginError(`Unauthorized account. Access restricted.`);
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      // Detailed error messages for the user
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setLoginError("Maling email o password. Pakisubukang muli at siguraduhing tama ang iyong credentials.");
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError("Masyadong maraming failed attempts. Pakihintay muna bago sumubok ulit.");
      } else {
        setLoginError("Nagkaroon ng problema sa pag-login. Pakisiguradong naka-enable ang Email/Password sa Firebase Console.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#040403] p-4">
      <Card className="w-full max-w-sm bg-[#0a0a09] border-white/5 text-white shadow-2xl overflow-hidden relative pt-8">
        <CardHeader className="text-center space-y-6 relative">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/20">
              <Mountain className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-serif font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-primary font-medium">
              Verification for Marvin Paul Orozco.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 relative pt-4">
          <p className="text-xs text-center text-muted-foreground px-4 leading-relaxed opacity-70">
            Mangyaring ilagay ang iyong credentials para ma-access ang panel.
          </p>

          {loginError && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive text-xs py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold opacity-50">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border-white/10 pl-10 h-11 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold opacity-50">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border-white/10 pl-10 h-11 focus:border-primary"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-6 relative border-t border-white/5 py-8">
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-60">
              SECURE ADMIN ACCESS RESTRICTED
            </p>
            <Link href="/" className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-2 transition-all">
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
