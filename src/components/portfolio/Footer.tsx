'use client';

import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, MessageSquare, Phone, Car, Lock } from 'lucide-react';
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
    <footer className="relative py-12 bg-white border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-[#E31B23] p-1.5 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#0E2356] leading-none tracking-tighter">
                SUZUKI
              </span>
              <span className="text-[9px] font-bold text-[#E31B23] tracking-[0.2em] leading-none mt-1 uppercase">
                Official Sales
              </span>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-gray-500 text-sm font-bold flex items-center gap-2">
            © {year} {profile?.full_name || "Marvin Paul Orozco"}. All rights reserved.
            <Link href="/login" className="opacity-0 hover:opacity-100 transition-opacity p-2 ml-2 hover:bg-slate-50 rounded-lg">
              <Lock className="w-3 h-3 text-[#0E2356]" />
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
                  className="text-gray-400 hover:text-[#E31B23] transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
            {!profile?.social_links?.some(l => l.platform === 'message') && (
              <a href="#contact" className="text-gray-400 hover:text-[#E31B23] transition-all duration-300 transform hover:scale-110">
                <MessageSquare className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}