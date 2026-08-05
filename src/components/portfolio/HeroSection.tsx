'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, ShieldCheck } from 'lucide-react';
import type { Profile } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HeroSection({ profile }: { profile: Profile }) {
  const hasProfileImage = profile?.profile_image && profile.profile_image.trim() !== "";

  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center bg-white overflow-hidden pt-24">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#E31B23]/5 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-[#0E2356]/5 rounded-full blur-[100px]" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-red-50 px-5 py-2.5 rounded-full mb-8 border border-red-100 shadow-sm">
                <span className="w-2.5 h-2.5 bg-[#E31B23] rounded-full animate-pulse" />
                <span className="text-[#E31B23] text-sm font-bold uppercase tracking-widest">Authorized Suzuki Executive</span>
              </div>

              <h1 className="text-5xl lg:text-8xl font-serif text-[#0E2356] mb-6 tracking-tight leading-[1.05]">
                Experience <br />
                <span className="text-[#E31B23]">Suzuki Excellence</span>
              </h1>
              
              <div className="space-y-4 mb-10">
                <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                  {profile?.full_name || "Marvin Paul Orozco"}
                </p>
                <p className="text-xl text-gray-700 font-medium max-w-xl leading-relaxed">
                  Ang iyong katuwang sa pagkamit ng pangarap na sasakyan. Mabilis na approval, low downpayment, at de-kalidad na serbisyo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 mb-12 justify-center lg:justify-start">
                <Button
                  className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-bold h-16 px-10 rounded-xl shadow-xl shadow-red-200 transition-all text-lg group"
                  onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  VIEW SHOWROOM
                  <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  className="border-[#0E2356] text-[#0E2356] hover:bg-[#0E2356] hover:text-white font-bold h-16 px-10 rounded-xl transition-all text-lg border-2"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  INQUIRE NOW
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">100+ Happy Buyers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-[#0E2356]" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Suzuki Guaranteed</span>
                </div>
              </div>
            </motion.div>
          </div>

          {hasProfileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex-shrink-0 order-1 lg:order-2"
            >
              <div className="relative w-[340px] h-[500px] lg:w-[480px] lg:h-[640px]">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-full h-full bg-[#E31B23]/5 rounded-3xl -z-10" />
                <div className="absolute -bottom-8 -left-8 w-1/3 h-1/3 border-l-8 border-b-8 border-[#0E2356]/10 rounded-bl-3xl -z-10" />
                
                <div className="w-full h-full rounded-3xl overflow-hidden border-[12px] border-white shadow-2xl relative bg-gray-50 showroom-shadow">
                  <Image
                    src={profile.profile_image}
                    alt={profile?.full_name || "Profile"}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2356]/40 via-transparent to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                    <div className="bg-[#E31B23] p-2 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</p>
                      <p className="text-sm font-bold text-[#0E2356]">Top Sales Executive</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}