'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Plus, Trash2, Edit2, Loader2, Code, Palette, Headphones, Wrench,
  Clock, Calendar, Mail, MessageSquare, Users, CheckCircle, Briefcase, 
  Search, BarChart, MousePointer, Play, Image as ImageIcon, Zap,
  FileCode, Layout, Database, Video, PenTool, Globe, Terminal, Smartphone, Server, Cloud
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/app/admin/actions';
import type { Skill } from '@/lib/types';

const categories = ['Development', 'Design', 'VA Tools', 'Other'];

// Define available icons with their corresponding components
const iconOptions = [
  { id: 'Code', icon: Code },
  { id: 'FileCode', icon: FileCode },
  { id: 'Layout', icon: Layout },
  { id: 'Database', icon: Database },
  { id: 'Video', icon: Video },
  { id: 'PenTool', icon: PenTool },
  { id: 'Globe', icon: Globe },
  { id: 'Terminal', icon: Terminal },
  { id: 'Smartphone', icon: Smartphone },
  { id: 'Server', icon: Server },
  { id: 'Cloud', icon: Cloud },
  { id: 'Palette', icon: Palette },
  { id: 'Headphones', icon: Headphones },
  { id: 'Wrench', icon: Wrench },
  { id: 'Zap', icon: Zap },
  { id: 'Clock', icon: Clock },
  { id: 'Calendar', icon: Calendar },
  { id: 'Mail', icon: Mail },
  { id: 'MessageSquare', icon: MessageSquare },
  { id: 'Users', icon: Users },
  { id: 'CheckCircle', icon: CheckCircle },
  { id: 'Briefcase', icon: Briefcase },
  { id: 'Search', icon: Search },
  { id: 'BarChart', icon: BarChart },
  { id: 'MousePointer', icon: MousePointer },
  { id: 'Play', icon: Play },
  { id: 'Image', icon: ImageIcon }
];

const categoryIcons: Record<string, React.ElementType> = {
  'Development': Code,
  'Design': Palette,
  'VA Tools': Headphones,
  'Other': Wrench
};

export function AdminSkillsPage() {
    const { toast } = useToast();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
        name: '',
        category: 'Development',
        icon: 'Code',
        proficiency: 80,
        order: 0
    });

    const fetchSkills = async () => {
        setIsLoading(true);
        const fetchedSkills = await getSkills();
        setSkills(fetchedSkills || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSkills();
    }, []);
  
    const resetForm = () => {
      setFormData({ name: '', category: 'Development', icon: 'Code', proficiency: 80, order: 0 });
      setEditingSkill(null);
    };
  
    const openCreateDialog = () => {
      resetForm();
      setFormData(prev => ({ ...prev, order: skills.length }));
      setIsDialogOpen(true);
    };
  
    const openEditDialog = (skill: Skill) => {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        icon: skill.icon || 'Code',
        proficiency: skill.proficiency || 80,
        order: skill.order || 0
      });
      setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteSkill(id);
        if (result.success) {
          await fetchSkills();
          toast({ title: 'Success', description: 'Skill deleted.'});
        }
    }
  
    const handleSave = async () => {
      setIsSaving(true);
      let result;
      if (editingSkill) {
        result = await updateSkill(editingSkill.id, formData);
      } else {
        result = await addSkill(formData);
      }
      
      if (result.success) {
        await fetchSkills();
        setIsDialogOpen(false);
        resetForm();
        toast({ title: 'Success', description: `Skill ${editingSkill ? 'updated' : 'added'}.`});
      }
      setIsSaving(false);
    };
  
    const groupedSkills = categories.map(cat => ({
      name: cat,
      skills: (skills || []).filter(s => s.category === cat).sort((a, b) => (a.order || 0) - (b.order || 0))
    }));

    if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading skills...</p>
          </div>
        );
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
              Skills Management
            </motion.h1>
            <p className="text-muted-foreground">Add, edit, and organize your skills</p>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
  
        <div className="space-y-8">
          {groupedSkills.map((category, catIndex) => {
            const CategoryIcon = categoryIcons[category.name] || Code;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <Card className="bg-card border-border/50 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                      {category.name}
                      <span className="text-sm font-normal text-muted-foreground">({category.skills.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {category.skills.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No skills in this category</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence>
                          {category.skills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="group relative bg-muted/30 border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-medium">{skill.name}</h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => openEditDialog(skill)}><Edit2 className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(skill.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </div>
                              {skill.proficiency && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Proficiency</span>
                                    <span className="text-primary">{skill.proficiency}%</span>
                                  </div>
                                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${skill.proficiency}%` }}/>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
  
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-border/50 text-white">
            <DialogHeader><DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Skill Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-muted border-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v: any) => setFormData(prev => ({ ...prev, category: v }))}>
                    <SelectTrigger className="bg-muted border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border/50 text-white">{categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData(prev => ({ ...prev, icon: v }))}>
                    <SelectTrigger className="bg-muted border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 text-white max-h-[300px]">
                      {iconOptions.map(({ id, icon: IconComponent }) => (
                        <SelectItem key={id} value={id}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary" />
                            <span>{id}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Proficiency ({formData.proficiency}%)</Label>
                <Slider value={[formData.proficiency]} onValueChange={(v) => setFormData(prev => ({ ...prev, proficiency: v[0] }))} max={100} step={5} className="py-4" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border/50">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingSkill ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }