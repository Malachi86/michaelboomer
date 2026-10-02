
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Plus, Trash2, Edit2, Loader2, Upload, Star, Car, X, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProjects, addProject, updateProject, deleteProject } from '@/app/admin/actions';
import type { Project } from '@/lib/types';

const categories = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV', 'VAN', 'PICKUP'];

export default function AdminProjectsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [galleryInput, setGalleryInput] = useState('');
    const [techInput, setTechInput] = useState('');

    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        title: '',
        description: '',
        category: 'SUV',
        image_url: '',
        additional_images: [],
        tech_stack: [],
        featured: false,
        order: 0,
        price: 0,
        video_url: '',
        live_demo_url: '',
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '', description: '', category: 'SUV', image_url: '',
            additional_images: [], tech_stack: [], featured: false, 
            order: projects.length, price: 0, video_url: '', live_demo_url: ''
        });
        setEditingProject(null); setGalleryInput(''); setTechInput('');
    };

    const openCreateDialog = () => { resetForm(); setIsDialogOpen(true); };

    const openEditDialog = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '', description: project.description || '',
            category: project.category || 'SUV', image_url: project.image_url || '',
            additional_images: project.additional_images || [],
            tech_stack: project.tech_stack || [], featured: project.featured || false,
            order: project.order || 0, price: project.price || 0,
            video_url: project.video_url || '', live_demo_url: project.live_demo_url || ''
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData);
                toast({ title: 'Success', description: 'Vehicle unit updated.' });
            } else {
                await addProject(formData);
                toast({ title: 'Success', description: 'New vehicle unit added.' });
            }
            await fetchProjects();
            setIsDialogOpen(false);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save changes.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Remove this vehicle unit permanently?')) {
          await deleteProject(id);
          await fetchProjects();
          toast({ title: 'Success', description: 'Vehicle unit removed.'});
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'additional_images') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const limit = 1024 * 1024; // 1MB limit for Base64 stability
        setIsUploading(true);
        
        const processFile = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                if (file.size > limit) {
                    toast({ variant: "destructive", title: "File too large ⚠️", description: `${file.name} is over 1MB.` });
                    reject('Too large');
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        };

        if (field === 'image_url') {
            processFile(files[0]).then(base64 => {
                setFormData(prev => ({ ...prev, image_url: base64 }));
                setIsUploading(false);
                toast({ title: "Photo Ready! 📂" });
            }).catch(() => setIsUploading(false));
        } else {
            const promises = Array.from(files).map(f => processFile(f));
            Promise.all(promises).then(base64s => {
                setFormData(prev => ({ ...prev, additional_images: [...(prev.additional_images || []), ...base64s] }));
                setIsUploading(false);
                toast({ title: `${base64s.length} photos ready for gallery! 🎬` });
            }).catch(() => setIsUploading(false));
        }
    };

    const removeGalleryImage = (urlToRemove: string) => {
        setFormData(prev => ({ ...prev, additional_images: prev.additional_images?.filter(url => url !== urlToRemove) }));
    };

    const addTech = () => {
        if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
          setFormData(prev => ({ ...prev, tech_stack: [...formData.tech_stack, techInput.trim()] }));
          setTechInput('');
        }
    };
    
    const removeTech = (techToRemove: string) => {
        setFormData(prev => ({ ...prev, tech_stack: prev.tech_stack.filter(tech => tech !== techToRemove) }));
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
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase">Vehicle Catalog</motion.h1>
                    <p className="text-gray-400 font-medium italic">Display your Suzuki units for potential buyers.</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 px-8 rounded-2xl shadow-xl uppercase tracking-widest text-xs">
                    <Plus className="w-5 h-5 mr-2" /> Add Vehicle Unit
                </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {projects.sort((a, b) => (a.order || 0) - (b.order || 0)).map((project, index) => (
                    <motion.div key={project.id} layout transition={{ delay: index * 0.05 }} className="group">
                      <Card className="bg-white border-none shadow-xl rounded-[32px] overflow-hidden hover:shadow-red-50 transition-all border-2 border-transparent hover:border-red-100">
                        <div className="relative aspect-video overflow-hidden bg-slate-50">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                          ) : ( <div className="w-full h-full flex items-center justify-center text-slate-200"><Car className="w-12 h-12" /></div> )}
                          <div className="absolute inset-0 bg-[#0E2356]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                            <Button size="icon" className="bg-white text-[#0E2356] rounded-xl shadow-xl" onClick={() => openEditDialog(project)}><Edit2 className="w-4 h-4" /></Button>
                            <Button size="icon" className="bg-white text-[#E31B23] rounded-xl shadow-xl" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                          <Badge className="absolute top-4 left-4 bg-[#0E2356] text-white border-none font-black text-[9px] px-3 py-1.5 rounded-lg tracking-widest">{project.category}</Badge>
                          {project.featured && ( <Badge className="absolute top-4 right-4 bg-[#E31B23] text-white border-none font-black text-[9px] px-3 py-1.5 rounded-lg tracking-widest"><Star className="w-3.5 h-3.5 mr-1 fill-white" /> HOT DEAL</Badge> )}
                        </div>
                        <CardContent className="p-8">
                          <h3 className="text-xl font-black text-[#0E2356] uppercase tracking-tight mb-2 truncate">{project.title}</h3>
                          <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">🚗 {project.description}</p>
                          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PRICE STARTS</span>
                              <span className="text-[#E31B23] font-black text-lg tracking-tighter">₱{(project.price || 0).toLocaleString()}</span>
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
                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-[#0E2356]">{editingProject ? 'EDIT VEHICLE UNIT' : 'NEW SUZUKI LISTING'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">MAIN PHOTO (LIMIT 1MB)</Label>
                    <div className="flex items-start gap-8">
                        <div 
                          className="relative w-56 h-36 rounded-3xl overflow-hidden bg-slate-50 border border-gray-100 flex-shrink-0 shadow-inner group cursor-pointer"
                          onClick={() => document.getElementById('project-image')?.click()}
                        >
                        {formData.image_url ? ( <img src={formData.image_url} alt="Preview" className="object-cover w-full h-full" /> ) : ( <div className="w-full h-full flex items-center justify-center text-slate-100"><Car className="w-8 h-8" /></div> )}
                        {isUploading && ( <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" /></div> )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} className="hidden" id="project-image" />
                            <Label htmlFor="project-image">
                                <Button variant="outline" className="h-12 border-gray-100 font-black text-[10px] tracking-widest uppercase rounded-xl w-full" asChild disabled={isUploading}>
                                  <span>{isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />} SELECT PHOTO</span>
                                </Button>
                            </Label>
                            <Input value={formData.image_url} onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="External Image URL" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                        </div>
                    </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">GALLERY PHOTOS (UP TO 1MB EACH)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'additional_images')} className="hidden" id="gallery-upload" />
                            <Label htmlFor="gallery-upload"><Button variant="outline" className="w-full h-12 border-gray-100 font-black text-[10px] tracking-widest uppercase rounded-xl" asChild disabled={isUploading}><span><Plus className="w-4 h-4 mr-2" /> UPLOAD TO GALLERY</span></Button></Label>
                            <div className="flex gap-2">
                                <Input value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="Paste Link..." className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                                <Button onClick={() => { if(galleryInput) setFormData(p => ({...p, additional_images: [...(p.additional_images||[]), galleryInput]})); setGalleryInput(''); }} variant="secondary" className="h-12 bg-[#0E2356] text-white rounded-xl px-4">ADD</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {formData.additional_images?.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                                    <img src={url} alt="Gallery" className="object-cover w-full h-full" />
                                    <button onClick={() => removeGalleryImage(url)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vehicle Model</Label>
                            <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. S-PRESSO" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Body Type</Label>
                            <Select value={formData.category} onValueChange={(v: any) => setFormData(prev => ({ ...prev, category: v }))}>
                            <SelectTrigger className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356] uppercase"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-white text-[#0E2356] font-bold">{categories.map(cat => ( <SelectItem key={cat} value={cat}>{cat}</SelectItem> ))}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (SRP)</Label>
                        <Input type="number" value={formData.price || 0} onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Video Presentation URL (YouTube)</Label>
                        <Input value={formData.video_url} onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vehicle Description</Label>
                        <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={4} placeholder="🚗 Ang Suzuki S-PRESSO ay..." className="bg-slate-50 border-gray-100 rounded-2xl p-4 font-bold text-[#0E2356]" />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Key Specifications</Label>
                        <div className="flex gap-2">
                            <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="e.g. Fuel Efficient" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                            <Button onClick={addTech} variant="secondary" className="h-12 bg-[#0E2356] text-white rounded-xl px-6">ADD</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tech_stack.map((tech, i) => (
                                <Badge key={i} className="bg-slate-100 text-[#0E2356] hover:bg-red-50 hover:text-red-600 transition-colors border-none py-1.5 px-3 rounded-lg flex items-center gap-2 group cursor-pointer" onClick={() => removeTech(tech)}>
                                    {tech} <X className="w-3 h-3" />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-red-50 rounded-3xl border border-red-100 h-16">
                        <Switch checked={formData.featured} onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))} className="data-[state=checked]:bg-[#E31B23]" />
                        <div>
                            <Label className="text-[10px] font-black text-[#0E2356] uppercase tracking-widest">Featured Unit</Label>
                            <p className="text-[8px] text-[#E31B23] font-black uppercase">HOT DEAL Badge</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="pt-8 border-t border-gray-50 mt-4">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 font-black uppercase tracking-widest text-xs text-gray-400">Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving || isUploading} className="bg-[#E31B23] hover:bg-[#c4171e] text-white font-black h-14 px-12 rounded-2xl shadow-xl uppercase tracking-widest text-xs">
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {editingProject ? 'Update Vehicle' : 'Save Vehicle'}
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
