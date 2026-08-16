'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Car, MessageSquare, ChevronRight } from 'lucide-react';
import type { Project } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ProjectsSection({ projects = [] }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const dynamicCategories = useMemo(() => {
    if (!projects || projects.length === 0) return ['ALL'];
    const uniqueCategories = Array.from(new Set(projects.map(p => (p.category || 'Other').toUpperCase())));
    return ['ALL', ...uniqueCategories];
  }, [projects]);

  const displayProjects = projects.length > 0 ? projects : [];

  const filteredProjects = activeCategory === 'ALL' 
    ? displayProjects 
    : displayProjects.filter(p => (p.category || 'Other').toUpperCase() === activeCategory);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  const handleInquiryLink = (url: string | undefined) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="relative py-32 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#E31B23] font-black tracking-[0.3em] uppercase text-[10px] mb-4">
            OUR INVENTORY
          </p>
          <h2 className="text-5xl lg:text-7xl font-serif text-[#0E2356] mb-6">
            Suzuki Vehicle Catalog
          </h2>
          <div className="w-16 h-1 bg-[#E31B23] mx-auto rounded-full" />
        </motion.div>

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
                "px-8 py-3 rounded-full text-[11px] font-black tracking-widest transition-all duration-300",
                activeCategory === category 
                  ? "bg-[#0E2356] text-white shadow-xl"
                  : "bg-slate-100 text-gray-400 hover:bg-slate-200"
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="bg-white rounded-[40px] overflow-hidden showroom-shadow border border-gray-100/50 group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
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
                      
                      <div className="absolute top-6 left-6 z-10">
                        <Badge className="bg-[#0E2356] text-white border-0 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl">
                          {project.category}
                        </Badge>
                      </div>

                      {project.featured && (
                        <div className="absolute top-6 right-6 z-10">
                          <Badge className="bg-[#E31B23] text-white border-0 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1 shadow-lg">
                            <Star className='h-2.5 w-2.5 fill-white'/> HOT DEAL
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-black text-[#0E2356] mb-3 leading-tight uppercase tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                        🚗 {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">PRICE STARTS</span>
                          <span className="text-[#E31B23] text-2xl font-black tracking-tighter">
                            ₱{(project.price || 0).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black text-xs tracking-widest px-8 h-14 rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
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
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-6xl w-[95vw] bg-white border-none p-0 overflow-hidden text-[#0E2356] shadow-2xl rounded-[40px]">
              <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
                <div className="lg:w-3/5 relative aspect-video lg:aspect-auto bg-slate-50 min-h-[400px]">
                  <Image
                    src={selectedProject.image_url || (selectedProject as any).imageUrl}
                    alt={selectedProject.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <Button 
                    variant="outline" 
                    className="absolute top-6 left-6 h-12 w-12 rounded-2xl border-none bg-white/80 backdrop-blur-md text-[#0E2356] shadow-xl lg:hidden"
                    onClick={() => setSelectedProject(null)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                
                <div className="lg:w-2/5 p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                  <Button 
                    variant="ghost" 
                    className="absolute top-10 right-10 h-12 w-12 rounded-2xl text-gray-400 hover:text-[#E31B23] hidden lg:flex"
                    onClick={() => setSelectedProject(null)}
                  >
                    <X className="w-8 h-8" />
                  </Button>

                  <div className="mb-10">
                    <Badge className="bg-[#0E2356] text-white mb-6 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-xl">
                      {selectedProject.category}
                    </Badge>
                    <DialogTitle className="text-4xl lg:text-6xl font-black text-[#0E2356] mb-6 leading-none uppercase tracking-tighter">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-lg leading-relaxed font-medium">
                      {selectedProject.description}
                    </DialogDescription>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="p-8 bg-[#FFFBFA] rounded-[32px] border border-red-50">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Current Retail Price</p>
                      <p className="text-5xl font-black text-[#E31B23] tracking-tighter">
                        ₱{(selectedProject.price || 0).toLocaleString()}
                      </p>
                    </div>

                    {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-6 ml-1">Key Specifications</h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedProject.tech_stack.map((tech, i) => (
                            <div key={i} className="bg-white border border-gray-100 text-[#0E2356] px-6 py-3 rounded-2xl text-[11px] font-black uppercase shadow-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                              {tech}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-4 pt-6">
                      <Button 
                        className="w-full bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-20 rounded-[24px] shadow-2xl shadow-red-100 text-sm tracking-[0.2em] group"
                        onClick={() => handleInquiryLink(selectedProject.live_demo_url)}
                      >
                        PROCEED TO INQUIRY FORM
                        <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-16 rounded-[24px] border-gray-100 text-[#0E2356] font-black text-[12px] tracking-[0.2em] hover:bg-slate-50 uppercase"
                        onClick={() => {
                          setSelectedProject(null);
                          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <MessageSquare className="w-5 h-5 mr-3" />
                        Message Representative
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}