'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mail, MapPin, Loader2, Facebook, MessageCircle } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { submitContactForm } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#E31B23] text-white hover:bg-[#c4171e] h-14 font-black rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="w-5 h-5 mr-2" />
          Send Message
        </>
      )}
    </Button>
  );
}

const ContactInfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  bgColor,
  href
}: { 
  icon: any, 
  label: string, 
  value: string, 
  bgColor: string,
  href?: string
}) => {
  const CardContent = (
    <div className="flex items-center gap-5 p-5 bg-white rounded-[24px] border border-gray-50 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="min-w-0">
        <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{label}</h3>
        <p className="text-[#0E2356] font-black text-sm lg:text-base truncate tracking-tight">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
      {CardContent}
    </a>
  ) : (
    <div className="block w-full">{CardContent}</div>
  );
};

export default function ContactSection({ profile }: { profile: Profile }) {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitContactForm, { message: '' });

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Message Sent!',
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      formRef.current?.reset();
    } else if (state.message === 'admin_redirect') {
      router.push('/admin');
    } else if (state.message === 'error') {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'Failed to send message. Please try again.',
      });
    }
  }, [state, toast, router]);

  // Use requested hardcoded values as primary, with profile as secondary
  const gmailValue = "michaelgabrielc.orozco@gmail.com";
  const facebookName = "Suzuki Auto Lipa by Michael Gabriel Orozco";
  const viberValue = "09692721107";

  // Dynamic links from profile (excluding LinkedIn)
  const getSocialUrl = (platform: string) => {
    const link = profile?.social_links?.find(l => l.platform.toLowerCase().includes(platform.toLowerCase()));
    return link?.url;
  };

  const facebookUrl = getSocialUrl('facebook') || "https://www.facebook.com/SuzukiAutoLipaByMichaelGabrielOrozco";
  const viberUrl = getSocialUrl('viber') || `viber://chat?number=${viberValue}`;

  return (
    <section id="contact" className="relative py-32 bg-[#FFFBFA] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-50 rounded-full blur-[120px] -z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-0" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#E31B23] font-black tracking-[0.3em] uppercase text-[10px] mb-4">Connect With Us</p>
          <h2 className="text-5xl lg:text-7xl font-serif text-[#0E2356] mb-6">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-[#E31B23] mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
          {/* Left Column: Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <ContactInfoCard 
              icon={Mail} 
              label="Gmail" 
              value={gmailValue} 
              bgColor="bg-[#EA4335]"
              href={`mailto:${gmailValue}`}
            />
            <ContactInfoCard 
              icon={Facebook} 
              label="Facebook" 
              value={facebookName} 
              bgColor="bg-[#1877F2]"
              href={facebookUrl}
            />
            <ContactInfoCard 
              icon={MessageCircle} 
              label="Viber" 
              value={viberValue} 
              bgColor="bg-[#7360F2]"
              href={viberUrl}
            />
            <ContactInfoCard 
              icon={MapPin} 
              label="Location" 
              value="Suzuki Auto Lipa" 
              bgColor="bg-[#E31B23]" 
            />
          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form ref={formRef} action={formAction} className="space-y-8 bg-white border border-gray-100/50 rounded-[40px] p-10 lg:p-12 shadow-2xl shadow-slate-200/50">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-[#0E2356] font-black text-[10px] uppercase tracking-[0.2em] ml-1">Full Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Juan dela Cruz"
                    required
                    className="bg-slate-50 border-gray-100 h-14 rounded-2xl focus:border-[#E31B23] focus:ring-0 placeholder:text-gray-300 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#0E2356] font-black text-[10px] uppercase tracking-[0.2em] ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="juan@email.com"
                    required
                    className="bg-slate-50 border-gray-100 h-14 rounded-2xl focus:border-[#E31B23] focus:ring-0 placeholder:text-gray-300 font-bold"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="message" className="text-[#0E2356] font-black text-[10px] uppercase tracking-[0.2em] ml-1">Inquiry Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us about the vehicle you're interested in..."
                  className="bg-slate-50 border-gray-100 rounded-2xl focus:border-[#E31B23] focus:ring-0 resize-none p-5 min-h-[180px] placeholder:text-gray-300 font-bold"
                />
              </div>
              
              <SubmitButton />
              
              <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Authorized Suzuki Sales Representative
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
