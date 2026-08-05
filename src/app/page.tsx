'use client';

import React, { useMemo } from 'react';
import Navigation from '@/components/portfolio/Navigation';
import HeroSection from '@/components/portfolio/HeroSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
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

  const profileRef = useMemo(() => doc(db, 'profile', 'data'), [db]);
  const { data: profileData, loading: profileLoading } = useDoc(profileRef);

  const skillsQuery = useMemo(() => query(collection(db, 'skills'), orderBy('order', 'asc')), [db]);
  const { data: skillsData, loading: skillsLoading } = useCollection(skillsQuery);

  const projectsQuery = useMemo(() => query(collection(db, 'projects'), orderBy('order', 'asc')), [db]);
  const { data: projectsData, loading: projectsLoading } = useCollection(projectsQuery);

  const certsQuery = useMemo(() => query(collection(db, 'certificates'), orderBy('order', 'asc')), [db]);
  const { data: certsData, loading: certsLoading } = useCollection(certsQuery);

  const testimonialsQuery = useMemo(() => query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')), [db]);
  const { data: testimonialsData, loading: testimonialsLoading } = useCollection(testimonialsQuery);

  const isLoading = profileLoading || skillsLoading || projectsLoading || certsLoading || testimonialsLoading;

  // Use Firestore data if available, otherwise use empty arrays or default profile
  const profile = profileData || defaultProfile;
  const skills = skillsData || [];
  const projects = projectsData || [];
  const certificates = certsData || [];
  const testimonials = testimonialsData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading Digital Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
