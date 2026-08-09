
'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Car, Info } from 'lucide-react';
import type { Project } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProjectsSection({ projects = [] }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const dynamicCategories = useMemo(() => {
    if (!projects || projects.length === 0) return ['ALL'];
    const uniqueCategories = Array.from(new Set(projects.map(p => p.category.toUpperCase())));
    return ['ALL', ...uniqueCategories];
  }, [projects]);

  // Use all projects but ensure they fit the new car focus
  const displayProjects = projects.length > 0 ? projects : [];

  const filteredProjects = activeCategory === 'ALL' 
    ? displayProjects 
    : displayProjects.filter(p => p.category.toUpperCase() === activeCategory);

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
          <p className="text-[#E31B23] font-black tracking-[0.3em] uppercase text-[10px] mb-4">
            OUR INVENTORY
          </p>
          <h2 className="text-4xl lg:text-6xl font-serif text-[#0E2356] mb-6">
            Suzuki Vehicle Catalog
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-6">
            Hanapin ang sasakyang nababagay sa iyong lifestyle. Bawat unit ay garantisadong Suzuki Quality.
          </p>
          <div className="w-16 h-1 bg-[#E31B23] mx-auto rounded-full" />
        </motion.div>

        {/* Pill Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {dynamicCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-8 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-all duration-300",
                activeCategory === category 
                  ? "bg-[#0E2356] text-white shadow-lg"
                  : "bg-slate-100 text-gray-400 hover:bg-slate-200"
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((project, index) => {
              const displayImageUrl = project.image_url || (project as any).imageUrl;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="bg-white rounded-[32px] overflow-hidden showroom-shadow border border-gray-50 group hover:-translate-y-2 transition-transform duration-500">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                      {displayImageUrl ? (
                        <Image
                          src={displayImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-200" />
                        </div>
                      )}
                      
                      {/* Floating Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-[#0E2356] text-white border-0 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg">
                          {project.category}
                        </Badge>
                      </div>

                      {project.featured && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-[#E31B23] text-white border-0 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                            <Star className='h-2.5 w-2.5 fill-white'/> HOT DEAL
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-[17px] font-bold text-[#0E2356] mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price Starts</span>
                          <span className="text-[#E31B23] text-lg font-black tracking-tight">
                            ₱{project.order ? (project.order * 100000).toLocaleString() : '798,000'}
                          </span>
                        </div>
                        <Button
                          className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black text-[10px] tracking-widest px-6 h-10 rounded-xl shadow-lg shadow-red-100"
                          onClick={() => setSelectedProject(project)}
                        >
                          INQUIRE
                        </Button>
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
              className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
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
                  <Badge className="bg-[#E31B23] mb-4 text-[10px] font-black uppercase tracking-widest">{selectedProject.category}</Badge>
                  <h2 className="text-3xl lg:text-4xl font-serif text-[#0E2356] mb-6 leading-tight">{selectedProject.title}</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed font-medium">{selectedProject.description}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Unit Specifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech_stack?.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-50 border-gray-100 text-[#0E2356] px-4 py-1.5 rounded-lg text-[11px] font-bold">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button className="flex-1 bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 rounded-2xl shadow-xl shadow-red-100 text-sm tracking-widest" asChild>
                         <a href="#contact" onClick={() => setSelectedProject(null)}>BOOK RESERVATION</a>
                      </Button>
                      <Button variant="outline" className="h-14 w-14 rounded-2xl border-gray-100 text-gray-400 hover:text-[#E31B23]" onClick={() => setSelectedProject(null)}>
                        <X className="w-6 h-6" />
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
