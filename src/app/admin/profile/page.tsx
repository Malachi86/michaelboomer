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
      // Create a unique file path in Firebase Storage
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `uploads/profile/${fileName}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      const updatedProfile = { ...profile, profile_image: downloadURL };
      setProfile(updatedProfile);
      
      // Auto-save the image path to the database
      await updateProfile(updatedProfile);
      
      toast({ 
        title: 'Success', 
        description: 'Profile picture uploaded and saved to database successfully!' 
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to upload image to Firebase Storage.' });
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
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading profile data...</p>
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
            className="text-3xl font-bold text-white mb-2"
          >
            Profile Settings
          </motion.h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card border-border/50 text-white">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>This will be displayed on your portfolio hero section. Uploading a new photo will auto-save it to the database.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border shadow-inner">
                  {profile.profile_image ? (
                    <Image 
                      src={profile.profile_image} 
                      alt="Profile" 
                      fill 
                      unoptimized
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Plus className="w-8 h-8" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                    <Button variant="outline" className="border-border/50 text-muted-foreground hover:text-white" asChild disabled={isUploading}>
                      <span>
                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload Photo
                      </span>
                    </Button>
                  </Label>
                  <p className="text-muted-foreground text-xs mt-2 opacity-70">Recommended: Square image (400x400px)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card border-border/50 text-white">
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} placeholder="Ex: Marvin Paul Orozco" className="bg-muted border-border/50"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="bg-muted border-border/50"/>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} placeholder="Ex: Web Developer & VA" className="bg-muted border-border/50"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Input value={profile.subtitle} onChange={(e) => setProfile({...profile, subtitle: e.target.value})} placeholder="Ex: Fullstack Developer" className="bg-muted border-border/50"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Tell something about yourself..." rows={6} className="bg-muted border-border/50 resize-none"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Resume URL (Canva, Google Drive, etc.)</Label>
                        <Input value={profile.resume_url} onChange={(e) => setProfile({...profile, resume_url: e.target.value})} placeholder="https://..." className="bg-muted border-border/50"/>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card border-border/50 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Social Links</CardTitle>
                        <CardDescription>Add links to your social profiles</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-border/50" onClick={addSocialLink}><Plus className="w-4 h-4 mr-2" />Add Link</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                {profile.social_links?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No social links added yet</p>
                ) : (
                    profile.social_links.map((link, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-white/5">
                        <div className="flex-1 grid md:grid-cols-2 gap-4">
                          <Input
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                            placeholder="Platform (github, linkedin, etc.)"
                            className="bg-muted border-border/50 text-white"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                            placeholder="Full URL (https://...)"
                            className="bg-muted border-border/50 text-white"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeSocialLink(index)}
                        >
                          <Trash2 className="w-4 h-4" />
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
