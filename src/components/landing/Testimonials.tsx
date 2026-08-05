import { Section } from '@/components/shared/Section';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { testimonials } from '@/lib/data';

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-card">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">What Clients Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          I'm proud to have collaborated with some amazing clients. Here's what they have to say.
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
              <div className="p-1 h-full">
                <Card className="h-full flex flex-col justify-between p-6">
                  <CardContent className="p-0 flex-grow">
                    <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4 mb-6">
                      {testimonial.feedback}
                    </blockquote>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.avatarUrl} alt={testimonial.clientName} data-ai-hint={testimonial.imageHint} />
                        <AvatarFallback>{testimonial.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  );
}
