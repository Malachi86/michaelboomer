
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Upload, Loader2, UserCircle, CheckCircle2, Link as LinkIcon, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/app/admin/actions';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/types';

const DEFAULT_PROFILE: Profile = {
  full_name: 'Michael Gabriel Orozco',
  title: '',
  subtitle: '',
  bio: '',
  profile_image: '',
  resume_url: '',
  email: 'orozcomarvinpaul@gmail.com',
  social_links: [],
  inventory_title: 'Suzuki Vehicle Catalog',
  inventory_subtitle: 'OUR INVENTORY',
  certificates_title: 'Agent Professional Status',
  certificates_description: 'Certified expertise to ensure a smooth and worry-free car buying journey.',
  testimonials_title: 'What Our Clients Say',
  testimonials_description: 'Ang inyong tiwala ay ang aming inspirasyon sa de-kalidad na serbisyo.'
};

export default function AdminProfilePage() {
  const { toast } = useToast();
  const db = useFirestore();
  const profileRef = useMemo(() => doc(db, 'profile', 'data'), [db]);
  const { data: profileData, loading } = useDoc(profileRef);

  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (profileData && !hasInitialized) {
      setProfile({ ...DEFAULT_PROFILE, ...(profileData as Profile) });
      setHasInitialized(true);
    }
  }, [profileData, hasInitialized]);

  const handleSave = async (updatedProfile?: Profile) => {
    setIsSaving(true);
    const result = await updateProfile(updatedProfile || profile);
    setIsSaving(false);
    if (result.success) {
      toast({ title: 'Success ✨', description: 'Profile information updated!' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limit = 1024 * 1024; 
    if (file.size > limit) {
      toast({ variant: "destructive", title: "File too large ⚠️", description: "Limit: 1MB." });
      e.target.value = ''; return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const updatedProfile = { ...profile, profile_image: base64 };
      setProfile(updatedProfile);
      await handleSave(updatedProfile);
      setIsUploading(false);
      toast({ title: "Upload Success! 📂" });
    };
    reader.readAsDataURL(file);
  };

  const addSocialLink = () => {
    setProfile({ ...profile, social_links: [...(profile.social_links || []), { platform: '', url: '', icon: '' }] });
  };

  const removeSocialLink = (index: number) => {
    setProfile({ ...profile, social_links: profile.social_links.filter((_, i) => i !== index) });
  };

  if (loading && !hasInitialized) {
    return <div className="flex flex-col items-center justify-center h-[60vh] gap-4"><Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" /><p className="text-[#0E2356] font-bold uppercase tracking-widest text-xs">Loading Profile...</p></div>;
  }

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase">Agent Profile</motion.h1>
          <p className="text-gray-400 font-medium">Manage your branding and site-wide copy.</p>
        </div>
        <Button onClick={() => handleSave()} disabled={isSaving || isUploading} className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black px-8 h-14 rounded-2xl shadow-xl uppercase tracking-widest text-xs">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Update All Details
        </Button>
      </div>

      <div className="space-y-10">
        {/* Profile Photo Card */}
        <Card className="bg-white border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8"><CardTitle className="text-[#0E2356] font-black uppercase text-xl">Profile Photo</CardTitle></CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-48 h-48 rounded-[40px] overflow-hidden bg-slate-50 border-4 border-white shadow-2xl shrink-0 group cursor-pointer" onClick={() => !isUploading && document.getElementById('profile-upload')?.click()}>
                {profile.profile_image ? ( <img src={profile.profile_image} alt="Profile" className="object-cover w-full h-full" /> ) : ( <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 italic gap-2"><UserCircle className="w-16 h-16 opacity-10" /><span className="text-[10px] uppercase font-black">Select Image</span></div> )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm">{isUploading ? <Loader2 className="animate-spin w-10 h-10" /> : <Upload className="w-10 h-10" />}<span className="text-xs font-bold">Upload</span></div>
              </div>
              <div className="flex-1 w-full space-y-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="profile-upload" />
                <Label className="text-[10px] font-black uppercase text-gray-400">Profile Image Link</Label>
                <div className="relative"><LinkIcon className="absolute left-4 top-4.5 w-4 h-4 text-gray-300" /><Input value={profile.profile_image} onChange={e => setProfile({...profile, profile_image: e.target.value})} className="h-14 bg-slate-50 border-gray-100 pl-12 rounded-2xl font-bold text-[#0E2356]" /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Card */}
        <Card className="bg-white border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8"><CardTitle className="text-[#0E2356] font-black uppercase text-xl">Identity</CardTitle></CardHeader>
          <CardContent className="p-8 pt-0 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase text-gray-400">Full Name</Label><Input value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" /></div>
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase text-gray-400">Email Address</Label><Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" /></div>
            </div>
            <div className="space-y-3"><Label className="text-[10px] font-black uppercase text-gray-400">Professional Bio</Label><Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows={4} className="bg-slate-50 border-gray-100 rounded-xl p-5 font-bold text-[#0E2356]" /></div>
          </CardContent>
        </Card>

        {/* WEBSITE COPY CARD (NEW) */}
        <Card className="bg-white border-none shadow-xl rounded-[32px] overflow-hidden border-t-8 border-[#0E2356]">
          <CardHeader className="p-8 bg-[#0E2356]/5">
            <div className="flex items-center gap-3">
               <Layout className="w-6 h-6 text-[#0E2356]" />
               <CardTitle className="text-[#0E2356] font-black uppercase text-xl">Website Branding (Section Titles)</CardTitle>
            </div>
            <CardDescription className="text-gray-400 font-medium italic mt-2">Dito pwedeng palitan ang mga headings at descriptions sa bawat section ng showroom.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-12">
            
            {/* Inventory Section Branding */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-[#E31B23] pl-4"><h3 className="font-black text-[#0E2356] uppercase text-sm">Inventory Section</h3></div>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-gray-400">Catalog Title</Label><Input value={profile.inventory_title} onChange={e => setProfile({...profile, inventory_title: e.target.value})} placeholder="Suzuki Vehicle Catalog" className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-gray-400">Red Tagline (Subtitle)</Label><Input value={profile.inventory_subtitle} onChange={e => setProfile({...profile, inventory_subtitle: e.target.value})} placeholder="OUR INVENTORY" className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold" /></div>
               </div>
            </div>

            {/* Happy Clients Branding */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-[#E31B23] pl-4"><h3 className="font-black text-[#0E2356] uppercase text-sm">Happy Clients Section</h3></div>
               <div className="space-y-6">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-gray-400">Section Title</Label><Input value={profile.certificates_title} onChange={e => setProfile({...profile, certificates_title: e.target.value})} placeholder="Agent Professional Status" className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-gray-400">Section Description</Label><Textarea value={profile.certificates_description} onChange={e => setProfile({...profile, certificates_description: e.target.value})} className="bg-slate-50 border-gray-100 rounded-xl font-bold" /></div>
               </div>
            </div>

            {/* Testimonials Branding */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-[#E31B23] pl-4"><h3 className="font-black text-[#0E2356] uppercase text-sm">Client Reviews Section</h3></div>
               <div className="space-y-6">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-gray-400">Section Title</Label><Input value={profile.testimonials_title} onChange={e => setProfile({...profile, testimonials_title: e.target.value})} placeholder="What Our Clients Say" className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-gray-400">Section Description</Label><Textarea value={profile.testimonials_description} onChange={e => setProfile({...profile, testimonials_description: e.target.value})} className="bg-slate-50 border-gray-100 rounded-xl font-bold" /></div>
               </div>
            </div>

          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="bg-white border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 flex flex-row items-center justify-between"><CardTitle className="text-[#0E2356] font-black uppercase text-xl">Social Links</CardTitle><Button variant="outline" className="h-12 border-gray-100 rounded-xl font-black text-[10px] uppercase text-[#0E2356] px-6" onClick={addSocialLink}><Plus className="w-4 h-4 mr-2" />Add Link</Button></CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            {profile.social_links?.map((link, index) => (
              <div key={index} className="flex items-center gap-6 p-6 bg-slate-50 rounded-[24px] border border-gray-100">
                <div className="flex-1 grid md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label className="text-[9px] font-black uppercase text-gray-400">Platform</Label><Input value={link.platform} onChange={e => { const nl = [...profile.social_links]; nl[index].platform = e.target.value; setProfile({...profile, social_links: nl}); }} placeholder="e.g. Facebook" className="h-14 bg-white border-gray-100 rounded-xl font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[9px] font-black uppercase text-gray-400">URL</Label><Input value={link.url} onChange={e => { const nl = [...profile.social_links]; nl[index].url = e.target.value; setProfile({...profile, social_links: nl}); }} placeholder="Full URL" className="h-14 bg-white border-gray-100 rounded-xl font-bold" /></div>
                </div>
                <Button variant="ghost" className="text-red-500 rounded-xl w-14 h-14" onClick={() => removeSocialLink(index)}><Trash2 className="w-6 h-6" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
