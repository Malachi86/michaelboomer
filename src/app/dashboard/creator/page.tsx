
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, MoreVertical, Users, Star, BookOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const myCourses = [
  {
    id: "cs101",
    title: "Intro to Computer Science",
    enrolled: 1240,
    rating: 4.8,
    status: "Published",
    thumbnail: "https://picsum.photos/seed/cs101/600/400",
  },
  {
    id: "alg99",
    title: "Advanced Data Structures",
    enrolled: 85,
    rating: 4.9,
    status: "Draft",
    thumbnail: "https://picsum.photos/seed/algo/600/400",
  },
];

export default function CreatorPortal() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-headline text-4xl font-bold text-primary">Course Creator Portal</h1>
          <p className="text-muted-foreground">Manage your curriculum and student performance across your courses.</p>
        </div>
        <Button size="lg" className="h-12 shadow-md" asChild>
          <Link href="/dashboard/ai-assistant">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Course
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary font-bold uppercase tracking-widest text-[10px]">Total Revenue</CardDescription>
            <CardTitle className="text-3xl font-headline">$14,250</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 30 days performance</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-accent font-bold uppercase tracking-widest text-[10px]">Active Students</CardDescription>
            <CardTitle className="text-3xl font-headline">2,485</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Avg Course Rating</CardDescription>
            <CardTitle className="text-3xl font-headline">4.85</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Based on 842 reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold">Active Course Catalog</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden border-border/50 group">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                  <Image 
                    src={course.thumbnail} 
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={course.status === "Published" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-headline">{course.title}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 space-y-4 flex-1">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Students</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-accent" />
                          <span className="text-sm font-semibold">{course.enrolled}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Modules</span>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span className="text-sm font-semibold">12</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-muted/30 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 bg-background"><Edit className="h-3.5 w-3.5 mr-2" /> Manage</Button>
                    <Button variant="outline" size="sm" className="h-9 w-9 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
