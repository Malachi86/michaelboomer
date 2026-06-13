
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, Wand2, ArrowRight, Loader2, Save, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateLessonOutline } from "@/ai/flows/generate-lesson-outline";

export default function AIAssistantPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Undergraduate students");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Missing input",
        description: "Please enter a topic to generate an outline.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const output = await generateLessonOutline({ topic, audience });
      setResult(output);
      toast({
        title: "Draft Generated",
        description: "Your AI assistant has completed the draft outline."
      });
    } catch (err) {
      toast({
        title: "Generation failed",
        description: "The AI was unable to generate the outline. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="h-3 w-3" />
          Powered by Lumina Intelligence
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">AI Lesson Assistant</h1>
        <p className="text-muted-foreground">Draft comprehensive course structures and assessments in seconds with scholarly reasoning.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              What are we teaching today?
            </CardTitle>
            <CardDescription>Provide a topic and the target audience for your curriculum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic or Subject Area</label>
              <Input 
                placeholder="e.g. Advanced Thermodynamics or Intro to Digital Photography"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Input 
                placeholder="e.g. High school seniors, Professional engineers"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button 
              className="w-full h-11 text-lg font-headline font-bold shadow-lg" 
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Reasoning about Curriculum...
                </>
              ) : (
                <>
                  Generate Detailed Outline <Wand2 className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-accent/20 bg-accent/5 animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline font-bold text-primary">Draft: {topic}</CardTitle>
                <Badge variant="outline" className="border-accent text-accent bg-background">Scholarly Output</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Save className="h-4 w-4 mr-1" /> Save</Button>
                <Button variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Publish <Send className="h-4 w-4 ml-1" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <div className="whitespace-pre-wrap font-body text-foreground">
                  {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-primary">Recommended Modules</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((m) => (
                    <div key={m} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{m}</span>
                        <span className="font-medium">Foundational Concepts {m}</span>
                      </div>
                      <Badge variant="secondary">30 mins</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
