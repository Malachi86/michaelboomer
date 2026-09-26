'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Loader2, Upload, RotateCw, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCertificates, addCertificate, updateCertificate, deleteCertificate } from '@/app/admin/actions';
import type { Certificate } from '@/lib/types';

export default function AdminCertificatesPage() {
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<Omit<Certificate, 'id'>>({
        title: '', issuer: '', issueDate: '', imageUrl: '', credentialUrl: '', order: 0, rotation: 0
    });

    const fetchCertificates = async () => {
        setIsLoading(true);
        const data = await getCertificates();
        setCertificates(data || []);
        setIsLoading(false);
    };

    useEffect(() => { fetchCertificates(); }, []);

    const resetForm = () => {
        setFormData({ title: '', issuer: '', issueDate: '', imageUrl: '', credentialUrl: '', order: certificates.length, rotation: 0 });
        setEditingCert(null);
    };

    const openCreateDialog = () => { resetForm(); setIsDialogOpen(true); };

    const openEditDialog = (cert: Certificate) => {
        setEditingCert(cert);
        setFormData({
            title: cert.title || '', issuer: cert.issuer || '', issueDate: cert.issueDate || '',
            imageUrl: cert.imageUrl || '', credentialUrl: cert.credentialUrl || '',
            order: cert.order || 0, rotation: cert.rotation || 0
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (editingCert) { await updateCertificate(editingCert.id, formData); toast({ title: 'Success', description: 'Record updated.' }); }
            else { await addCertificate(formData); toast({ title: 'Success', description: 'Record added.' }); }
            await fetchCertificates();
            setIsDialogOpen(false);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this record?')) { await deleteCertificate(id); await fetchCertificates(); toast({ title: 'Success', description: 'Deleted.'}); }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const limit = 1024 * 1024; // 1MB limit for Base64 stability
        if (file.size > limit) {
          toast({ variant: "destructive", title: "File too large ⚠️", description: "Please use a file under 1MB for database stability." });
          e.target.value = ''; return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
          setIsUploading(false);
          toast({ title: "Image Ready! 📂" });
        };
        reader.onerror = () => {
          setIsUploading(false);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to process image.' });
        };
        reader.readAsDataURL(file);
    };

    const rotateImage = () => { setFormData(prev => ({ ...prev, rotation: ((prev.rotation || 0) + 90) % 360 })); };

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
          <p className="text-[#0E2356] text-sm font-bold uppercase tracking-widest">Loading Records...</p>
        </div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-12">
                <div>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase">Happy Clients</motion.h1>
                    <p className="text-gray-400 font-medium italic">Showcase your successful turnovers.</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-[#E31B23] text-white font-black h-14 px-8 rounded-2xl shadow-xl uppercase tracking-widest text-xs">
                    <Plus className="w-5 h-5 mr-2" /> Add New Record
                </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {certificates.sort((a, b) => (a.order || 0) - (b.order || 0)).map((cert, index) => (
                    <motion.div key={cert.id} layout transition={{ delay: index * 0.1 }}>
                      <Card className="bg-white border-none shadow-xl overflow-hidden rounded-[32px] group">
                        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                          {cert.imageUrl ? (
                            <div className="w-full h-full relative" style={{ transform: `rotate(${cert.rotation || 0}deg)` }}>
                                <img src={cert.imageUrl} alt={cert.title} className="object-contain w-full h-full p-4" />
                            </div>
                          ) : ( <div className="w-full h-full flex items-center justify-center text-slate-200"><Award className="w-12 h-12" /></div> )}
                          <div className="absolute inset-0 bg-[#0E2356]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <Button size="icon" className="bg-white text-[#0E2356] rounded-xl shadow-xl" onClick={() => openEditDialog(cert)}><Edit2 className="w-4 h-4" /></Button>
                            <Button size="icon" className="bg-white text-red-600 rounded-xl shadow-xl" onClick={() => handleDelete(cert.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-[#0E2356] font-black uppercase text-sm mb-1 truncate">{cert.title}</h3>
                          <p className="text-[#E31B23] text-[10px] font-black uppercase tracking-widest">{cert.issuer}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white border-none text-[#0E2356] max-w-md rounded-[40px] shadow-2xl p-10">
                <DialogHeader><DialogTitle className="text-2xl font-black uppercase tracking-tighter text-[#0E2356]">{editingCert ? 'Edit Record' : 'Add New Record'}</DialogTitle></DialogHeader>
                <div className="space-y-6 py-6">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Record Image (LIMIT 1MB)</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-gray-100 flex-shrink-0 group cursor-pointer" onClick={() => document.getElementById('cert-image')?.click()}>
                                {formData.imageUrl ? ( <div className="w-full h-full relative" style={{ transform: `rotate(${formData.rotation || 0}deg)` }}><img src={formData.imageUrl} alt="Preview" className="object-contain w-full h-full p-2" /></div> ) : ( <div className="w-full h-full flex items-center justify-center text-slate-100"><Award className="w-8 h-8" /></div> )}
                                {isUploading && ( <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" /></div> )}
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cert-image" />
                                <Label htmlFor="cert-image"><Button variant="outline" size="sm" asChild disabled={isUploading} className="w-full h-12 border-gray-100 font-black text-[10px] tracking-widest uppercase rounded-xl"><span>{isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Select Photo</span></Button></Label>
                                {formData.imageUrl && ( <Button variant="secondary" size="sm" onClick={rotateImage} className="w-full h-12 bg-[#0E2356] text-white font-black text-[10px] tracking-widest uppercase rounded-xl"><RotateCw className="w-4 h-4 mr-2" /> Rotate</Button> )}
                            </div>
                        </div>
                        <Input value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Or provide Image URL..." className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" />
                    </div>
                    <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title / Award Name</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Sales Executive of the Month" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date Issued</Label><Input value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} placeholder="Feb 2026" className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sort Order</Label><Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="h-12 bg-slate-50 border-gray-100 rounded-xl font-bold text-[#0E2356]" /></div>
                    </div>
                </div>
                <DialogFooter className="pt-4">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 font-black uppercase tracking-widest text-[10px] text-gray-400">Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving || isUploading} className="bg-[#E31B23] text-white font-black h-12 px-8 rounded-xl shadow-xl uppercase tracking-widest text-[10px]">{isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {editingCert ? 'Update' : 'Create'}</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
