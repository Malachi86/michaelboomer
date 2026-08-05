import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/lib/data';

export function Footer() {
  const socialLinks = profile.social_links.map(link => ({
    href: link.url,
    icon: link.platform.toLowerCase() === 'github' ? Github : 
          link.platform.toLowerCase() === 'linkedin' ? Linkedin : Mail,
    label: link.platform
  }));

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} {profile.full_name}. All Rights Reserved.
        </p>
        <div className="flex space-x-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="p-2 bg-background rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-110 shadow-md">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
