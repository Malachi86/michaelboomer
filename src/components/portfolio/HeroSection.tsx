'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, ShieldCheck, Mail, Facebook, MessageCircle, Linkedin, Star } from 'lucide-react';
import type { Profile } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HeroSection({ profile }: { profile: Profile }) {
  const hasProfileImage = profile?.profile_image && profile.profile_image.trim() !== "";

  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center bg-[#FFFBFA] overflow-hidden pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-block border border-red-200 bg-white px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-[#E31B23] rounded-full inline-block mr-2 animate-pulse" />
              <span className="text-[#E31B23] text-[10px] font-black uppercase tracking-widest">Authorized Suzuki Executive</span>
            </div>

            <h1 className="text-5xl lg:text-[92px] font-serif text-[#0E2356] leading-[1.05] tracking-tight mb-8">
              Experience <br />
              <span className="text-[#E31B23] font-serif italic">Suzuki Excellence</span>
            </h1>
            
            <div className="space-y-4 mb-10">
              <h2 className="text-xl font-black text-[#0E2356] tracking-tight">
                {profile?.full_name || "Marvin Paul Orozco"}
              </h2>
              <p className="text-gray-500 text-lg font-medium max-w-lg leading-relaxed">
                {profile?.bio || "Ang iyong katuwang sa pagkamit ng pangarap na sasakyan. Mabilis na approval, low downpayment, at de-kalidad na serbisyo."}
              </p>
            </div>

            {/* Social Link Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-bold px-4 gap-2 rounded-lg text-xs h-10 shadow-sm">
                <Mail className="w-4 h-4" /> Gmail
              </Button>
              <Button className="bg-[#1877F2] hover:bg-[#1565d0] text-white font-bold px-4 gap-2 rounded-lg text-xs h-10 shadow-sm">
                <Facebook className="w-4 h-4" /> Facebook
              </Button>
              <Button className="bg-[#7360F2] hover:bg-[#6251d1] text-white font-bold px-4 gap-2 rounded-lg text-xs h-10 shadow-sm">
                <MessageCircle className="w-4 h-4" /> Viber
              </Button>
              <Button className="bg-[#0A66C2] hover:bg-[#08529d] text-white font-bold px-4 gap-2 rounded-lg text-xs h-10 shadow-sm">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 px-10 rounded-xl shadow-xl shadow-red-100 group text-sm tracking-widest"
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                VIEW SHOWROOM
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                className="border-[#0E2356] text-[#0E2356] hover:bg-[#0E2356] hover:text-white font-black h-14 px-10 rounded-xl border-2 text-sm tracking-widest"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                INQUIRE NOW
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-[11px] font-black text-[#0E2356] uppercase tracking-widest opacity-70">100+ Happy Buyers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#0E2356]" />
                </div>
                <span className="text-[11px] font-black text-[#0E2356] uppercase tracking-widest opacity-70">Suzuki Guaranteed</span>
              </div>
            </div>
          </motion.div>

          {hasProfileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative w-[320px] h-[480px] lg:w-[440px] lg:h-[620px] p-4">
                {/* Image Card */}
                <div className="relative w-full h-full rounded-[40px] overflow-hidden border-8 border-white shadow-2xl z-20">
                  <Image
                    src={profile.profile_image}
                    alt={profile.full_name}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2356]/20 to-transparent" />
                </div>

                {/* Floating Rating Badge */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-4 -right-4 z-30 bg-[#0E2356] p-4 rounded-2xl shadow-2xl text-white min-w-[120px]"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">4.7</span>
                  </div>
                  <div className="flex gap-0.5 my-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Avg Rating</p>
                </motion.div>

                {/* Status Badge */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-12 -left-6 z-30 bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 min-w-[200px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E31B23] flex items-center justify-center shadow-lg shadow-red-100">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</p>
                    <p className="text-sm font-black text-[#0E2356] uppercase tracking-tight">Top Sales Executive</p>
                  </div>
                </motion.div>
                
                {/* Back Decorative Ring */}
                <div className="absolute inset-0 border-2 border-red-100 rounded-[50px] -m-4 z-0" />
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}