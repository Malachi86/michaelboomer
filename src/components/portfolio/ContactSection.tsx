'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mail, MapPin, Loader2, Facebook, Linkedin, MessageCircle } from 'lucide-react';
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

const ContactInfoCard = ({ icon: Icon, label, value, color, bgColor }: { icon: any, label: string, value: string, color: string, bgColor: string }) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="min-w-0">
      <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-0.5">{label}</h3>
      <p className="text-[#0E2356] font-bold text-sm truncate">{value}</p>
    </div>
  </div>
);

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

  return (
    <section id="contact" className="relative py-32 bg-white overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-7xl font-serif text-[#0E2356] mb-6">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-6">
            Ang iyong bagong sasakyan ay isang mensahe lang ang layo. Makipag-ugnayan sa amin ngayon.
          </p>
          <div className="w-12 h-1 bg-[#E31B23] mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
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
              value={profile?.email || "orozcomarvinpaul@gmail.com"} 
              color="text-white" 
              bgColor="bg-[#EA4335]" 
            />
            <ContactInfoCard 
              icon={Facebook} 
              label="Facebook" 
              value="fb.com/marvinpaul.orozco" 
              color="text-white" 
              bgColor="bg-[#1877F2]" 
            />
            <ContactInfoCard 
              icon={MessageCircle} 
              label="Viber" 
              value="+63 9XX XXX XXXX" 
              color="text-white" 
              bgColor="bg-[#7360F2]" 
            />
            <ContactInfoCard 
              icon={Linkedin} 
              label="Linkedin" 
              value="linkedin.com/in/marvinpaulorozco" 
              color="text-white" 
              bgColor="bg-[#0A66C2]" 
            />
            <ContactInfoCard 
              icon={MapPin} 
              label="Location" 
              value="Authorized Suzuki Sales Branch" 
              color="text-white" 
              bgColor="bg-[#E31B23]" 
            />
          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form ref={formRef} action={formAction} className="space-y-6 bg-white border border-gray-100/50 rounded-[40px] p-10 shadow-2xl shadow-slate-200/50">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#0E2356] font-black text-[10px] uppercase tracking-[0.15em]">Full Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Juan dela Cruz"
                    required
                    className="bg-slate-50 border-gray-100 h-14 rounded-xl focus:border-[#0E2356] placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0E2356] font-black text-[10px] uppercase tracking-[0.15em]">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="juan@email.com"
                    required
                    className="bg-slate-50 border-gray-100 h-14 rounded-xl focus:border-[#0E2356] placeholder:text-gray-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#0E2356] font-black text-[10px] uppercase tracking-[0.15em]">Inquiry Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us about the vehicle you're interested in..."
                  className="bg-slate-50 border-gray-100 rounded-xl focus:border-[#0E2356] resize-none p-4 min-h-[160px] placeholder:text-gray-300"
                />
              </div>
              
              <SubmitButton />
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
