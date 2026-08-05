'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Play, X, Star } from 'lucide-react';
import type { Project } from '@/lib/types';
import Image from 'next/image';

export default function ProjectsSection({ projects = [] }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const dynamicCategories = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const uniqueCategories = Array.from(new Set(projects.map(p => p.category)));
    return ['All', ...uniqueCategories];
  }, [projects]);

  if (!projects || projects.length === 0) {
    return null;
  }

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <section id="projects" className="relative py-32 bg-background">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_100%)]" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Showcase
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A gallery of my professional work and creative experiments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {dynamicCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category 
                ? "bg-accent text-accent-foreground border-0"
                : "border-white/10 text-muted-foreground hover:text-accent hover:border-accent/50"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {sortedProjects.map((project, index) => {
              const displayImageUrl = project.image_url || (project as any).imageUrl;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500">
                    <div className="relative aspect-video overflow-hidden">
                      {displayImageUrl ? (
                        <Image
                          src={displayImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground/20">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60 backdrop-blur-sm">
                        {project.video_url && (
                          <Button
                            size="icon"
                            className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                            onClick={() => setSelectedProject(project)}
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        )}
                        {project.live_demo_url && project.live_demo_url !== '#' && (
                          <Button
                            size="icon"
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                            asChild
                          >
                            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </a>
                          </Button>
                        )}
                      </div>

                      {project.featured && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0">
                          <Star className='h-3 w-3 mr-1'/>
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="p-6">
                      <Badge variant="outline" className="border-primary/30 text-primary text-xs mb-3">
                        {project.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack?.slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-md text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && selectedProject.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/95 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={selectedProject.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 text-white hover:bg-white/10"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}