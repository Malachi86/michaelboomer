'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, User, Sparkles, FolderKanban, 
  MessageSquare, LogOut, Eye, BarChart3, Mountain,
  Quote, Loader2, Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: User, label: 'Profile', href: '/admin/profile' },
  { icon: Sparkles, label: 'Skills', href: '/admin/skills' },
  { icon: FolderKanban, label: 'Projects', href: '/admin/projects' },
  { icon: Award, label: 'Certificates', href: '/admin/certificates' },
  { icon: Quote, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: MessageSquare, label: 'Messages', href: '/admin/messages' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
];

const ADMIN_EMAIL = 'orozcomarvinpaul@gmail.com';

function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-white/5 flex flex-col z-50">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <Mountain className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Admin Panel
          </h1>
        </div>
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium opacity-60">Portfolio Manager</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.label} whileHover={{ x: 4 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full border-white/10 text-muted-foreground hover:text-white hover:border-primary/50 justify-start h-11"
          >
            <Eye className="w-4 h-4 mr-3" />
            View Portfolio
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 justify-start h-11"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== ADMIN_EMAIL) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You are not authorized to access the admin panel.',
        });
        signOut(auth).then(() => router.push('/login'));
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router, auth, toast]);

  if (loading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <AdminSidebar />
      <main className="ml-64 p-10">
        {children}
      </main>
    </div>
  );
}