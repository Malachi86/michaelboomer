'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Mail, MessageSquare, Award, User, Loader2, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';
import type { Skill, Project, Message } from "@/lib/types";

export function DashboardPage() {
  const db = useFirestore();

  const inventoryQuery = useMemo(() => query(collection(db, 'projects')), [db]);
  const { data: inventoryData, loading: inventoryLoading } = useCollection<Project>(inventoryQuery);

  const turnoversQuery = useMemo(() => query(collection(db, 'certificates')), [db]);
  const { data: turnoversData, loading: turnoversLoading } = useCollection<Skill>(turnoversQuery);

  const messagesQuery = useMemo(() => query(collection(db, 'messages'), orderBy('createdAt', 'desc')), [db]);
  const { data: messagesData, loading: messagesLoading } = useCollection<Message>(messagesQuery);

  const loading = inventoryLoading || turnoversLoading || messagesLoading;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#E31B23]" />
      <p className="text-[#0E2356] font-black tracking-widest text-[10px] uppercase animate-pulse">Initializing Showroom Console...</p>
    </div>
  );

  const unreadCount = messagesData?.filter(m => !m.read).length || 0;

  const stats = [
    { title: "VEHICLES", value: inventoryData?.length || 0, icon: Car, color: "text-[#E31B23]", bgColor: "bg-red-50", href: "/admin/projects" },
    { title: "TURNOVERS", value: turnoversData?.length || 0, icon: Award, color: "text-[#0E2356]", bgColor: "bg-blue-50", href: "/admin/certificates" },
    { title: "TOTAL INQUIRIES", value: messagesData?.length || 0, icon: MessageSquare, color: "text-[#E31B23]", bgColor: "bg-red-50", href: "/admin/messages" },
    { title: "NEW LEADS", value: unreadCount, icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", href: "/admin/messages" },
  ];

  return (
    <div className="grid gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#0E2356] tracking-tighter mb-2 uppercase">Sales Dashboard</h1>
          <p className="text-gray-400 font-medium">Manage your Suzuki inventory and buyer inquiries.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="relative group overflow-hidden bg-white border-none shadow-xl shadow-slate-200/50 hover:shadow-red-100 transition-all cursor-pointer rounded-[32px]">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                  <ArrowRight className="h-5 w-5 text-gray-200 transition-transform group-hover:translate-x-1 group-hover:text-[#E31B23]" />
                </div>
                <p className="text-4xl font-black text-[#0E2356] tracking-tighter mb-1">{stat.value}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
          <CardHeader className="bg-[#0E2356] p-8"><CardTitle className="text-white text-lg font-black tracking-tight uppercase">Quick Actions</CardTitle></CardHeader>
          <CardContent className="p-8 flex flex-col gap-4">
            <Button variant="outline" className="justify-start h-14 border-gray-100 text-[#0E2356] font-black text-[11px] tracking-widest uppercase hover:bg-red-50 hover:text-[#E31B23] rounded-2xl" asChild><Link href="/admin/profile"><User className="mr-3 h-4 w-4" />Update Profile</Link></Button>
            <Button variant="outline" className="justify-start h-14 border-gray-100 text-[#0E2356] font-black text-[11px] tracking-widest uppercase hover:bg-red-50 hover:text-[#E31B23] rounded-2xl" asChild><Link href="/admin/projects"><Car className="mr-3 h-4 w-4" />Add New Vehicle</Link></Button>
            <Button variant="outline" className="justify-start h-14 border-gray-100 text-[#0E2356] font-black text-[11px] tracking-widest uppercase hover:bg-red-50 hover:text-[#E31B23] rounded-2xl" asChild><Link href="/admin/certificates"><Award className="mr-3 h-4 w-4" />Post Turnover</Link></Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
            <CardTitle className="text-[#0E2356] text-lg font-black tracking-tight uppercase flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-[#E31B23]" />
              Recent Inquiries
            </CardTitle>
            <Link href="/admin/messages" className="text-[10px] font-black text-[#E31B23] hover:underline uppercase tracking-widest">View All Leads</Link>
          </CardHeader>
          <CardContent className="p-8">
            {messagesData && messagesData.length > 0 ? (
              <div className="space-y-4">
                {messagesData.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-gray-100/50 hover:border-red-100 transition-colors">
                    <div className={`h-3 w-3 rounded-full flex-shrink-0 ${msg.read ? 'bg-gray-200' : 'bg-[#E31B23] shadow-lg shadow-red-200'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-[#0E2356] text-sm uppercase truncate">{msg.name}</p>
                      <p className="text-xs text-gray-400 font-medium truncate">{msg.message}</p>
                    </div>
                    <time className="text-[9px] font-black text-gray-300 uppercase whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Mail className="h-10 w-10 text-slate-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No buyer inquiries yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
