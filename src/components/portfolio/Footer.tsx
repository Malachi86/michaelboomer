'use client';

import React, { useEffect, useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MessageSquare, 
  Facebook, 
  MessageCircle, 
  Phone, 
  Car, 
  Lock, 
  Globe 
} from 'lucide-react';
import type { Profile } from '@/lib/types';
import Link from 'next/link';

// Map platform names to Lucide icons
const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return Facebook;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('gmail') || p.includes('email')) return Mail;
  if (p.includes('viber')) return MessageCircle;
  if (p.includes('github')) return Github;
  if (p.includes('phone') || p.includes('whatsapp')) return Phone;
  return Globe;
};

// Handle special link protocols
const formatUrl = (platform: string, url: string) => {
  const p = platform.toLowerCase();
  
  // Gmail/Email handling
  if ((p.includes('gmail') || p.includes('email')) && url.includes('@') && !url.startsWith('mailto:')) {
    return `mailto:${url}`;
  }
  
  // Viber handling (detect if it's a phone number or a link)
  if (p.includes('viber')) {
    const cleanNumber = url.replace(/[^0-9+]/g, '');
    if (cleanNumber.length >= 10) {
      const numberWithoutPlus = cleanNumber.startsWith('+') ? cleanNumber.slice(1) : cleanNumber;
      return `viber://chat?number=${numberWithoutPlus}`;
    }
  }
  
  return url;
};

export default function Footer({ profile }: { profile: Profile }) {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Filter out LinkedIn
  const filteredLinks = profile?.social_links?.filter(l => !l.platform.toLowerCase().includes('linkedin')) || [];

  return (
    <footer className="relative py-12 bg-white border-t border-gray-100 group">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left: Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-[#E31B23] p-1.5 rounded-lg shadow-sm">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-[#0E2356] leading-none tracking-tighter">
                SUZUKI
              </span>
              <span className="text-[8px] font-bold text-[#E31B23] tracking-[0.2em] leading-none mt-0.5 uppercase">
                Auto Lipa
              </span>
            </div>
          </div>

          {/* Center: Copyright Section */}
          <div className="text-gray-400 text-[11px] font-bold flex items-center gap-2 uppercase tracking-wider">
            © {year} {profile?.full_name || "Michael Gabriel Orozco"}. All rights reserved.
            <Link href="/login" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-50 rounded-lg">
              <Lock className="w-3 h-3 text-[#0E2356]" />
            </Link>
          </div>

          {/* Right: Dynamic Social Icons */}
          <div className="flex items-center gap-6">
            {filteredLinks.map((link, index) => {
              const IconComponent = getIcon(link.platform);
              const finalUrl = formatUrl(link.platform, link.url);
              
              return (
                <a
                  key={index}
                  href={finalUrl}
                  target={finalUrl.startsWith('http') ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  title={link.platform}
                  className="text-gray-300 hover:text-[#0E2356] transition-all duration-300 transform hover:scale-110"
                >
                  <IconComponent className="w-5 h-5 stroke-[1.5]" />
                </a>
              );
            })}
            
            {/* Direct message icon as fallback if no message link exists */}
            {!filteredLinks.some(l => l.platform.toLowerCase().includes('message')) && (
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-[#E31B23] transition-all duration-300 transform hover:scale-110"
              >
                <MessageSquare className="w-5 h-5 stroke-[1.5]" />
              </a>
            )}
          </div>
          
        </div>
      </div>
    </footer>
  );
}
