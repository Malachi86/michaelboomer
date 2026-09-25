'use client';

import React, { useMemo } from 'react';
import Navigation from '@/components/portfolio/Navigation';
import HeroSection from '@/components/portfolio/HeroSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import CertificatesSection from '@/components/portfolio/CertificatesSection';
import TestimonialsSection from '@/components/portfolio/TestimonialsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import { useDoc, useCollection } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { profile as defaultProfile } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const db = useFirestore();

  // Memoizing queries to prevent redundant re-fetching and save on reads
  const profileRef = useMemo(() => doc(db, 'profile', 'data'), [db]);
  const { data: profileData, loading: profileLoading } = useDoc(profileRef);

  const projectsQuery = useMemo(() => query(collection(db, 'projects'), orderBy('order', 'asc')), [db]);
  const { data: projectsData, loading: projectsLoading } = useCollection(projectsQuery);

  const certificatesQuery = useMemo(() => query(collection(db, 'certificates'), orderBy('order', 'asc')), [db]);
  const { data: certificatesData, loading: certificatesLoading } = useCollection(certificatesQuery);

  const testimonialsQuery = useMemo(() => query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')), [db]);
  const { data: testimonialsData, loading: testimonialsLoading } = useCollection(testimonialsQuery);

  const isLoading = profileLoading || projectsLoading || certificatesLoading || testimonialsLoading;

  const profile = profileData || defaultProfile;
  const projects = projectsData || [];
  const certificates = certificatesData || [];
  const testimonials = testimonialsData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#0E2356] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
        <p className="text-[#0E2356] animate-pulse font-black tracking-widest uppercase text-xs">Opening Suzuki Showroom...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0E2356]">
      <Navigation profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
