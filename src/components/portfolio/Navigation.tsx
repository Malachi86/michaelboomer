'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X, Mountain } from 'lucide-react';
import type { Profile } from '@/lib/types';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
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
          isScrolled ? 'bg-background/90 backdrop-blur-lg border-b border-white/5' : ''
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Branding - Matches reference image */}
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <Mountain className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold text-white tracking-tight">
                My Digital Hub
              </span>
            </motion.a>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="text-muted-foreground hover:text-primary transition-colors relative group font-medium"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-bold px-6"
                onClick={() => scrollTo('#contact')}
              >
                Hire Me
              </Button>
            </div>

            <div className="md:hidden">
              {hasMounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
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
            className="fixed inset-0 z-40 bg-background pt-24 md:hidden"
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
                    className="text-2xl text-white font-medium py-3 border-b border-white/10"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <Button
                  className="mt-4 bg-primary text-primary-foreground h-14 text-lg font-bold"
                  onClick={() => scrollTo('#contact')}
                >
                  Hire Me
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}