'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Loader2, Upload, ExternalLink, Github, Play, Star, Car, Link as LinkIcon, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProjects, addProject, updateProject, deleteProject } from '@/app/admin/actions';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from '@/lib/types';

const categories = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV', 'VAN', 'PICKUP'];

export function AdminProjectsPage() {
    const { toast } = useToast();
    const storage = useStorage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [techInput, setTechInput] = useState('');

    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        title: '',
        description: '',
        category: 'SUV',
        image_url: '',
        video_url: '',
        live_demo_url: '',
        github_url: '',
        tech_stack: [],
        featured: false,
        order: 0
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'SUV',
            image_url: '',
            video_url: '',
            live_demo_url: '',
            github_url: '',
            tech_stack: [],
            featured: false,
            order: 0
        });
        setEditingProject(null);
        setTechInput('');
    };

    const openCreateDialog = () => {
        resetForm();
        setFormData(prev => ({ ...prev, order: projects.length }));
        setIsDialogOpen(true);
    };

    const openEditDialog = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            category: project.category || 'SUV',
            image_url: project.image_url || '',
            video_url: project.video_url || '',
            live_demo_url: project.live_demo_url || '',
            github_url: project.github_url || '',
            tech_stack: project.tech_stack || [],
            featured: project.featured || false,
            order: project.order || 0
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        if (editingProject) {
            await updateProject(editingProject.id, formData);
            toast({ title: 'Success', description: 'Vehicle unit updated.' });
        } else {
            await addProject(formData);
            toast({ title: 'Success', description: 'New vehicle unit added.' });
        }
        await fetchProjects();
        setIsSaving(false);
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = async (id: string) => {
        await deleteProject(id);
        await fetchProjects();
        toast({ title: 'Success', description: 'Vehicle unit removed.'});
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !storage) return;
        
        setUploading(true);
        try {
          const fileExtension = file.name.split('.').pop();
          const fileName = `vehicle-${Date.now()}.${fileExtension}`;
          const storageRef = ref(storage, `uploads/vehicles/${fileName}`);
          
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          
          setFormData(prev => ({ ...prev, image_url: downloadURL }));
          toast({ title: 'Success', description: 'Vehicle photo uploaded.' });
        } catch (err: any) {
          console.error('Upload error:', err);
          toast({ variant: 'destructive', title: 'Error', description: err.message || 'Upload failed.' });
        }
        setUploading(false);
    };
    
    const addTech = () => {
        if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
          setFormData(prev => ({ ...prev, tech_stack: [...prev.tech_stack, techInput.trim()] }));
          setTechInput('');
        }
    };
    
    const removeTech = (techToRemove: string) => {
        setFormData(prev => ({
          ...prev,
          tech_stack: prev.tech_stack.filter(tech => tech !== techToRemove)
        }));
    };

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center h-full gap-4 text-[#0E2356] font-black uppercase tracking-widest text-[10px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#E31B23]" />
          Loading Inventory...
        </div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-12">
                <div>
                    <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase"
                    >
                    Vehicle Catalog
                    </motion.h1>
                    <p className="text-gray-400 font-medium italic">Display your Suzuki units for potential buyers.</p>
                </div>
                <Button 
                    onClick={openCreateDialog}
                    className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 px-8 rounded-2xl shadow-xl shadow-red-100 uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Vehicle Unit
                </Button>
            </div>
            
            {projects.length === 0 ? (
                <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[40px]">
                    <CardContent className="py-24 text-center">
                    <Car className="w-16 h-16 mx-auto text-slate-100 mb-6" />
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-6">Your inventory is empty.</p>
                    <Button onClick={openCreateDialog} variant="outline" className="border-gray-100 text-[#0E2356] font-black uppercase tracking-widest text-xs h-12 rounded-xl">
                        Add Your First Suzuki Unit
                    </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {projects.sort((a, b) => (a.order || 0) - (b.order || 0)).map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden hover:shadow-red-50 transition-all border-2 border-transparent hover:border-red-100">
                        <div className="relative aspect-video overflow-hidden bg-slate-50">
                          {project.image_url ? (
                            <Image src={project.image_url} alt={project.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <Car className="w-12 h-12" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-[#0E2356]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                            <Button
                              size="icon"
                              className="bg-white text-[#0E2356] hover:bg-[#E31B23] hover:text-white rounded-xl shadow-xl"
                              onClick={() => openEditDialog(project)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              className="bg-white text-[#E31B23] hover:bg-red-600 hover:text-white rounded-xl shadow-xl"
                              onClick={() => handleDelete(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
    
                          <Badge className="absolute top-4 left-4 bg-[#0E2356] text-white border-none font-black text-[9px] px-3 py-1.5 rounded-lg tracking-widest">
                            {project.category}
                          </Badge>
    
                          {project.featured && (
                            <Badge className="absolute top-4 right-4 bg-[#E31B23] text-white border-none font-black text-[9px] px-3 py-1.5 rounded-lg tracking-widest">
                              <Star className="w-3 h-3 mr-1 fill-white" />
                              HOT DEAL
                            </Badge>
                          )}
                        </div>
    
                        <CardContent className="p-8">
                          <h3 className="text-xl font-black text-[#0E2356] uppercase tracking-tight mb-2 truncate">{project.title}</h3>
                          <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">{project.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech_stack?.slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-[9px] font-black px-3 py-1 bg-slate-50 rounded-lg text-[#0E2356] border border-gray-100 uppercase tracking-wider">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                            <span className="text-[#E31B23] font-black text-lg tracking-tighter">
                              ₱{(project.order ? project.order * 100000 : 798000).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                                {project.live_demo_url && (
                                    <Badge variant="outline" className="border-green-100 bg-green-50 text-green-600 text-[8px] font-black">FORM LINKED</Badge>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white border-none text-[#0E2356] max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-10">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-[#0E2356]">
                      {editingProject ? 'Edit Vehicle Unit' : 'New Suzuki Listing'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-8 py-6">
                    <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Vehicle Photo</Label>
                    <div className="flex items-start gap-8">
                        <div className="relative w-48 h-32 rounded-3xl overflow-hidden bg-slate-50 border border-gray-100 flex-shrink-0 shadow-inner">
                        {formData.image_url ? (
                            <Image src={formData.image_url} alt="Preview" fill unoptimized className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-100">
                            <Car className="w-8 h-8" />
                            </div>
                        )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="project-image" />
                                <Label htmlFor="project-image">
                                    <Button variant="outline" className="h-12 border-gray-100 font-black text-[10px] tracking-widest uppercase rounded-xl" asChild disabled={uploading}>
                                    <span>
                                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                        Upload Image
                                    </span>
                                    </Button>
                                </Label>
                            </div>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    placeholder="External Image URL (e.g. Unsplash)"
                                    className="h-12 bg-slate-50 border-gray-100 pl-10 rounded-xl font-medium text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle Model</Label>
                        <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Suzuki Jimny 5-Door"
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Body Type</Label>
                        <Select value={formData.category} onValueChange={(v: any) => setFormData(prev => ({ ...prev, category: v }))}>
                        <SelectTrigger className="h-12 bg-slate-50 border-gray-100 rounded-xl font-black text-[10px] uppercase">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-100 text-[#0E2356] font-black text-[10px]">
                            {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marketing Description</Label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the unit's key features, special promos, etc."
                        rows={4}
                        className="bg-slate-50 border-gray-100 rounded-xl resize-none p-4 font-medium text-sm leading-relaxed"
                    />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                          Inquiry Form Link
                          <Info className="w-3 h-3 text-red-400" />
                        </Label>
                        <Input
                        value={formData.live_demo_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, live_demo_url: e.target.value }))}
                        placeholder="Google Form / External Link"
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-medium text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort Order / Price ID</Label>
                        <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-medium"
                        />
                    </div>
                    </div>

                    <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Key Specifications (e.g. 7-Seater, Automatic)</Label>
                    <div className="flex gap-3">
                        <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                        placeholder="Add spec badge..."
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-medium"
                        />
                        <Button type="button" onClick={addTech} variant="outline" className="h-12 border-gray-100 px-6 rounded-xl font-black text-[10px] uppercase">
                        Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {formData.tech_stack.map((tech, i) => (
                        <Badge key={i} className="bg-blue-50 text-[#0E2356] border-none font-black text-[9px] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            {tech}
                            <button onClick={() => removeTech(tech)} className="ml-2 hover:text-[#E31B23]">×</button>
                        </Badge>
                        ))}
                    </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-red-50 rounded-3xl border border-red-100">
                    <Switch
                        checked={formData.featured}
                        onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))}
                        className="data-[state=checked]:bg-[#E31B23]"
                    />
                    <div>
                        <Label className="text-xs font-black text-[#0E2356] uppercase">Hot Deal / Featured Unit</Label>
                        <p className="text-[10px] text-[#E31B23] font-medium">This will show a badge on the unit photo.</p>
                    </div>
                    </div>
                </div>
                <DialogFooter className="pt-6 border-t border-gray-50">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 font-black uppercase tracking-widest text-xs text-gray-400">
                      Cancel
                    </Button>
                    <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 px-12 rounded-2xl shadow-xl shadow-red-100 uppercase tracking-widest text-xs"
                    >
                    {isSaving && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingProject ? 'Update Vehicle' : 'Save Vehicle'}
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
