
'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play, X, Star, Car, Info } from 'lucide-react';
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

  if (!projects || projects.length === 0) return null;

  // Remove the second project (pic 2) as requested
  const visibleProjects = projects.slice(0, 1);

  const filteredProjects = activeCategory === 'All' 
    ? visibleProjects 
    : visibleProjects.filter(p => p.category === activeCategory);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <section id="projects" className="relative py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E31B23] font-black tracking-widest uppercase text-xs mb-4">
            Our Inventory
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0E2356] mb-6 block">
            Suzuki Vehicle Catalog
          </h2>
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Hanapin ang sasakyang nababagay sa iyong lifestyle. Bawat unit ay garantisadong Suzuki Quality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {dynamicCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category 
                ? "bg-[#0E2356] text-white border-0 font-bold px-6"
                : "border-gray-200 text-gray-700 hover:text-[#0E2356] hover:border-[#0E2356] font-bold px-6"
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden showroom-shadow hover:border-[#0E2356]/20 transition-all duration-300 group">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                      {displayImageUrl ? (
                        <Image
                          src={displayImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-200" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <Button
                          className="w-full bg-white text-[#0E2356] hover:bg-white/90 font-bold rounded-xl"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Info className="w-4 h-4 mr-2" /> VIEW SPECS
                        </Button>
                      </div>

                      {project.featured && (
                        <Badge className="absolute top-4 left-4 bg-[#E31B23] text-white border-0 px-3 py-1 font-black uppercase text-[10px]">
                          <Star className='h-3 w-3 mr-1 fill-white'/> HOT DEAL
                        </Badge>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold text-[10px] uppercase">
                          {project.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-[#0E2356] mb-3 group-hover:text-[#E31B23] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed font-medium">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 border-t border-gray-50 pt-4">
                        {project.tech_stack?.slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-slate-50 border border-gray-100 rounded-md text-[#0E2356]/70 uppercase tracking-tight">
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
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0E2356]/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 relative aspect-video lg:aspect-square bg-slate-50">
                  <Image
                    src={selectedProject.image_url || (selectedProject as any).imageUrl}
                    alt={selectedProject.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <Badge className="bg-[#E31B23] mb-4">{selectedProject.category}</Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#0E2356] mb-6 leading-tight">{selectedProject.title}</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed font-medium">{selectedProject.description}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech_stack?.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-50 border-gray-100 text-[#0E2356] px-3 py-1 font-bold">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button className="flex-1 bg-[#E31B23] hover:bg-[#c4171e] text-white font-bold h-12 rounded-xl" asChild>
                         <a href="#contact" onClick={() => setSelectedProject(null)}>INQUIRE NOW</a>
                      </Button>
                      <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200" onClick={() => setSelectedProject(null)}>
                        <X className="w-5 h-5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
