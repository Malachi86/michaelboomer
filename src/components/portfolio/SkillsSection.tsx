'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Code, Palette, Headphones, Wrench, FileCode, Layout, Database, Video, 
  PenTool, Globe, Terminal, Smartphone, Server, Cloud, Zap, Clock, 
  Calendar, Mail, MessageSquare, Users, CheckCircle, Briefcase, 
  Search, BarChart, MousePointer, Play, Image as ImageIcon
} from 'lucide-react';
import type { Skill } from '@/lib/types';

const iconMap: Record<string, React.ElementType> = {
  'Code': Code, 'FileCode': FileCode, 'Layout': Layout, 'Database': Database,
  'Video': Video, 'PenTool': PenTool, 'Globe': Globe, 'Terminal': Terminal,
  'Smartphone': Smartphone, 'Server': Server, 'Cloud': Cloud, 'Palette': Palette,
  'Headphones': Headphones, 'Wrench': Wrench, 'Zap': Zap, 'Clock': Clock,
  'Calendar': Calendar, 'Mail': Mail, 'MessageSquare': MessageSquare,
  'Users': Users, 'CheckCircle': CheckCircle, 'Briefcase': Briefcase,
  'Search': Search, 'BarChart': BarChart, 'MousePointer': MousePointer,
  'Play': Play, 'Image': ImageIcon
};

const categories = ['All', 'Development', 'Design', 'VA Tools', 'Other'];

export default function SkillsSection({ skills = [] }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  if (!skills || skills.length === 0) return null;

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  const sortedSkills = [...filteredSkills].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="skills" className="relative py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#E31B23] font-bold tracking-widest uppercase text-sm mb-4">
            Expertise & Reliability
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0E2356] mb-6">
            Agent Professional Status
          </h2>
          <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto">
            Certified expertise to ensure a smooth and worry-free car buying journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category 
                ? "bg-[#E31B23] text-white border-0 font-bold"
                : "border-gray-200 text-gray-700 hover:text-[#0E2356] hover:border-[#0E2356] font-bold"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <AnimatePresence>
            {sortedSkills.map((skill, index) => {
              const Icon = iconMap[skill.icon] || Code;
              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-[#E31B23]/30 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-50 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E31B23] group-hover:text-white">
                      <Icon className="w-8 h-8 text-[#E31B23] group-hover:text-white" />
                    </div>
                    <h3 className="text-[#0E2356] font-bold text-sm uppercase tracking-tight">{skill.name}</h3>
                    {skill.proficiency && (
                      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-[#E31B23]"
                        />
                      </div>
                    )}
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