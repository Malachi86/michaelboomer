'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MessageSquare, Phone, FileText } from 'lucide-react';
import type { Profile } from '@/lib/types';
import Image from 'next/image';
import { TypingAnimation } from '@/components/shared/TypingAnimation';
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
    <section id="hero" className="relative min-h-screen flex items-center bg-background overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 relative z-10 w-full">
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 ${!hasProfileImage ? 'text-center justify-center' : ''}`}>
          
          {/* Content Area */}
          <div className={`flex-1 ${!hasProfileImage ? 'max-w-4xl' : 'text-center lg:text-left'} order-2 lg:order-1`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl lg:text-8xl font-serif text-white mb-4 tracking-tight leading-tight">
                {profile?.full_name || "Marvin Paul Orozco"}
              </h1>
              
              <p className="text-2xl lg:text-3xl font-medium text-primary mb-8">
                {profile?.title || "Creative Full-Stack Developer"}
              </p>
              
              <div className={`mb-12 min-h-[4rem] max-w-2xl ${!hasProfileImage ? 'mx-auto' : 'mx-auto lg:mx-0'}`}>
                <TypingAnimation 
                  text={profile?.bio || "I am a passionate developer crafting high-performance digital experiences and providing top-tier virtual assistance."}
                  className="text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed"
                />
              </div>

              <div className={`flex flex-wrap gap-4 items-center mb-12 ${!hasProfileImage ? 'justify-center' : 'justify-center lg:justify-start'}`}>
                {profile?.social_links?.map((link, index) => {
                  const Icon = socialIcons[link.platform?.toLowerCase()] || Github;
                  return (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.1 }}
                      className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-lg"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}

                {profile?.resume_url && profile?.resume_url !== "#" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 h-12 rounded-full transition-all group"
                    >
                      <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        View Full Resume
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Profile Image Oval - Only renders if there is a profile image */}
          {hasProfileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex-shrink-0 order-1 lg:order-2 group"
            >
              <div className="relative w-[280px] h-[420px] lg:w-[450px] lg:h-[650px]">
                <div className="absolute inset-0 rounded-[140px] lg:rounded-[225px] border-2 border-primary/20 translate-x-4 translate-y-4 -z-10 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-primary/50" />
                
                <div className="w-full h-full rounded-[140px] lg:rounded-[225px] overflow-hidden border-2 border-border relative bg-card shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(228,187,79,0.3)]">
                  <Image
                    src={profile.profile_image}
                    alt={profile?.full_name || "Profile"}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 280px, 450px"
                  />
                  <div className="absolute inset-0 rounded-[140px] lg:rounded-[225px] border-4 border-primary/10 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:shadow-inner" />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}