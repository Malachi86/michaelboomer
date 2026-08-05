'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Loader2, Upload, RotateCw, Award, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCertificates, addCertificate, updateCertificate, deleteCertificate } from '@/app/admin/actions';
import { useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Certificate } from '@/lib/types';

export function AdminCertificatesPage() {
    const { toast } = useToast();
    const storage = useStorage();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Omit<Certificate, 'id'>>({
        title: '',
        issuer: '',
        issueDate: '',
        imageUrl: '',
        credentialUrl: '',
        order: 0,
        rotation: 0
    });

    const fetchCertificates = async () => {
        setIsLoading(true);
        const data = await getCertificates();
        setCertificates(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '',
            issuer: '',
            issueDate: '',
            imageUrl: '',
            credentialUrl: '',
            order: certificates.length,
            rotation: 0
        });
        setEditingCert(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (cert: Certificate) => {
        setEditingCert(cert);
        setFormData({
            title: cert.title || '',
            issuer: cert.issuer || '',
            issueDate: cert.issueDate || '',
            imageUrl: cert.imageUrl || '',
            credentialUrl: cert.credentialUrl || '',
            order: cert.order || 0,
            rotation: cert.rotation || 0
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        if (editingCert) {
            await updateCertificate(editingCert.id, formData);
            toast({ title: 'Success', description: 'Certificate updated.' });
        } else {
            await addCertificate(formData);
            toast({ title: 'Success', description: 'Certificate added.' });
        }
        await fetchCertificates();
        setIsSaving(false);
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        await deleteCertificate(id);
        await fetchCertificates();
        toast({ title: 'Success', description: 'Certificate deleted.'});
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !storage) return;
        
        setUploading(true);
        try {
          const fileExtension = file.name.split('.').pop();
          const fileName = `cert-${Date.now()}.${fileExtension}`;
          const storageRef = ref(storage, `uploads/certificates/${fileName}`);
          
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          
          setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
          toast({ title: 'Success', description: 'Image uploaded to cloud storage.' });
        } catch (err: any) {
          console.error('Upload error:', err);
          toast({ variant: 'destructive', title: 'Error', description: err.message || 'Upload failed.' });
        }
        setUploading(false);
    };

    const rotateImage = () => {
        setFormData(prev => ({
            ...prev,
            rotation: ((prev.rotation || 0) + 90) % 360
        }));
    };

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
                    Certificates
                    </motion.h1>
                    <p className="text-muted-foreground">Manage your professional credentials</p>
                </div>
                <Button 
                    onClick={openCreateDialog}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certificate
                </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {certificates.sort((a, b) => a.order - b.order).map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-card border-border/50 overflow-hidden group">
                        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                          {cert.imageUrl ? (
                            <div className="w-full h-full relative" style={{ transform: `rotate(${cert.rotation || 0}deg)` }}>
                                <Image src={cert.imageUrl} alt={cert.title} fill unoptimized className="object-contain" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                              <Award className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <Button size="icon" variant="outline" onClick={() => openEditDialog(cert)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleDelete(cert.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-white font-bold truncate">{cert.title}</h3>
                          <p className="text-primary text-sm font-medium">{cert.issuer}</p>
                          <p className="text-muted-foreground text-xs mt-1">{cert.issueDate}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card border-border/50 text-white max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingCert ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <Label>Certificate Image</Label>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
                                    {formData.imageUrl && (
                                        <div className="w-full h-full relative transition-transform duration-300" style={{ transform: `rotate(${formData.rotation || 0}deg)` }}>
                                            <Image src={formData.imageUrl} alt="Preview" fill unoptimized className="object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cert-image" />
                                    <Label htmlFor="cert-image">
                                        <Button variant="outline" size="sm" asChild disabled={uploading} className="w-full">
                                            <span>{uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Upload</span>
                                        </Button>
                                    </Label>
                                    {formData.imageUrl && (
                                        <Button variant="secondary" size="sm" onClick={rotateImage} className="w-full">
                                            <RotateCw className="w-4 h-4 mr-2" /> Rotate
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Or provide Image URL</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                        value={formData.imageUrl} 
                                        onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                                        placeholder="https://..." 
                                        className="bg-muted border-border/50 pl-10" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Certification Name" className="bg-muted border-border/50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Issuer</Label>
                        <Input value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} placeholder="Organization / Platform" className="bg-muted border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Issue Date</Label>
                            <Input value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} placeholder="Month Year" className="bg-muted border-border/50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="bg-muted border-border/50" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Credential Link (Optional)</Label>
                        <Input value={formData.credentialUrl} onChange={e => setFormData({...formData, credentialUrl: e.target.value})} placeholder="https://..." className="bg-muted border-border/50" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground">
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {editingCert ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
