'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/portfolio/Navigation';
import Footer from '@/components/portfolio/Footer';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { profile as defaultProfile } from '@/lib/data';
import { Loader2, Star, Quote, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function ReviewsPage() {
  const db = useFirestore();

  const profileRef = useMemo(() => doc(db, 'profile', 'data'), [db]);
  const { data: profileData, loading: profileLoading } = useDoc(profileRef);

  const testimonialsQuery = useMemo(() => query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')), [db]);
  const { data: testimonialsData, loading: testimonialsLoading } = useCollection(testimonialsQuery);

  const isLoading = profileLoading || testimonialsLoading;
  const profile = profileData || defaultProfile;
  const testimonials = (testimonialsData || []).filter(t => t.approved);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#0E2356] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
        <p className="text-[#0E2356] animate-pulse font-bold tracking-widest">LOADING REVIEWS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBFA] text-[#0E2356]">
      <Navigation profile={profile} />
      
      <main className="pt-32 pb-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="mb-16">
            <Link href="/">
              <Button variant="ghost" className="text-[#0E2356] font-black uppercase text-[10px] tracking-widest mb-8 hover:bg-white">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Showroom
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl lg:text-7xl font-serif text-[#0E2356] mb-6">
                Client Success Stories
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
                Tingnan ang karanasan ng ating mga naging Suzuki owners. Bawat kwento ay patunay ng aming de-kalidad na serbisyo.
              </p>
              <div className="w-24 h-1 bg-[#E31B23] mt-8 rounded-full" />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white border-none rounded-[32px] h-full showroom-shadow border-2 border-transparent hover:border-red-50 transition-all">
                  <CardContent className="p-10 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < (item.rating || 5) ? 'text-[#E31B23] fill-[#E31B23]' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <div className="relative mb-10">
                      <Quote className="absolute -left-4 -top-4 w-10 h-10 text-slate-50 -z-0" />
                      <p className="text-[#0E2356] text-lg font-bold leading-relaxed relative z-10 italic">
                        "{item.feedback}"
                      </p>
                    </div>

                    <div className="flex items-center gap-5 pt-8 border-t border-gray-50 mt-auto">
                      <div className="w-12 h-12 rounded-2xl bg-[#0E2356] flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {item.clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#0E2356] tracking-tight uppercase">
                          {item.clientName}
                        </h4>
                        {item.company && (
                          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1">
                            {item.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {testimonials.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
               <Quote className="w-16 h-16 text-slate-100 mx-auto mb-6" />
               <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">No reviews found.</p>
            </div>
          )}
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
