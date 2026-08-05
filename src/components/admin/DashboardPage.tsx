
'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FolderKanban, Mail, MessageSquare, Sparkles, User, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';
import type { Skill, Project, Message } from "@/lib/types";

export function DashboardPage() {
  const db = useFirestore();

  const skillsQuery = useMemo(() => query(collection(db, 'skills')), [db]);
  const { data: skillsData, loading: skillsLoading } = useCollection<Skill>(skillsQuery);

  const projectsQuery = useMemo(() => query(collection(db, 'projects')), [db]);
  const { data: projectsData, loading: projectsLoading } = useCollection<Project>(projectsQuery);

  const messagesQuery = useMemo(() => query(collection(db, 'messages'), orderBy('createdAt', 'desc')), [db]);
  const { data: messagesData, loading: messagesLoading } = useCollection<Message>(messagesQuery);

  const loading = skillsLoading || projectsLoading || messagesLoading;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse text-sm">Optimizing dashboard...</p>
    </div>
  );

  const unreadCount = messagesData?.filter(m => !m.read).length || 0;

  const stats = [
    { title: "Skills", value: skillsData?.length || 0, icon: Sparkles, color: "text-primary", bgColor: "bg-primary/10", href: "/admin/skills" },
    { title: "Projects", value: projectsData?.length || 0, icon: FolderKanban, color: "text-accent", bgColor: "bg-accent/10", href: "/admin/projects" },
    { title: "Messages", value: messagesData?.length || 0, icon: MessageSquare, color: "text-primary", bgColor: "bg-primary/10", href: "/admin/messages" },
    { title: "Unread", value: unreadCount, icon: Mail, color: "text-accent", bgColor: "bg-accent/10", href: "/admin/messages" },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="relative group overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border/50">
          <CardHeader><CardTitle className="text-white flex items-center gap-2">Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start border-border/50 text-muted-foreground hover:text-white hover:border-primary/50" asChild><Link href="/admin/profile"><User className="mr-2 h-4 w-4" />Edit Profile</Link></Button>
            <Button variant="outline" className="justify-start border-border/50 text-muted-foreground hover:text-white hover:border-primary/50" asChild><Link href="/admin/skills"><Sparkles className="mr-2 h-4 w-4" />Manage Skills</Link></Button>
            <Button variant="outline" className="justify-start border-border/50 text-muted-foreground hover:text-white hover:border-primary/50" asChild><Link href="/admin/projects"><FolderKanban className="mr-2 h-4 w-4" />Manage Projects</Link></Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" />Recent Messages</CardTitle>
            <Link href="/admin/messages" className="text-sm text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {messagesData && messagesData.length > 0 ? (
              <div className="space-y-4">
                {messagesData.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-white/5">
                    <div className={`mt-1.5 h-2 w-2 rounded-full ${msg.read ? 'bg-muted-foreground' : 'bg-primary'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{msg.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">No new messages.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
