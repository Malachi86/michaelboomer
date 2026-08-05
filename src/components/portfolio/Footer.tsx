'use client';

import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, MessageSquare, Phone, Mountain, Lock } from 'lucide-react';
import type { Profile } from '@/lib/types';
import Link from 'next/link';

const socialIcons: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  message: MessageSquare,
  phone: Phone
};

export default function Footer({ profile }: { profile: Profile }) {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative py-12 bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-white tracking-tight">
              My Digital Hub
            </span>
          </div>

          {/* Copyright Section */}
          <div className="text-muted-foreground text-sm flex items-center gap-2">
            © {year} {profile?.full_name || "Marvin Paul Orozco"}. All rights reserved.
            <Link href="/login" className="opacity-0 hover:opacity-20 transition-opacity p-1">
              <Lock className="w-3 h-3" />
            </Link>
          </div>

          {/* Social Icons Section */}
          <div className="flex items-center gap-6">
            {profile?.social_links?.map((link, index) => {
              const Icon = socialIcons[link.platform?.toLowerCase()] || Github;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
            {!profile?.social_links?.some(l => l.platform === 'message') && (
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <MessageSquare className="w-5 h-5" />
              </a>
            )}
            {!profile?.social_links?.some(l => l.platform === 'phone') && (
              <a href="tel:#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
