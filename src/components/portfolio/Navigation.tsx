'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X, Car } from 'lucide-react';
import type { Profile } from '@/lib/types';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Inventory', href: '#projects' },
  { label: 'Happy Clients', href: '#certificates' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' }
];

export default function Navigation({ profile }: { profile: Profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-md py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="flex items-center gap-4 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-[#E31B23] p-2 rounded-lg shadow-lg group-hover:rotate-12 transition-transform">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-[#0E2356] leading-none">
                  SUZUKI
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#E31B23] leading-none mt-1">
                  OFFICIAL SALES
                </span>
              </div>
            </motion.a>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="text-gray-800 hover:text-[#E31B23] transition-colors relative group font-bold uppercase text-[11px] tracking-widest"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#E31B23] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Button
                className="bg-[#0E2356] text-white hover:bg-[#E31B23] border-0 font-bold px-8 h-12 rounded-xl shadow-lg transition-all"
                onClick={() => scrollTo('#contact')}
              >
                BOOK CONSULTATION
              </Button>
            </div>

            <div className="md:hidden">
              {hasMounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0E2356]"
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                  {isMobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {hasMounted && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white md:hidden"
          >
            <div className="p-6 flex justify-end">
               <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="w-8 h-8 text-[#0E2356]" />
               </Button>
            </div>
            <div className="container mx-auto px-8 pt-10">
              <div className="flex flex-col gap-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-4xl text-[#0E2356] font-black uppercase tracking-tighter py-2 border-b-2 border-gray-50 flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronRight className="w-8 h-8 text-[#E31B23]" />
                  </motion.a>
                ))}
                <Button
                  className="mt-10 bg-[#E31B23] text-white h-16 text-xl font-black rounded-2xl shadow-xl"
                  onClick={() => scrollTo('#contact')}
                >
                  BOOK CONSULTATION
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { ChevronRight as ChevronRightIcon } from 'lucide-react';