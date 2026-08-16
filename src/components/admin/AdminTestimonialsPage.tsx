'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, Trash2, CheckCircle, XCircle, Quote, Loader2, User, Building, MessageCircle
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
    toast({ 
      title: 'Success', 
      description: `Review is now ${!currentStatus ? 'visible on your showroom' : 'hidden from visitors'}.` 
    });
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review permanently?')) {
      await deleteTestimonial(id);
      toast({ title: 'Deleted', description: 'Review removed permanently.' });
      fetchTestimonials();
    }
  };

  const safeFormatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Recently';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
        <p className="text-[#0E2356] text-sm font-bold uppercase tracking-widest">Loading Reviews...</p>
      </div>
    );
  }

  const pendingCount = testimonials.filter(t => !t.approved).length;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase"
          >
            Client Reviews
          </motion.h1>
          <p className="text-gray-400 font-medium">
            {pendingCount > 0 
              ? `You have ${pendingCount} review(s) awaiting your approval.` 
              : 'All client feedback has been processed.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase">
            {testimonials.length} Total Ratings
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {testimonials.length === 0 ? (
          <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[40px] p-24 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-6 text-slate-100" />
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">No reviews submitted yet.</p>
          </Card>
        ) : (
          <AnimatePresence>
            {testimonials.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            }).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden transition-all hover:shadow-red-50 border-2 border-transparent ${!item.approved ? 'border-amber-100' : ''}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-5 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-[#0E2356] flex items-center justify-center text-white font-black text-xl shadow-lg">
                            {item.clientName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-[#0E2356] uppercase tracking-tight leading-none mb-2">{item.clientName}</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < item.rating ? 'text-[#E31B23] fill-[#E31B23]' : 'text-gray-200'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {safeFormatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>
                          {!item.approved && (
                            <Badge className="ml-auto bg-amber-500 text-white border-none font-black text-[9px] px-3 py-1.5 rounded-lg tracking-widest animate-pulse">
                              PENDING APPROVAL
                            </Badge>
                          )}
                        </div>
                        
                        <div className="relative">
                          <Quote className="absolute -left-2 -top-2 w-8 h-8 text-slate-50 -z-0" />
                          <p className="text-[#0E2356] font-bold text-lg leading-relaxed relative z-10 italic">
                            "{item.feedback}"
                          </p>
                        </div>
                        
                        {item.company && (
                          <div className="mt-4 flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <Building className="w-3 h-3" />
                            {item.company}
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col gap-3 justify-end md:w-40 border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-8">
                        <Button
                          variant={item.approved ? "outline" : "default"}
                          size="lg"
                          className={`w-full h-14 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            item.approved 
                              ? "border-gray-200 text-gray-400 hover:text-amber-500 hover:border-amber-500" 
                              : "bg-[#0E2356] hover:bg-[#1a2f6b] text-white shadow-xl"
                          }`}
                          onClick={() => handleApprove(item.id, item.approved)}
                        >
                          {item.approved ? (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Hide Review
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full h-14 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl font-black text-[10px] uppercase tracking-widest"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
