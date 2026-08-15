'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, User, MessageSquare, LogOut, Eye, BarChart3, Car,
  Loader2, Award, Settings, ShoppingBag, Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'DASHBOARD', href: '/admin' },
  { icon: Car, label: 'VEHICLE CATALOG', href: '/admin/projects' },
  { icon: User, label: 'AGENT PROFILE', href: '/admin/profile' },
  { icon: Award, label: 'HAPPY CLIENTS', href: '/admin/certificates' },
  { icon: MessageSquare, label: 'INQUIRIES', href: '/admin/messages' },
  { icon: BarChart3, label: 'SALES ANALYTICS', href: '/admin/analytics' },
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
    <div className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50 shadow-2xl">
      <div className="p-8 border-b border-gray-50 bg-[#0E2356]">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Car className="text-[#E31B23] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">
              SUZUKI
            </h1>
            <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-black mt-1">ADMIN CONSOLE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto bg-white">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.label} whileHover={{ x: 5 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-[#E31B23] text-white shadow-xl shadow-red-200' 
                    : 'text-[#0E2356] hover:text-[#E31B23] hover:bg-red-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#0E2356]/40'}`} />
                <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50 space-y-3 bg-slate-50">
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full border-gray-200 bg-white text-[#0E2356] hover:text-[#E31B23] hover:border-[#E31B23] justify-start h-14 rounded-xl shadow-sm font-black text-[10px] tracking-widest uppercase"
          >
            <Eye className="w-4 h-4 mr-3" />
            Live Showroom
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start h-14 rounded-xl font-black text-[10px] tracking-widest uppercase"
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
        <Loader2 className="w-12 h-12 animate-spin text-[#E31B23]" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFBFA] text-gray-900 font-body">
      <AdminSidebar />
      <main className="ml-72 p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
