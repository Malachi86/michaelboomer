'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Car } from 'lucide-react';
import type { Project } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProjectsSection({ projects = [] }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

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
                  <div className="bg-white rounded-[40px] overflow-hidden showroom-shadow border border-gray-100/50 group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
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

                    <div className="p-8 flex flex-col flex-grow">
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
                        <Link href={`/inventory/?id=${project.id}`}>
                          <Button
                            className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black text-xs tracking-widest px-8 h-14 rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
                          >
                            INQUIRE
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
