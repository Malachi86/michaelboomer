'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { profile } from '@/lib/data';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const navLinks = [
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    if (!hasMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      let currentSection = 'home';
      const sections = ['home', ...navLinks.map((l) => l.id)];

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && window.scrollY >= section.offsetTop - 100) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMounted, navLinks]);

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => {
        const className = cn(
          'font-medium tracking-wide transition-colors duration-300',
          isMobile ? 'block w-full text-left p-4 text-lg' : 'px-4 py-2',
          activeSection === link.id
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        );

        if (isMobile) {
          return (
            <SheetClose asChild key={link.id}>
              <Link href={`#${link.id}`} className={className}>
                {link.label}
              </Link>
            </SheetClose>
          );
        }

        return (
          <Link href={`#${link.id}`} key={link.id} className={className}>
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-sm border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="#home"
            className="flex items-center gap-2 text-xl font-headline font-bold text-foreground transition-colors hover:text-primary"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary h-6 w-6"
            >
              <path
                d="M1.5625 23.4375L12.5 3.90625L23.4375 23.4375H1.5625Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            My Digital Hub
          </Link>

          <nav className="hidden md:flex items-center">
            <NavLinks />
            <Button asChild className="ml-4">
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          </nav>

          <div className="md:hidden">
            {hasMounted && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-background">
                  <nav className="flex flex-col pt-16">
                    <NavLinks isMobile />
                    <div className="p-4 mt-4">
                      <Button asChild className="w-full">
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Resume
                        </a>
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
