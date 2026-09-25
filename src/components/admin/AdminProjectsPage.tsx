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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Loader2, Upload, Star, Car, Link as LinkIcon, Info, X, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProjects, addProject, updateProject, deleteProject } from '@/app/admin/actions';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from '@/lib/types';
import imageCompression from 'browser-image-compression';

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
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [galleryInput, setGalleryInput] = useState('');

    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        title: '',
        description: '',
        category: 'SUV',
        image_url: '',
        additional_images: [],
        video_url: '',
        live_demo_url: '',
        github_url: '',
        tech_stack: [],
        featured: false,
        order: 0,
        price: 0
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
            additional_images: [],
            video_url: '',
            live_demo_url: '',
            github_url: '',
            tech_stack: [],
            featured: false,
            order: 0,
            price: 0
        });
        setEditingProject(null);
        setTechInput('');
        setUploadPreview(null);
        setGalleryInput('');
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
            additional_images: project.additional_images || [],
            video_url: project.video_url || '',
            live_demo_url: project.live_demo_url || '',
            github_url: project.github_url || '',
            tech_stack: project.tech_stack || [],
            featured: project.featured || false,
            order: project.order || 0,
            price: project.price || 0
        });
        setUploadPreview(null);
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
        if (confirm('Remove this vehicle unit permanently?')) {
          await deleteProject(id);
          await fetchProjects();
          toast({ title: 'Success', description: 'Vehicle unit removed.'});
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'additional_images') => {
        const files = e.target.files;
        if (!files || files.length === 0 || !storage) return;
        
        setUploading(true);
        
        try {
          const compressionOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true
          };

          if (field === 'image_url') {
            const file = files[0];
            setUploadPreview(URL.createObjectURL(file));
            const compressedFile = await imageCompression(file, compressionOptions);
            const fileName = `main-${Date.now()}-${file.name}`;
            const storageRef = ref(storage, `uploads/vehicles/${fileName}`);
            await uploadBytes(storageRef, compressedFile);
            const downloadURL = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, image_url: downloadURL }));
          } else {
            // Multi-upload for gallery
            const newUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const compressedFile = await imageCompression(file, compressionOptions);
              const fileName = `gallery-${Date.now()}-${file.name}`;
              const storageRef = ref(storage, `uploads/vehicles/gallery/${fileName}`);
              await uploadBytes(storageRef, compressedFile);
              const downloadURL = await getDownloadURL(storageRef);
              newUrls.push(downloadURL);
            }
            setFormData(prev => ({ ...prev, additional_images: [...(prev.additional_images || []), ...newUrls] }));
          }
          toast({ title: 'Success', description: `${files.length} photo(s) uploaded successfully.` });
        } catch (err: any) {
          console.error('Upload error:', err);
          toast({ variant: 'destructive', title: 'Error', description: err.message || 'Upload failed.' });
        } finally {
          setUploading(false);
        }
    };

    const addGalleryLink = () => {
        if (galleryInput.trim() && !formData.additional_images?.includes(galleryInput.trim())) {
            setFormData(prev => ({ ...prev, additional_images: [...(prev.additional_images || []), galleryInput.trim()] }));
            setGalleryInput('');
        }
    };

    const removeGalleryImage = (urlToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            additional_images: prev.additional_images?.filter(url => url !== urlToRemove)
        }));
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
        return <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
          <p className="text-[#0E2356] text-sm font-bold uppercase tracking-widest">Loading Inventory...</p>
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
                            <Button size="icon" className="bg-white text-[#0E2356] hover:bg-[#E31B23] hover:text-white rounded-xl shadow-xl" onClick={() => openEditDialog(project)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" className="bg-white text-[#E31B23] hover:bg-red-600 hover:text-white rounded-xl shadow-xl" onClick={() => handleDelete(project.id)}>
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
                          <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">🚗 {project.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech_stack?.slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-[9px] font-black px-3 py-1 bg-slate-50 rounded-lg text-[#0E2356] border border-gray-100 uppercase tracking-wider">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PRICE STARTS</span>
                              <span className="text-[#E31B23] font-black text-lg tracking-tighter">
                                ₱{(project.price || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white border-none text-[#0E2356] max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-10">
                <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-[#0E2356]">
                      {editingProject ? 'EDIT VEHICLE UNIT' : 'NEW SUZUKI LISTING'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">Ilagay ang mga detalye ng Suzuki unit para sa iyong catalog.</DialogDescription>
                </DialogHeader>
                <div className="space-y-8">
                    <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">MAIN VEHICLE PHOTO</Label>
                    <div className="flex items-start gap-8">
                        <div className="relative w-56 h-36 rounded-3xl overflow-hidden bg-slate-50 border border-gray-100 flex-shrink-0 shadow-inner">
                        {(uploadPreview || formData.image_url) ? (
                            <Image src={uploadPreview || formData.image_url!} alt="Preview" fill unoptimized className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-100">
                            <Car className="w-8 h-8" />
                            </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                            <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
                          </div>
                        )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} className="hidden" id="project-image" />
                                <Label htmlFor="project-image">
                                    <Button variant="outline" className="h-12 border-gray-100 font-black text-[10px] tracking-widest uppercase rounded-xl" asChild disabled={uploading}>
                                    <span>
                                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                        UPLOAD IMAGE
                                    </span>
                                    </Button>
                                </Label>
                            </div>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    placeholder="External Image URL"
                                    className="h-12 bg-slate-50 border-gray-100 pl-10 rounded-xl font-bold text-[#0E2356] focus:border-[#E31B23]"
                                />
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">GALLERY PHOTOS (MULTI-UPLOAD)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  multiple 
                                  onChange={(e) => handleImageUpload(e, 'additional_images')} 
                                  className="hidden" 
                                  id="gallery-upload" 
                                />
                                <Label htmlFor="gallery-upload">
                                    <Button variant="outline" className="w-full h-12 border-gray-100 font-black text-[10px] tracking-widest uppercase rounded-xl" asChild disabled={uploading}>
                                        <span><Plus className="w-4 h-4 mr-2" /> UPLOAD PHOTOS</span>
                                    </Button>
                                </Label>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={galleryInput}
                                    onChange={(e) => setGalleryInput(e.target.value)}
                                    placeholder="Or paste Link..."
                                    className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                                />
                                <Button onClick={addGalleryLink} variant="secondary" className="h-12 bg-[#0E2356] text-white rounded-xl px-4">ADD</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {formData.additional_images?.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                                    <Image src={url} alt="Gallery" fill unoptimized className="object-cover" />
                                    <button 
                                        onClick={() => removeGalleryImage(url)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vehicle Model</Label>
                        <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. S-PRESSO"
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Body Type</Label>
                        <Select value={formData.category} onValueChange={(v: any) => setFormData(prev => ({ ...prev, category: v }))}>
                        <SelectTrigger className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356] uppercase">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-100 text-[#0E2356] font-bold">
                            {categories.map(cat => (
                            <SelectItem key={cat} value={cat} className="uppercase">{cat}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Marketing Description</Label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the unit's key features..."
                        rows={6}
                        className="bg-slate-50 border-gray-100 rounded-xl resize-none p-5 font-bold text-[#0E2356] leading-relaxed"
                    />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                          Inquiry Form Link
                          <Info className="w-3 h-3 text-red-400" />
                        </Label>
                        <Input
                        value={formData.live_demo_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, live_demo_url: e.target.value }))}
                        placeholder="Google Form / External Link"
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Video Presentation (YouTube)</Label>
                        <div className="relative">
                            <Play className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                            <Input
                            value={formData.video_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                            placeholder="https://youtube.com/..."
                            className="h-12 bg-slate-50 border-gray-100 pl-10 rounded-xl font-bold text-[#0E2356]"
                            />
                        </div>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (SRP)</Label>
                        <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="798000"
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                        />
                    </div>
                    <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sort Order</Label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-5 bg-red-50 rounded-3xl border border-red-100 h-16">
                            <Switch
                                checked={formData.featured}
                                onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))}
                                className="data-[state=checked]:bg-[#E31B23]"
                            />
                            <div>
                                <Label className="text-[10px] font-black text-[#0E2356] uppercase tracking-widest">Featured Unit</Label>
                                <p className="text-[8px] text-[#E31B23] font-black uppercase">HOT DEAL Badge</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Key Specifications</Label>
                    <div className="flex gap-3">
                        <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                        placeholder="Add spec (e.g. 7-Seater)..."
                        className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]"
                        />
                        <Button type="button" onClick={addTech} variant="outline" className="h-12 border-gray-100 px-6 rounded-xl font-black text-[10px] uppercase">
                        Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {formData.tech_stack.map((tech, i) => (
                        <Badge key={i} className="bg-[#0E2356] text-white border-none font-black text-[9px] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            {tech}
                            <button onClick={() => removeTech(tech)} className="ml-2 hover:text-[#E31B23]">×</button>
                        </Badge>
                        ))}
                    </div>
                    </div>
                </div>
                <DialogFooter className="pt-8 border-t border-gray-50 mt-4">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 font-black uppercase tracking-widest text-xs text-gray-400">
                      Cancel
                    </Button>
                    <Button 
                    onClick={handleSave}
                    disabled={isSaving || uploading}
                    className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 px-12 rounded-2xl shadow-xl shadow-red-100 uppercase tracking-widest text-xs"
                    >
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingProject ? 'Update Vehicle' : 'Save Vehicle'}
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
