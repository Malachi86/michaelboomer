'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, Trash2, CheckCircle, XCircle, Quote, Loader2, User, Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTestimonials, updateTestimonial, deleteTestimonial } from '@/app/admin/actions';
import type { Testimonial } from '@/lib/types';
import { format, isValid } from 'date-fns';

export function AdminTestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const data = await getTestimonials();
    setTestimonials(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string, currentStatus: boolean) => {
    await updateTestimonial(id, { approved: !currentStatus });
    toast({ title: 'Success', description: `Testimonial ${!currentStatus ? 'approved' : 'hidden'}.` });
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    await deleteTestimonial(id);
    toast({ title: 'Deleted', description: 'Testimonial removed permanently.' });
    fetchTestimonials();
  };

  const safeFormatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'MMMM dd, yyyy') : 'Recently';
  };

  if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Testimonials Management
        </motion.h1>
        <p className="text-muted-foreground">Manage client reviews and ratings</p>
      </div>

      <div className="grid gap-6">
        {testimonials.length === 0 ? (
          <Card className="bg-card border-border/50 p-20 text-center text-muted-foreground">
            <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
            No testimonials found.
          </Card>
        ) : (
          testimonials.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          }).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`bg-card border-border/50 hover:border-primary/30 transition-all ${!item.approved ? 'opacity-75' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{item.clientName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="w-3 h-3" />
                            {item.company}
                          </div>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < item.rating ? 'text-primary fill-primary' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground italic mb-4 leading-relaxed">
                        "{item.feedback}"
                      </p>
                      <p className="text-xs text-muted-foreground/50">
                        Submitted on {safeFormatDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="flex md:flex-col gap-2 justify-end md:w-32">
                      <Button
                        variant={item.approved ? "outline" : "default"}
                        size="sm"
                        className={item.approved ? "border-amber-500/50 text-amber-500" : "bg-primary text-primary-foreground"}
                        onClick={() => handleApprove(item.id, item.approved)}
                      >
                        {item.approved ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        {item.approved ? 'Hide' : 'Approve'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      {!item.approved && (
                        <Badge variant="outline" className="mt-auto justify-center border-amber-500/30 text-amber-500">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}