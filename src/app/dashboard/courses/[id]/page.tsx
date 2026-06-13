
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, BookOpen, MessageCircle, FileText } from "lucide-react";

const modules = [
  { id: "1", title: "Introduction and Foundations", duration: "12m", completed: true },
  { id: "2", title: "Historical Context and Major Themes", duration: "45m", completed: true },
  { id: "3", title: "Practical Application: Phase 1", duration: "30m", completed: false },
  { id: "4", title: "Practical Application: Phase 2", duration: "25m", completed: false },
  { id: "5", title: "Conclusion and Final Summary", duration: "15m", completed: false },
];

export default function CourseViewer() {
  const { id } = useParams();
  const [currentModuleId, setCurrentModuleId] = useState("3");

  const currentModule = modules.find(m => m.id === currentModuleId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Introduction to Computer Science</span>
          </div>
          <h1 className="font-headline text-3xl font-bold">{currentModule?.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" /> Prev
          </Button>
          <Button variant="default" size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
            Next Module <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group ring-1 ring-border/50">
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <div className="p-8 border-4 border-dashed border-white/20 rounded-full">
                <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center text-white">
                  <ArrowRight className="h-8 w-8 ml-1" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-accent w-1/3" />
               </div>
               <span className="text-white text-xs font-mono">12:45 / 30:00</span>
            </div>
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-8 mb-6">
              <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0 font-bold text-base">Lesson Content</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0 font-bold text-base">Resources</TabsTrigger>
              <TabsTrigger value="discussion" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0 font-bold text-base">Discussion Hub</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="prose prose-blue max-w-none prose-headings:font-headline">
              <h2 className="text-2xl font-bold mb-4">Module Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                In this segment, we explore the fundamental architecture of modern computation. From the von Neumann model to contemporary distributed systems, we'll examine how data flow governs the speed and efficiency of algorithm execution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Key concepts covered in this module include:
              </p>
              <ul className="space-y-2 mt-4 text-muted-foreground">
                <li>Binary representation and logic gates</li>
                <li>The fetch-decode-execute cycle</li>
                <li>Memory hierarchy and cache optimization</li>
              </ul>
            </TabsContent>
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex items-center p-4 gap-4 border-border/50">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-bold text-sm">Lecture Notes.pdf</h4>
                    <p className="text-xs text-muted-foreground">1.2 MB</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
                </Card>
                <Card className="flex items-center p-4 gap-4 border-border/50">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-bold text-sm">Case Study: AWS Infrastructure.pdf</h4>
                    <p className="text-xs text-muted-foreground">4.5 MB</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="discussion">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">JD</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-primary">John Doe</span>
                        <span className="text-[10px] text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Does anyone have a better analogy for the cache line size in modern CPUs? I'm struggling with the grocery store example Dr. Vance used.</p>
                      <div className="flex items-center gap-4 pt-2">
                        <button className="text-xs font-medium text-accent hover:underline flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 5 Replies</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6 sticky top-8">
          <Card className="border-border/50 overflow-hidden shadow-sm">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-sm uppercase tracking-widest font-bold text-primary">Course Progress</CardTitle>
                <Badge variant="outline" className="text-primary border-primary">40%</Badge>
              </div>
              <Progress value={40} className="h-1.5" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {modules.map((m) => (
                  <button 
                    key={m.id} 
                    onClick={() => setCurrentModuleId(m.id)}
                    className={`w-full text-left p-4 transition-colors flex items-start gap-3 hover:bg-muted/50 ${currentModuleId === m.id ? 'bg-accent/5 ring-l-4 ring-accent' : ''}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {m.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <span className={`text-sm block leading-tight font-medium ${currentModuleId === m.id ? 'text-accent' : 'text-foreground'}`}>
                        {m.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{m.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Button variant="outline" className="w-full h-11 border-border/50 shadow-sm">
            <MessageCircle className="mr-2 h-4 w-4" /> Ask Instructor
          </Button>
        </aside>
      </div>
    </div>
  );
}
