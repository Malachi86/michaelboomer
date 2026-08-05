'use client';

import Image from 'next/image';
import { Section } from '@/components/shared/Section';
import { TypingAnimation } from '@/components/shared/TypingAnimation';
import { profile } from '@/lib/data';

export function About() {
  return (
    <Section id="about" className="bg-card">
      <div className="grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg border-4 border-primary/50">
            <Image
              src={profile.profile_image}
              alt={profile.full_name}
              fill
              className="object-cover"
              data-ai-hint="man portrait"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-primary">About Me</h2>
          <TypingAnimation
            className="text-muted-foreground text-lg leading-relaxed"
            text={profile.bio}
          />
        </div>
      </div>
    </Section>
  );
}
