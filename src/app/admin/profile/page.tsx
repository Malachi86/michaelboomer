'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Upload, Loader2, Github, Linkedin, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/app/admin/actions';
import { useDoc, useFirestore, useStorage } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Profile } from '@/lib/types';
import Image from 'next/image';

const DEFAULT_PROFILE: Profile = {
  full_name: '',
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
  const storage = useStorage();
  const profileRef = useMemo(() => doc(db, 'profile', 'data'), [db]);
  const { data: profileData, loading } = useDoc(profileRef);
  
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync state with Firestore data or set defaults
  useEffect(() => {
    if (!loading) {
      if (profileData) {
        setProfile(profileData as Profile);
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    }
  }, [profileData, loading]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateProfile(profile);
    setIsSaving(false);
    if (result.success) {
      toast({ title: 'Success', description: 'Profile updated successfully!' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setIsUploading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `uploads/profile/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const updatedProfile = { ...profile, profile_image: downloadURL };
      setProfile(updatedProfile);
      
      await updateProfile(updatedProfile);
      
      toast({ 
        title: 'Success', 
        description: 'Profile picture uploaded and saved!' 
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to upload image.' });
    } finally {
      setIsUploading(false);
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
        <p className="text-[#0E2356] text-sm font-bold uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase"
          >
            Agent Profile
          </motion.h1>
          <p className="text-gray-400 font-medium">Manage your personal and professional information</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black px-8 h-12 rounded-xl shadow-lg uppercase tracking-widest text-xs"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-[#0E2356] font-black uppercase tracking-tight text-xl">Profile Photo</CardTitle>
              <CardDescription className="text-gray-400 font-medium">This will be displayed on your showroom hero section.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32 rounded-[24px] overflow-hidden bg-slate-50 border-4 border-white shadow-xl">
                  {profile.profile_image ? (
                    <Image 
                      src={profile.profile_image} 
                      alt="Profile" 
                      fill 
                      unoptimized
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Plus className="w-8 h-8" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-[#0E2356]/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                    disabled={isUploading}
                  />
                  <Label htmlFor="profile-upload">
                    <Button variant="outline" className="h-12 border-gray-100 text-[#0E2356] font-black text-[10px] tracking-widest uppercase rounded-xl" asChild disabled={isUploading}>
                      <span>
                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload New Photo
                      </span>
                    </Button>
                  </Label>
                  <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest opacity-60">Recommended: Square image (400x400px)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden text-[#0E2356]">
                <CardHeader className="p-8"><CardTitle className="font-black uppercase tracking-tight text-xl">Basic Information</CardTitle></CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</Label>
                            <Input value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} placeholder="Marvin Paul Orozco" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                            <Input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"/>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Title</Label>
                            <Input value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} placeholder="Authorized Suzuki Executive" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtitle</Label>
                            <Input value={profile.subtitle} onChange={(e) => setProfile({...profile, subtitle: e.target.value})} placeholder="Sales Consultant" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Bio</Label>
                        <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Tell your clients about your expertise..." rows={6} className="bg-slate-50 border-gray-100 rounded-xl resize-none p-4 font-bold text-[#0E2356] leading-relaxed"/>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resume/Credential URL</Label>
                        <Input value={profile.resume_url} onChange={(e) => setProfile({...profile, resume_url: e.target.value})} placeholder="https://..." className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"/>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden text-[#0E2356]">
                <CardHeader className="p-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-black uppercase tracking-tight text-xl">Social Links</CardTitle>
                        <CardDescription className="text-gray-400 font-medium">Links for client communication</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-10 border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#0E2356] hover:bg-slate-50" onClick={addSocialLink}><Plus className="w-4 h-4 mr-2" />Add Link</Button>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                {profile.social_links?.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-100">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No links added yet</p>
                    </div>
                ) : (
                    profile.social_links.map((link, index) => (
                      <div key={index} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[20px] border border-slate-100">
                        <div className="flex-1 grid md:grid-cols-2 gap-4">
                          <Input
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                            placeholder="Platform (e.g. Facebook)"
                            className="h-12 bg-white border-gray-100 rounded-xl font-bold text-[#0E2356]"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                            placeholder="Full URL (https://...)"
                            className="h-12 bg-white border-gray-100 rounded-xl font-bold text-[#0E2356]"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                          onClick={() => removeSocialLink(index)}
                        >
                          <Trash2 className="w-5 h-5" />
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
