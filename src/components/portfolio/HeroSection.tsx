'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MessageSquare, Phone, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import type { Profile } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const socialIcons: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  message: MessageSquare,
  phone: Phone
};

export default function HeroSection({ profile }: { profile: Profile }) {
  const hasProfileImage = profile?.profile_image && profile.profile_image.trim() !== "";

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-6 border border-red-100">
                <span className="w-2 h-2 bg-[#E31B23] rounded-full animate-pulse" />
                <span className="text-[#E31B23] text-sm font-bold uppercase tracking-widest">Official Suzuki Consultant</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-[#0E2356] mb-4 tracking-tight leading-[1.1]">
                Drive Home Your <br />
                <span className="text-[#E31B23]">Dream Suzuki</span> Today
              </h1>
              
              <p className="text-xl lg:text-2xl font-medium text-gray-600 mb-8">
                {profile?.full_name || "Marvin Paul Orozco"} — {profile?.title || "Senior Sales Executive"}
              </p>
              
              <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed">
                Expert guidance for your vehicle purchase. Fast approvals, competitive rates, and seamless turnover service.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
                <Button
                  className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-bold h-14 px-8 rounded-lg shadow-lg shadow-red-200 transition-all text-lg group"
                  onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  BROWSE INVENTORY
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  className="border-[#0E2356] text-[#0E2356] hover:bg-[#0E2356] hover:text-white font-bold h-14 px-8 rounded-lg transition-all text-lg"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  GET A QUOTE
                </Button>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold text-gray-700">100+ Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold text-gray-700">Fast Approval</span>
                </div>
              </div>
            </motion.div>
          </div>

          {hasProfileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex-shrink-0 order-1 lg:order-2"
            >
              <div className="relative w-[320px] h-[480px] lg:w-[450px] lg:h-[600px]">
                {/* Suzuki Branding Red Box Behind */}
                <div className="absolute -top-6 -right-6 w-full h-full bg-[#E31B23]/10 rounded-2xl -z-10" />
                <div className="absolute -bottom-6 -left-6 w-1/2 h-1/2 border-l-4 border-b-4 border-[#0E2356]/20 rounded-bl-2xl -z-10" />
                
                <div className="w-full h-full rounded-2xl overflow-hidden border-8 border-white shadow-2xl relative bg-gray-100">
                  <Image
                    src={profile.profile_image}
                    alt={profile?.full_name || "Profile"}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2356]/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}