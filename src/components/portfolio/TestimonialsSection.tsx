'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Star, Quote, MessageSquare, 
  Loader2, Plus, Eye, ArrowRight
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import type { Testimonial } from '@/lib/types';
import { submitTestimonial } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

export default function TestimonialsSection({ testimonials = [] }: { testimonials: Testimonial[] }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

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
    <section id="testimonials" className="relative py-32 bg-white overflow-hidden">
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
            <h2 className="text-4xl lg:text-6xl font-serif text-[#0E2356] mb-6">
              What Our Clients Say
            </h2>
            <div className="w-16 h-1 bg-[#E31B23] mx-auto mb-10 rounded-full" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#E31B23] text-[#E31B23] hover:bg-[#E31B23] hover:text-white font-black px-8 rounded-xl h-14 shadow-lg transition-all text-xs tracking-widest uppercase">
                  <Plus className="w-5 h-5 mr-2" />
                  Leave a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-none text-[#0E2356] sm:max-w-md shadow-2xl rounded-[40px] p-10">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-[#0E2356]">Share Your Experience</DialogTitle>
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name *</Label>
                    <Input
                      required
                      value={formData.clientName}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Your name"
                      className="bg-slate-50 border-gray-100 h-14 rounded-xl font-bold text-[#0E2356]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Company / Location</Label>
                    <Input
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Lipa City (optional)"
                      className="bg-slate-50 border-gray-100 h-14 rounded-xl font-bold text-[#0E2356]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Message *</Label>
                    <Textarea
                      required
                      value={formData.feedback}
                      onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                      placeholder="Tell others about your Suzuki buying experience..."
                      rows={4}
                      className="bg-slate-50 border-gray-100 rounded-xl resize-none p-4 font-bold text-[#0E2356]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#E31B23] hover:bg-[#c4171e] text-white h-14 font-black rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MessageSquare className="w-5 h-5 mr-2" />}
                    Submit Review
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button asChild variant="outline" className="border-[#0E2356] text-[#0E2356] hover:bg-[#0E2356] hover:text-white font-black px-8 rounded-xl h-14 shadow-lg transition-all text-xs tracking-widest uppercase">
              <Link href="/reviews">
                <Eye className="w-5 h-5 mr-2" />
                View All Reviews
              </Link>
            </Button>
          </div>
        </div>

        {approvedTestimonials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[40px] p-24 text-center shadow-xl shadow-slate-200/50"
          >
            <Quote className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-gray-200" />)}
            </div>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Be the first to share your Suzuki experience!</p>
          </motion.div>
        ) : (
          <div className="relative group">
            <Carousel
              plugins={[plugin.current]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto cursor-grab active:cursor-grabbing"
            >
              <CarouselContent className="-ml-4">
                {approvedTestimonials.map((item, index) => (
                  <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                    <div className="p-1 h-full">
                      <Card className="bg-white border-none rounded-[32px] h-full transition-all duration-500 hover:shadow-red-50 showroom-shadow border-2 border-transparent">
                        <CardContent className="p-10 flex flex-col h-full">
                          <div className="flex gap-0.5 mb-8">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < (item.rating || 5) ? 'text-[#E31B23] fill-[#E31B23]' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                          <div className="relative mb-10">
                            <Quote className="absolute -left-4 -top-4 w-10 h-10 text-slate-50 -z-0" />
                            <p className="text-[#0E2356] text-xl font-bold leading-relaxed relative z-10 italic">
                              "{item.feedback}"
                            </p>
                          </div>

                          <div className="flex items-center gap-5 pt-8 border-t border-gray-50 mt-auto">
                            <div className="w-14 h-14 rounded-2xl bg-[#0E2356] flex items-center justify-center text-white font-black text-xl shadow-lg">
                              {item.clientName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-[#0E2356] tracking-tight uppercase">
                                {item.clientName}
                              </h4>
                              {item.company && (
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                                  {item.company}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Auto-Slide Indicator */}
            <div className="flex justify-center gap-1.5 mt-10">
              {approvedTestimonials.slice(0, Math.ceil(approvedTestimonials.length / 2)).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#0E2356]/10" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
