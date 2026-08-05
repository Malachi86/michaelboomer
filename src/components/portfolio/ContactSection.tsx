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
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 h-12 font-bold"
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
    <section id="contact" className="relative py-32 bg-background overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Connect
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to start a new project? Let's discuss your vision.
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
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Location</h3>
                  <p className="text-muted-foreground">Available Worldwide (Remote)</p>
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
            <form ref={formRef} action={formAction} className="space-y-6 bg-card border border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-muted-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-muted-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="bg-white/5 border-white/10 text-white focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-muted-foreground">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="bg-white/5 border-white/10 text-white focus:border-primary resize-none"
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
