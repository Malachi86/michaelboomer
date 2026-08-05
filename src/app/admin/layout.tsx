'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, User, Sparkles, FolderKanban, 
  MessageSquare, LogOut, Eye, BarChart3, Car,
  Quote, Loader2, Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Car, label: 'Inventory', href: '/admin/projects' },
  { icon: User, label: 'Agent Profile', href: '/admin/profile' },
  { icon: Award, label: 'Proof of Sales', href: '/admin/certificates' },
  { icon: MessageSquare, label: 'Leads', href: '/admin/messages' },
  { icon: Sparkles, label: 'Agent Status', href: '/admin/skills' },
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
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      <div className="p-6 border-b border-gray-100 bg-[#0E2356]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#E31B23] font-bold text-xl">S</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Suzuki Admin
          </h1>
        </div>
        <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Sales Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.label} whileHover={{ x: 4 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#E31B23] text-white shadow-md' 
                    : 'text-gray-600 hover:text-[#0E2356] hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full border-gray-200 text-gray-600 hover:text-[#0E2356] hover:border-[#0E2356] justify-start h-11"
          >
            <Eye className="w-4 h-4 mr-3" />
            View Website
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start h-11"
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
          description: 'Unauthorized access.',
        });
        signOut(auth).then(() => router.push('/login'));
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router, auth, toast]);

  if (loading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar />
      <main className="ml-64 p-10">
        {children}
      </main>
    </div>
  );
}