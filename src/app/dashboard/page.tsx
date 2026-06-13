
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const enrolledCourses = [
  {
    id: "cs101",
    title: "Intro to Computer Science",
    instructor: "Dr. Elena Vance",
    progress: 65,
    nextDeadline: "Oct 24, 2023",
    thumbnail: "https://picsum.photos/seed/cs101/600/400",
  },
  {
    id: "art202",
    title: "Renaissance Art History",
    instructor: "Prof. Marcus Aurelius",
    progress: 20,
    nextDeadline: "Oct 28, 2023",
    thumbnail: "https://picsum.photos/seed/art/600/400",
  },
  {
    id: "astro303",
    title: "Quantum Mechanics for Beginners",
    instructor: "Dr. Sarah Jenkins",
    progress: 90,
    nextDeadline: "Oct 22, 2023",
    thumbnail: "https://picsum.photos/seed/space/600/400",
  },
];

export default function KnowledgeDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl font-bold text-primary">Welcome back, Scholar</h1>
        <p className="text-muted-foreground">Continue your journey where you left off. Focus is the key to mastery.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              My Learning Path
            </h2>
            <Button variant="ghost" className="text-primary font-medium">View all</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden border-border/50">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image 
                    src={course.thumbnail} 
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint="educational course"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {course.progress}% Complete
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-5 pb-0">
                  <CardTitle className="text-lg font-headline line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="text-xs">{course.instructor}</CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <Progress value={course.progress} className="h-1.5" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Deadline: {course.nextDeadline}</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" asChild>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        Resume <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:border-accent/30 transition-colors">
                <div className="w-1.5 h-auto bg-primary rounded-full shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold line-clamp-1">{course.title}</h4>
                  <p className="text-xs text-muted-foreground">Module Quiz: Final Assessment</p>
                  <p className="text-xs font-medium text-destructive">{course.nextDeadline}</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
            <div className="absolute -right-10 -top-10 bg-accent/20 w-32 h-32 rounded-full blur-3xl" />
            <CardHeader>
              <CardTitle className="text-xl font-headline">Weekly Achievement</CardTitle>
              <CardDescription className="text-primary-foreground/70">You've completed 4 hours of focus time this week!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full font-bold">Claim Badge</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
