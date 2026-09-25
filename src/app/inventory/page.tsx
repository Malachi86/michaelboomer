
'use client';

import React, { useMemo, Suspense, useState } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, MessageSquare, Car, Star, CheckCircle2, ShieldCheck, Loader2, ChevronRight, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from '@/components/portfolio/Navigation';
import Footer from '@/components/portfolio/Footer';
import type { Project, Profile } from '@/lib/types';
import { profile as defaultProfile } from '@/lib/data';

function VehicleDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const db = useFirestore();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const projectRef = useMemo(() => (db && id ? doc(db, 'projects', id) : null), [db, id]);
  const { data: project, loading: projectLoading } = useDoc<Project>(projectRef);

  const profileRef = useMemo(() => (db ? doc(db, 'profile', 'data') : null), [db]);
  const { data: profileData } = useDoc<Profile>(profileRef);

  const profile = (profileData || defaultProfile) as Profile;

  const allImages = useMemo(() => {
    if (!project) return [];
    return [project.image_url, ...(project.additional_images || [])].filter(Boolean) as string[];
  }, [project]);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const videoEmbedUrl = useMemo(() => project?.video_url ? getYoutubeEmbedUrl(project.video_url) : null, [project?.video_url]);

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#0E2356] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
        <p className="text-[#0E2356] animate-pulse font-bold tracking-widest uppercase text-xs">Loading Unit Details...</p>
      </div>
    );
  }

  if (!project || !id) {
    return (
      <div className="min-h-screen bg-[#FFFBFA] flex flex-col items-center justify-center p-6 text-center">
        <Car className="w-20 h-20 text-gray-200 mb-6" />
        <h1 className="text-3xl font-black text-[#0E2356] uppercase mb-4">Vehicle Not Found</h1>
        <p className="text-gray-500 mb-8">Ang unit na iyong hinahanap ay maaaring inalis o hindi na available.</p>
        <Link href="/">
          <Button className="bg-[#0E2356] text-white px-10 h-14 font-black rounded-xl">BACK TO SHOWROOM</Button>
        </Link>
      </div>
    );
  }

  const currentMainImage = activeImage || project.image_url;

  return (
    <div className="min-h-screen bg-[#FFFBFA] text-[#0E2356]">
      <Navigation profile={profile} />

      <main className="pt-32 pb-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <Link href="/#projects">
            <Button variant="ghost" className="mb-12 text-[#0E2356] font-black uppercase text-[10px] tracking-widest hover:bg-white group">
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Showroom
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-32"
            >
              <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden shadow-2xl bg-white border-8 border-white group">
                {currentMainImage ? (
                  <Image
                    src={currentMainImage}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover transition-all duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <Car className="w-24 h-24 text-slate-200" />
                  </div>
                )}
                
                {project.featured && (
                  <div className="absolute top-8 right-8">
                    <Badge className="bg-[#E31B23] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl border-none">
                      <Star className="w-3.5 h-3.5 mr-2 fill-white" />
                      HOT DEAL
                    </Badge>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3 mt-6">
                    {allImages.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img || (!activeImage && img === project.image_url) ? 'border-[#E31B23] shadow-lg scale-105' : 'border-white hover:border-red-100 opacity-70 hover:opacity-100'}`}
                        >
                            <Image src={img} alt={`Gallery ${idx}`} fill unoptimized className="object-cover" />
                        </button>
                    ))}
                </div>
              )}

              {/* Video Section */}
              {project.video_url && (
                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#E31B23] rounded-full" />
                    <h4 className="text-[10px] font-black text-[#0E2356] uppercase tracking-[0.3em]">Video Presentation</h4>
                  </div>
                  {videoEmbedUrl ? (
                    <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-xl bg-black border-4 border-white">
                      <iframe
                        src={videoEmbedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full h-20 rounded-[32px] border-gray-200 text-[#0E2356] font-black text-[12px] tracking-[0.2em] hover:bg-white hover:border-[#0E2356] uppercase shadow-sm group"
                      asChild
                    >
                      <a href={project.video_url} target="_blank" rel="noopener noreferrer">
                        <Play className="w-5 h-5 mr-3 text-[#E31B23] fill-[#E31B23] group-hover:scale-110 transition-transform" />
                        Watch Full Presentation
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Availability</p>
                    <p className="text-sm font-black text-[#0E2356] uppercase">Ready Stock</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#0E2356]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Warranty</p>
                    <p className="text-sm font-black text-[#0E2356] uppercase">Suzuki Guaranteed</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <Badge className="bg-[#0E2356] text-white mb-6 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-xl border-none">
                  {project.category}
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-black text-[#0E2356] mb-6 leading-none uppercase tracking-tighter">
                  {project.title}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed font-medium max-w-xl whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              <div className="p-10 bg-gradient-to-br from-[#0E2356] to-[#1a2f6b] rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em] mb-3 relative z-10">Starting Retail Price</p>
                <div className="flex items-baseline gap-2 relative z-10">
                   <span className="text-2xl font-black text-[#E31B23]">₱</span>
                   <span className="text-6xl font-black tracking-tighter">
                    {(project.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Key Specifications</h4>
                    <div className="h-px flex-grow bg-gray-100" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.tech_stack.map((spec, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                        className="bg-white p-6 rounded-[32px] flex items-center gap-5 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all group border border-transparent hover:border-red-50"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E31B23] shrink-0" />
                        <span className="text-[11px] lg:text-[12px] font-black text-[#0E2356] uppercase tracking-wider leading-tight">
                          {spec}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-20 rounded-[28px] shadow-2xl shadow-red-100 text-sm tracking-[0.2em] group"
                  onClick={() => {
                    if (project.live_demo_url && project.live_demo_url !== '#') {
                      window.open(project.live_demo_url, '_blank');
                    } else {
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  PROCEED TO INQUIRY
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Button>
                
                <Link href="/#contact" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 rounded-[28px] border-gray-200 text-[#0E2356] font-black text-[12px] tracking-[0.2em] hover:bg-white hover:border-[#0E2356] uppercase shadow-sm"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    Talk to Agent
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}

export default function VehicleDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
      </div>
    }>
      <VehicleDetailContent />
    </Suspense>
  );
}
