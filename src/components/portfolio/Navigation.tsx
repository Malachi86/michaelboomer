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
      setIsScrolled(window.scrollY > 50);
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
          isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-[#E31B23] p-1.5 rounded">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-[#0E2356]' : 'text-[#0E2356]'}`}>
                SUZUKI SALES
              </span>
            </motion.a>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="text-gray-600 hover:text-[#E31B23] transition-colors relative group font-bold uppercase text-xs tracking-widest"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E31B23] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Button
                size="sm"
                className="bg-[#E31B23] text-white hover:bg-[#c4171e] border-0 font-bold px-6 shadow-lg shadow-red-200"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 md:hidden"
          >
            <div className="container mx-auto px-6">
              <div className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-2xl text-[#0E2356] font-bold py-3 border-b border-gray-100 uppercase"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button
                  className="mt-4 bg-[#E31B23] text-white h-14 text-lg font-bold"
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