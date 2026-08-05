import { Section } from '@/components/shared/Section';
import { skills } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Palette, Headphones, Wrench } from 'lucide-react';

export function Skills() {
  const categories = ['Development', 'Design', 'VA Tools', 'Other'] as const;
  
  const categoryIcons = {
    Development: <Code className="w-6 h-6 text-primary" />,
    Design: <Palette className="w-6 h-6 text-primary" />,
    'VA Tools': <Headphones className="w-6 h-6 text-primary" />,
    Other: <Wrench className="w-6 h-6 text-primary" />,
  };

  return (
    <Section id="skills">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">My Expertise</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A versatile skill set honed over years of experience in development and creative media.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(category => (
          <Card key={category} className="text-center bg-card/50">
            <CardHeader>
              <div className="flex justify-center items-center gap-3">
                {categoryIcons[category]}
                <CardTitle className="font-headline text-xl">{category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {skills
                  .filter(skill => skill.category === category)
                  .map(skill => (
                    <li key={skill.name} className="text-muted-foreground">
                      {skill.name}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
