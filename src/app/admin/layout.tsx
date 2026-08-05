'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, User, MessageSquare, LogOut, Eye, BarChart3, Car,
  Loader2, Award, Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Car, label: 'Inventory Manager', href: '/admin/projects' },
  { icon: User, label: 'Agent Profile', href: '/admin/profile' },
  { icon: Award, label: 'Happy Clients', href: '/admin/certificates' },
  { icon: MessageSquare, label: 'Inquiries', href: '/admin/messages' },
  { icon: BarChart3, label: 'Sales Analytics', href: '/admin/analytics' },
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
    <div className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 flex flex-col z-50 shadow-sm">
      <div className="p-8 border-b border-gray-100 bg-[#0E2356]">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <Car className="text-[#E31B23] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tighter leading-none">
              SUZUKI ADMIN
            </h1>
            <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">SALES CONSOLE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.label} whileHover={{ x: 5 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#E31B23] text-white shadow-lg shadow-red-200' 
                    : 'text-gray-700 hover:text-[#0E2356] hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/50">
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full border-gray-200 bg-white text-gray-700 hover:text-[#0E2356] hover:border-[#0E2356] justify-start h-12 rounded-xl shadow-sm"
          >
            <Eye className="w-4 h-4 mr-3" />
            <span className="font-bold">Live Website</span>
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start h-12 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="font-bold">Logout</span>
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar />
      <main className="ml-72 p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}