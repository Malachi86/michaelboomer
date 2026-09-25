'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Upload, Loader2, UserCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/app/admin/actions';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/types';
import Image from 'next/image';

const DEFAULT_PROFILE: Profile = {
  full_name: 'Michael Gabriel Orozco',
  title: '',
  subtitle: '',
  bio: '',
  profile_image: '',
  resume_url: '',
  email: 'orozcomarvinpaul@gmail.com',
  social_links: []
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
      setProfile(profileData as Profile);
      setHasInitialized(true);
    }
  }, [profileData, hasInitialized]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateProfile(profile);
    setIsSaving(false);
    if (result.success) {
      toast({ title: 'Success ✨', description: 'Profile information updated!' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    }
  };

  // DIRETSO UPLOAD LOGIC (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 250KB Limit for Firestore stability
    const limit = 250 * 1024;
    if (file.size > limit) {
      toast({ 
        variant: "destructive", 
        title: "File too large ⚠️", 
        description: `Mangyaring gumamit ng file na maliit sa 250KB para sa bilis ng database.` 
      });
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = async () => {
      const base64 = reader.result as string;
      const updatedProfile = { ...profile, profile_image: base64 };
      setProfile(updatedProfile);
      
      // AUTO-SYNC TO DATABASE
      const result = await updateProfile(updatedProfile);
      setIsUploading(false);
      
      if (result.success) {
        toast({ title: "Upload Success! 📂", description: "Lumalabas na agad ito sa showroom." });
      }
    };

    reader.onerror = () => {
      setIsUploading(null);
      toast({ variant: "destructive", title: "Read Error", description: "Failed to process file." });
    };

    reader.readAsDataURL(file);
  };

  const addSocialLink = () => {
    setProfile({
      ...profile,
      social_links: [...(profile.social_links || []), { platform: '', url: '', icon: '' }]
    });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...profile.social_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setProfile({ ...profile, social_links: newLinks });
  };

  const removeSocialLink = (index: number) => {
    setProfile({ ...profile, social_links: profile.social_links.filter((_, i) => i !== index) });
  };

  if (loading && !hasInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
        <p className="text-[#0E2356] text-sm font-bold uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase"
          >
            Agent Profile
          </motion.h1>
          <p className="text-gray-400 font-medium">Manage your professional Suzuki representative data.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black px-8 h-14 rounded-2xl shadow-xl shadow-red-100 uppercase tracking-widest text-xs"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Update All Details
        </Button>
      </div>

      <div className="space-y-10">
        {/* Profile Photo Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-[#0E2356] font-black uppercase tracking-tight text-xl">Profile Photo</CardTitle>
              <CardDescription className="text-gray-400 font-medium italic">Diretso upload agad sa database pagkapili ng file.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div 
                  className="relative w-48 h-48 rounded-[40px] overflow-hidden bg-slate-50 border-4 border-white shadow-2xl shrink-0 group cursor-pointer"
                  onClick={() => !isUploading && document.getElementById('profile-upload')?.click()}
                >
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 italic gap-2">
                      <UserCircle className="w-16 h-16 opacity-10" />
                      <span className="text-[10px] uppercase font-black tracking-widest">Select Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm">
                    {isUploading ? <Loader2 className="animate-spin w-10 h-10" /> : <Upload className="w-10 h-10" />}
                    <span className="text-xs font-bold uppercase tracking-widest">Upload New</span>
                  </div>
                </div>
                
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sync Limit: 250KB</p>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Or paste external Link</Label>
                          <Input
                            value={profile.profile_image}
                            onChange={(e) => setProfile({...profile, profile_image: e.target.value})}
                            placeholder="https://images.unsplash.com/..."
                            className="h-14 bg-slate-50 border-gray-100 rounded-2xl font-bold text-[#0E2356] focus:border-[#E31B23]"
                          />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Basic Information Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
                <CardHeader className="p-8">
                    <CardTitle className="text-[#0E2356] font-black uppercase tracking-tight text-xl">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                            <Input
                                value={profile.full_name}
                                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                placeholder="Michael Gabriel Orozco"
                                className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                            <Input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Title</Label>
                            <Input
                                value={profile.title}
                                onChange={(e) => setProfile({...profile, title: e.target.value})}
                                placeholder="Authorized Suzuki Executive"
                                className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle</Label>
                            <Input
                                value={profile.subtitle}
                                onChange={(e) => setProfile({...profile, subtitle: e.target.value})}
                                placeholder="Sales Consultant"
                                className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Professional Bio</Label>
                        <Textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            placeholder="Tell your clients about your expertise..."
                            rows={6}
                            className="bg-slate-50 border-gray-100 rounded-xl resize-none p-5 font-bold text-[#0E2356] leading-relaxed"
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Social Links Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
                <CardHeader className="p-8 flex flex-row items-center justify-between">
                    <CardTitle className="text-[#0E2356] font-black uppercase tracking-tight text-xl">Social Links</CardTitle>
                    <Button variant="outline" size="sm" className="h-12 border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#0E2356] px-6" onClick={addSocialLink}><Plus className="w-4 h-4 mr-2" />Add Link</Button>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                {profile.social_links?.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-100">
                      <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No links added yet</p>
                    </div>
                ) : (
                    profile.social_links.map((link, index) => (
                      <div key={index} className="flex items-center gap-6 p-6 bg-slate-50 rounded-[24px] border border-gray-100">
                        <div className="flex-1 grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Platform Name</Label>
                            <Input
                              value={link.platform}
                              onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                              placeholder="e.g. Facebook"
                              className="h-14 bg-white border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">URL / Contact Info</Label>
                            <Input
                              value={link.url}
                              onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                              placeholder="Full URL"
                              className="h-14 bg-white border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl w-14 h-14"
                          onClick={() => removeSocialLink(index)}
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}
