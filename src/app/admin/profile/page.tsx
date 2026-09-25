
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Upload, Loader2, Link as LinkIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/app/admin/actions';
import { useDoc, useFirestore, useStorage } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Profile } from '@/lib/types';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const storage = useStorage();
  const profileRef = useMemo(() => doc(db, 'profile', 'data'), [db]);
  const { data: profileData, loading } = useDoc(profileRef);

  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [corsError, setCorsError] = useState(false);

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
      toast({ title: 'Success', description: 'Profile information updated!' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to update profile.' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);
    setCorsError(false);

    try {
      console.log('[Upload] Starting fast upload for:', file.name);
      const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `uploads/profile/${fileName}`);

      // DIRECT UPLOAD - No compression, fastest way
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // AUTOMATIC DATABASE SYNC - Update Firestore immediately
      const updatedProfile = { ...profile, profile_image: downloadURL };
      setProfile(updatedProfile);
      
      const result = await updateProfile(updatedProfile);
      if (result.success) {
        toast({ title: 'Upload Success', description: 'Photo is now live in the database!' });
      } else {
        throw new Error('Upload succeeded but database sync failed.');
      }
    } catch (error: any) {
      console.error('[Profile Upload Error]:', error);
      if (error.message?.toLowerCase().includes('cors') || error.code?.includes('cors')) {
        setCorsError(true);
      }
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
      setPreviewUrl(null);
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
          Save Profile Data
        </Button>
      </div>

      {corsError && (
        <Alert variant="destructive" className="mb-10 border-red-200 bg-red-50 text-red-700 p-8 rounded-[32px]">
          <ShieldAlert className="h-8 w-8 mb-4" />
          <AlertTitle className="font-black uppercase tracking-widest text-sm mb-4">Security Block Detected (CORS Error)</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed space-y-4">
            <p>Bina-block ng Firebase ang iyong domain. Sundin ang mga hakbang na ito sa iyong <strong>Terminal</strong>:</p>
            <div className="bg-white p-4 rounded-xl border border-red-100 space-y-3 font-mono">
              <p className="text-[10px] text-gray-400 uppercase font-black">Step 1: Set the correct project</p>
              <code className="block bg-slate-50 p-2 rounded select-all text-blue-600">gcloud config set project studio-7714200755-d4b21</code>

              <p className="text-[10px] text-gray-400 uppercase font-black">Step 2: Alamin ang iyong bucket name</p>
              <code className="block bg-slate-50 p-2 rounded select-all text-blue-600">gsutil ls</code>
              
              <p className="text-[10px] text-gray-400 uppercase font-black">Step 3: Gamitin ang saktong bucket name (yung may gs://...)</p>
              <code className="block bg-slate-50 p-2 rounded select-all text-red-600">gsutil cors set cors.json [LUMABAS_SA_STEP_2]</code>
            </div>
            <p className="mt-2 text-[10px] opacity-70 italic font-medium">Pagkatapos nito, magiging "upload agad" na ang karanasan mo.</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-10">
        {/* Profile Photo Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-[#0E2356] font-black uppercase tracking-tight text-xl">Profile Photo</CardTitle>
              <CardDescription className="text-gray-400 font-medium italic">Changes here sync instantly to the database after upload.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative w-48 h-48 rounded-[40px] overflow-hidden bg-slate-50 border-4 border-white shadow-2xl shrink-0 group">
                  {(previewUrl || profile.profile_image) ? (
                    <Image
                      src={previewUrl || profile.profile_image}
                      alt="Profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Plus className="w-12 h-12" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-[#0E2356]/70 flex flex-col items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                        <span className="text-white text-[8px] font-black uppercase tracking-widest">Uploading...</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-upload"
                      disabled={isUploading}
                    />
                    <Label htmlFor="profile-upload">
                      <Button variant="outline" className="w-full h-16 border-gray-100 text-[#0E2356] font-black text-xs tracking-widest uppercase rounded-2xl hover:bg-slate-50 transition-all" asChild disabled={isUploading}>
                        <span>
                          {isUploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                          UPLOAD NEW PHOTO
                        </span>
                      </Button>
                    </Label>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">External Image Link (Optional)</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-4.5 w-4 h-4 text-gray-300" />
                        <Input
                          value={profile.profile_image}
                          onChange={(e) => {
                            setProfile({...profile, profile_image: e.target.value});
                            setPreviewUrl(null); 
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="h-14 bg-slate-50 border-gray-100 pl-11 rounded-2xl font-bold text-[#0E2356] focus:border-[#E31B23]"
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
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Resume/Credential URL</Label>
                        <Input
                            value={profile.resume_url}
                            onChange={(e) => setProfile({...profile, resume_url: e.target.value})}
                            placeholder="https://..."
                            className="h-14 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
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
