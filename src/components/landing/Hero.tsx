import Image from 'next/image';
import { Github, Linkedin, Mail, MessageSquare } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { profile } from '@/lib/data';

export function Hero() {
  const socialLinks = profile.social_links.map(link => ({
    href: link.url,
    icon: link.platform.toLowerCase() === 'github' ? Github : 
          link.platform.toLowerCase() === 'linkedin' ? Linkedin : Mail,
    label: link.platform
  }));

  return (
    <Section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight">
            {profile.full_name}
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-primary">
            {profile.title}
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
            {profile.bio}
          </p>
          <div className="flex space-x-4 pt-4 justify-center md:justify-start">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" aria-label={label}
                className="p-3 bg-card rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-110 shadow-md">
                <Icon className="w-6 h-6" />
              </a>
            ))}
            <a href="#contact" aria-label="Message"
              className="p-3 bg-card rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-110 shadow-md">
              <MessageSquare className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="relative w-72 h-96 md:w-80 md:h-[28rem] rounded-t-full overflow-hidden shadow-2xl border-b-8 border-primary rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105">
            <Image
              src={profile.profile_image}
              alt={profile.full_name}
              fill
              className="object-cover object-top"
              data-ai-hint="man portrait"
              sizes="(max-width: 768px) 70vw, 33vw"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
