'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Star, Quote, MessageSquare, 
  Loader2, Plus 
} from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { submitTestimonial } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function TestimonialsSection({ testimonials = [] }: { testimonials: Testimonial[] }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    feedback: ''
  });

  const approvedTestimonials = testimonials.filter(t => t.approved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.feedback) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    const result = await submitTestimonial({
      ...formData,
      rating,
      avatarUrl: ''
    });

    if (result.success) {
      toast({
        title: 'Thank you!',
        description: 'Your testimonial has been submitted and is awaiting approval.',
      });
      setFormData({ clientName: '', company: '', feedback: '' });
      setRating(5);
      setIsDialogOpen(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit review.' });
    }
    setIsSubmitting(false);
  };

  return (
    <section id="testimonials" className="relative py-32 bg-slate-50 overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#E31B23] font-black tracking-[0.2em] uppercase text-xs mb-4">
              Feedback
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0E2356] mb-4">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-[#E31B23] mx-auto mb-8" />
          </motion.div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#E31B23] text-[#E31B23] hover:bg-[#E31B23] hover:text-white font-black px-8 rounded-xl h-12 shadow-lg transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Leave a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none text-[#0E2356] sm:max-w-md shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#0E2356]">Share Your Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'text-[#E31B23] fill-[#E31B23]'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#0E2356] font-bold">Full Name *</Label>
                  <Input
                    required
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Your name"
                    className="bg-slate-50 border-gray-100 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#0E2356] font-bold">Company / Organization</Label>
                  <Input
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name (optional)"
                    className="bg-slate-50 border-gray-100 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#0E2356] font-bold">Your Message *</Label>
                  <Textarea
                    required
                    value={formData.feedback}
                    onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                    placeholder="Tell others about your experience..."
                    rows={4}
                    className="bg-slate-50 border-gray-100 rounded-xl resize-none p-4"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#E31B23] hover:bg-[#c4171e] text-white h-14 font-black rounded-xl shadow-xl transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MessageSquare className="w-5 h-5 mr-2" />}
                  Submit Review
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {approvedTestimonials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-xl"
          >
            <Quote className="w-12 h-12 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-500 text-lg font-medium italic">No reviews yet. Be the first to share your experience!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AnimatePresence>
              {approvedTestimonials.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white border border-gray-100 rounded-3xl h-full transition-all duration-500 hover:border-[#E31B23]/20 showroom-shadow">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < (item.rating || 5) ? 'text-[#E31B23] fill-[#E31B23]' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow italic font-medium">
                        "{item.feedback}"
                      </p>

                      <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-[#0E2356] flex items-center justify-center text-white font-black text-xl shadow-lg">
                          {item.clientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[#0E2356] font-black tracking-tight">
                            {item.clientName}
                          </h4>
                          {item.company && (
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                              {item.company}
                            </p>
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
      </div>
    </section>
  );
}