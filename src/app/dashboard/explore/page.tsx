
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Compass, Star, Users, ArrowRight } from "lucide-react";
import Image from "next/image";

const categories = ["All", "Science", "History", "Arts", "Engineering", "Business"];

const exploreCourses = [
  {
    id: "bio1",
    title: "Microbiology Fundamentals",
    category: "Science",
    instructor: "Dr. Lisa Ray",
    rating: 4.7,
    students: "3.2k",
    thumbnail: "https://picsum.photos/seed/bio/600/400",
  },
  {
    id: "eng1",
    title: "Bridge Design Principles",
    category: "Engineering",
    instructor: "Prof. Kevin Stark",
    rating: 4.9,
    students: "1.5k",
    thumbnail: "https://picsum.photos/seed/bridge/600/400",
  },
  {
    id: "hist1",
    title: "The Industrial Revolution",
    category: "History",
    instructor: "David Miller",
    rating: 4.5,
    students: "5k+",
    thumbnail: "https://picsum.photos/seed/history/600/400",
  },
  {
    id: "biz1",
    title: "Strategic Management 101",
    category: "Business",
    instructor: "Sarah Collins",
    rating: 4.8,
    students: "8.9k",
    thumbnail: "https://picsum.photos/seed/biz/600/400",
  },
];

export default function ExplorePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Compass className="h-8 w-8 text-accent" />
          <h1 className="font-headline text-4xl font-bold text-primary">Explore Knowledge</h1>
        </div>
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for subjects, topics, or instructors..." 
            className="pl-10 h-12 text-lg shadow-sm bg-card border-border/50 rounded-full"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button key={cat} variant={cat === "All" ? "default" : "outline"} className="rounded-full h-9 px-6 font-medium">
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exploreCourses.map((course) => (
          <Card key={course.id} className="group overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
            <div className="relative h-44 w-full">
              <Image 
                src={course.thumbnail} 
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary/90 backdrop-blur-sm text-[10px]">{course.category}</Badge>
              </div>
            </div>
            <CardHeader className="p-4 space-y-1">
              <CardTitle className="text-lg font-headline line-clamp-2 leading-tight h-12">{course.title}</CardTitle>
              <CardDescription className="text-xs">{course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{course.students}</span>
                </div>
              </div>
              <Button className="w-full h-10 rounded-lg group" variant="secondary">
                View Syllabus <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
