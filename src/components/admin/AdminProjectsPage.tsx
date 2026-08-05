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
import { Plus, Trash2, Edit2, Loader2, Upload, ExternalLink, Github, Play, Star, FolderKanban, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProjects, addProject, updateProject, deleteProject } from '@/app/admin/actions';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from '@/lib/types';


const categories = ['Web App', 'Mobile App', 'E-commerce', 'VA Project', 'Other'];

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
        category: 'Web App',
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
            category: 'Web App',
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
            category: project.category || 'Web App',
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
            toast({ title: 'Success', description: 'Project updated.' });
        } else {
            await addProject(formData);
            toast({ title: 'Success', description: 'Project added.' });
        }
        await fetchProjects();
        setIsSaving(false);
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = async (id: string) => {
        await deleteProject(id);
        await fetchProjects();
        toast({ title: 'Success', description: 'Project deleted.'});
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !storage) return;
        
        setUploading(true);
        try {
          const fileExtension = file.name.split('.').pop();
          const fileName = `project-${Date.now()}.${fileExtension}`;
          const storageRef = ref(storage, `uploads/projects/${fileName}`);
          
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          
          setFormData(prev => ({ ...prev, image_url: downloadURL }));
          toast({ title: 'Success', description: 'Image uploaded to cloud storage.' });
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
    
    const sortedProjects = [...projects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                    >
                    Projects Management
                    </motion.h1>
                    <p className="text-muted-foreground">Showcase your work with rich media</p>
                </div>
                <Button 
                    onClick={openCreateDialog}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            </div>
            
            {projects.length === 0 ? (
                <Card className="bg-card border-border/50">
                    <CardContent className="py-20 text-center">
                    <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Button onClick={openCreateDialog} variant="outline" className="border-border/50">
                        Add Your First Project
                    </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {sortedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <Card className="bg-card border-border/50 overflow-hidden hover:border-accent/30 transition-all">
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {project.image_url ? (
                            <Image src={project.image_url} alt={project.title} fill unoptimized className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                              <FolderKanban className="w-12 h-12" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <Button
                              size="icon"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                              onClick={() => openEditDialog(project)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="border-destructive/50 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
    
                          {project.featured && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-accent border-0 text-primary-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
    
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-white font-bold">{project.title}</h3>
                              <Badge variant="outline" className="border-accent/30 text-accent text-xs mt-1">
                                {project.category}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              {project.live_demo_url && (
                                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                              {project.github_url && (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
                                    <Github className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                              {project.video_url && (
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.tech_stack?.slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                                {tech}
                              </span>
                            ))}
                            {project.tech_stack?.length > 3 && (
                              <span className="text-xs text-muted-foreground/50">+{project.tech_stack.length - 3}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card border-border/50 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                    <Label>Project Image</Label>
                    <div className="flex items-start gap-6">
                        <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
                        {formData.image_url ? (
                            <Image src={formData.image_url} alt="Preview" fill unoptimized className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                            <FolderKanban className="w-6 h-6" />
                            </div>
                        )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="project-image" />
                                <Label htmlFor="project-image">
                                    <Button variant="outline" className="border-border/50" asChild disabled={uploading}>
                                    <span>
                                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                        Upload Image
                                    </span>
                                    </Button>
                                </Label>
                                <span className="text-muted-foreground text-xs">or paste a link below</span>
                            </div>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    placeholder="https://images.unsplash.com/..."
                                    className="bg-muted border-border/50 pl-10 h-10"
                                />
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Project name"
                        className="bg-muted border-border/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(v: any) => setFormData(prev => ({ ...prev, category: v }))}>
                        <SelectTrigger className="bg-muted border-border/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/50 text-white">
                            {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your project..."
                        rows={3}
                        className="bg-muted border-border/50 resize-none"
                    />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Live Demo URL</Label>
                        <Input
                        value={formData.live_demo_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, live_demo_url: e.target.value }))}
                        placeholder="https://..."
                        className="bg-muted border-border/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>GitHub URL</Label>
                        <Input
                        value={formData.github_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                        placeholder="https://github.com/..."
                        className="bg-muted border-border/50"
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label>Video URL (YouTube/Vimeo embed)</Label>
                    <Input
                        value={formData.video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        placeholder="https://youtube.com/embed/..."
                        className="bg-muted border-border/50"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    <div className="flex gap-2">
                        <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                        placeholder="Add technology..."
                        className="bg-muted border-border/50"
                        />
                        <Button type="button" onClick={addTech} variant="outline" className="border-border/50">
                        Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tech_stack.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="bg-muted border-white/5 text-muted-foreground">
                            {tech}
                            <button onClick={() => removeTech(tech)} className="ml-2 hover:text-destructive">×</button>
                        </Badge>
                        ))}
                    </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                    <Switch
                        checked={formData.featured}
                        onCheckedChange={(v) => setFormData(prev => ({ ...prev, featured: v }))}
                    />
                    <Label>Featured Project</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border/50">
                    Cancel
                    </Button>
                    <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                    {isSaving && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingProject ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
