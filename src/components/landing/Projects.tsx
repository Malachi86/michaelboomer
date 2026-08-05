'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects as allProjects } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Video, Code } from 'lucide-react';

export function Projects() {
  const [filter, setFilter] = useState<'All' | 'Web App' | 'Mobile App' | 'E-commerce' | 'VA Project'>('All');

  const filteredProjects = allProjects.filter(p => filter === 'All' || p.category === filter);

  const categories = ['All', 'Web App', 'Mobile App', 'E-commerce', 'VA Project'] as const;

  return (
    <Section id="projects">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">My Work</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A selection of my projects. From web applications to video productions, each project is a piece of my journey.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {categories.map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f as any)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredProjects.map(project => (
          <Card key={project.id} className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image_url || 'https://picsum.photos/seed/project/600/400'}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                 <div className="absolute top-4 right-4 p-2 bg-background/70 rounded-full backdrop-blur-sm">
                  {project.category === 'Web App' ? <Code className="w-5 h-5 text-primary" /> : <Video className="w-5 h-5 text-primary" />}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <CardTitle className="font-headline text-xl mb-2">{project.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{project.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map(tech => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
