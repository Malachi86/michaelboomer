'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, ChevronRight } from 'lucide-react';
import type { Profile } from '@/lib/types';

const navItems = [
  { label: 'HOME', href: '#hero' },
  { label: 'INVENTORY', href: '#projects' },
  { label: 'HAPPY CLIENTS', href: '#certificates' },
  { label: 'REVIEWS', href: '#testimonials' },
  { label: 'CONTACT', href: '#contact' }
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md py-3 shadow-sm' 
            : 'bg-white/50 py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="bg-[#E31B23] p-1.5 rounded-lg shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-[#0E2356] leading-none">
                  SUZUKI
                </span>
                <span className="text-[9px] font-bold tracking-widest text-[#E31B23] leading-none mt-0.5 uppercase">
                  Official Sales
                </span>
              </div>
            </motion.a>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="text-[#0E2356] hover:text-[#E31B23] transition-colors font-bold text-[11px] tracking-widest"
                >
                  {item.label}
                </a>
              ))}
              <Button
                className="bg-[#0E2356] text-white hover:bg-[#1a2f6b] font-bold px-6 h-10 rounded-md text-[11px] uppercase tracking-widest shadow-lg"
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
                  {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-[60] bg-white md:hidden"
          >
            <div className="p-6 flex justify-end">
               <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="w-8 h-8 text-[#0E2356]" />
               </Button>
            </div>
            <div className="container mx-auto px-8 pt-10">
              <div className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-2xl text-[#0E2356] font-black uppercase tracking-tighter py-4 border-b border-gray-50 flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronRight className="w-6 h-6 text-[#E31B23]" />
                  </motion.a>
                ))}
                <Button
                  className="mt-10 bg-[#0E2356] text-white h-14 text-lg font-black rounded-xl"
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