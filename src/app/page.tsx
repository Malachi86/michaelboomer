
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary tracking-tight">
          Lumina Academy
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
          Where curiosity meets intelligence. A world-class learning platform designed for the scholars of tomorrow.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button size="lg" className="h-12 px-8 text-lg font-medium shadow-lg" asChild>
            <Link href="/dashboard">
              Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-medium" asChild>
            <Link href="/dashboard/explore">
              Explore Courses
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <GraduationCap className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-headline text-xl font-bold mb-2">Academic Excellence</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Rigorous courses designed by industry experts and academic veterans.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <BookOpen className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-headline text-xl font-bold mb-2">Zen-Mode Interface</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Distraction-free learning environment focused on deep comprehension.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <ArrowRight className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-headline text-xl font-bold mb-2">Fluid Progress</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Real-time tracking and intelligent recommendations to keep you moving.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
