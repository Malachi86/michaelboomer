'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mail, MapPin, Loader2 } from 'lucide-react';
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
      className="w-full bg-[#E31B23] text-white hover:bg-[#c4171e] h-14 font-black rounded-xl shadow-xl transition-all"
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
          <p className="text-[#E31B23] font-black tracking-[0.2em] uppercase text-xs mb-4">
            Connect
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0E2356] mb-6">
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Ang iyong bagong sasakyan ay isang mensahe lang ang layo. Makipag-ugnayan sa amin ngayon.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-6">
              {profile?.email && (
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-[#0E2356] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#0E2356] font-black text-sm uppercase tracking-wider mb-1">Email</h3>
                    <a href={`mailto:${profile.email}`} className="text-gray-600 font-bold hover:text-[#E31B23] transition-colors break-all">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-[#E31B23] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[#0E2356] font-black text-sm uppercase tracking-wider mb-1">Location</h3>
                  <p className="text-gray-600 font-bold">Authorized Suzuki Sales Branch</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form ref={formRef} action={formAction} className="space-y-6 bg-white border border-gray-100 rounded-3xl p-8 showroom-shadow">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#0E2356] font-black text-xs uppercase">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    className="bg-slate-50 border-gray-100 h-12 rounded-xl focus:border-[#0E2356]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#0E2356] font-black text-xs uppercase">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    className="bg-slate-50 border-gray-100 h-12 rounded-xl focus:border-[#0E2356]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0E2356] font-black text-xs uppercase">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="bg-slate-50 border-gray-100 h-12 rounded-xl focus:border-[#0E2356]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#0E2356] font-black text-xs uppercase">Inquiry Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell us about the vehicle you're interested in..."
                  className="bg-slate-50 border-gray-100 h-12 rounded-xl focus:border-[#0E2356] resize-none p-4 min-h-[150px]"
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