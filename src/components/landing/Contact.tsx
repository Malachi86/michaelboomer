'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useActionState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type ContactFormState } from '@/lib/actions';
import { profile } from '@/lib/data';

const iconMap: { [key: string]: LucideIcon } = {
  Github,
  Linkedin,
  Mail,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export function Contact() {
  const initialState: ContactFormState = { message: '' };
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;

    if (state.message === 'success') {
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      formRef.current?.reset();
    } else if (state.message === 'error') {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: state.issues ? (
          <ul className="list-disc pl-4">
            {state.issues.map((issue, i) => <li key={i}>{issue}</li>)}
          </ul>
        ) : 'An unexpected error occurred.',
      });
    }
  }, [state, toast]);

  return (
    <Section id="contact">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">Get In Touch</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a project in mind or just want to say hi? Feel free to send me a message.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-3 bg-card p-8 rounded-lg shadow-lg">
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="First Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Last Name" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Your message here..." required minLength={10} rows={5} />
            </div>
            <SubmitButton />
          </form>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-6">
          <h3 className="text-2xl font-headline font-semibold text-primary">Contact Details</h3>
          <div className="space-y-4">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-4 group">
              <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-muted-foreground group-hover:text-primary transition-colors">{profile.email}</span>
            </a>
            <div className="flex space-x-4 pt-4">
              {profile.social_links.map((link) => {
                const Icon = iconMap[link.platform.charAt(0).toUpperCase() + link.platform.slice(1)];
                if (!Icon) return null;
                return (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}
                    className="p-3 bg-card rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-110 shadow-md">
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
