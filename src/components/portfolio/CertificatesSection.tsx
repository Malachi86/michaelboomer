
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, ZoomIn } from 'lucide-react';
import type { Certificate } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function CertificatesSection({ certificates = [] }: { certificates: Certificate[] }) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#E31B23] font-black tracking-[0.2em] uppercase text-xs mb-4">Credentials</p>
          <h2 className="text-4xl lg:text-5xl font-serif text-[#0E2356] mb-6 block">Certifications</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E31B23] to-[#0E2356] mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.sort((a, b) => (a.order || 0) - (b.order || 0)).map((cert, index) => {
            const displayImageUrl = cert.imageUrl || (cert as any).image_url;
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="bg-white border border-gray-100 rounded-3xl p-6 h-full transition-all duration-500 hover:border-[#E31B23]/30 showroom-shadow flex flex-col">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-50 group">
                    {displayImageUrl ? (
                      <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105" style={{ transform: `rotate(${cert.rotation || 0}deg)` }}>
                          <Image 
                              src={displayImageUrl} 
                              alt={cert.title} 
                              fill 
                              unoptimized
                              className="object-contain" 
                          />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-12 h-12 text-gray-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#0E2356]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#E31B23] text-white flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                          <ZoomIn className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2 text-[#E31B23] mb-3">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">{cert.issuer}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0E2356] mb-4 leading-tight group-hover:text-[#E31B23] transition-colors">
                      {cert.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Issued {cert.issueDate}</span>
                    </div>
                  </div>

                  {cert.credentialUrl && cert.credentialUrl !== '#' && (
                    <Button variant="outline" className="w-full border-gray-200 text-[#0E2356] hover:bg-[#E31B23] hover:text-white hover:border-[#E31B23] transition-all font-bold" asChild onClick={(e) => e.stopPropagation()}>
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        Verify <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
            <DialogContent className="max-w-4xl bg-white border-none p-0 overflow-hidden text-[#0E2356] shadow-2xl">
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                <div className="relative flex-grow bg-slate-50 flex items-center justify-center p-4 min-h-[400px]">
                  <div 
                    className="relative w-full h-full" 
                    style={{ transform: `rotate(${selectedCert.rotation || 0}deg)` }}
                  >
                    <Image 
                      src={selectedCert.imageUrl || (selectedCert as any).image_url} 
                      alt={selectedCert.title} 
                      fill 
                      unoptimized
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div className="w-full md:w-80 p-8 flex flex-col bg-white border-l border-gray-100">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-[#E31B23] mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedCert.issuer}</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold mb-4 leading-tight text-[#0E2356]">
                      {selectedCert.title}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>Issued {selectedCert.issueDate}</span>
                    </DialogDescription>
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    {selectedCert.credentialUrl && selectedCert.credentialUrl !== '#' && (
                      <Button className="w-full bg-[#E31B23] hover:bg-[#c4171e] text-white font-bold h-12 rounded-xl" asChild>
                        <a href={selectedCert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          Verify Credential <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full border-gray-200 h-12 font-bold text-gray-500 rounded-xl" onClick={() => setSelectedCert(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
