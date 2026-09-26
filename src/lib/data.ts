import type { Profile, Skill, Project, Message, Analytics, Testimonial } from './types';

export const profile: Profile = {
  "full_name": "Michael Gabriel Orozco",
  "title": "Suzuki Auto Sales Executive",
  "subtitle": "Authorized Sales Representative",
  "bio": "Ang iyong katuwang sa pagkamit ng pangarap na sasakyan. Mabilis na approval, low downpayment, at de-kalidad na serbisyo.",
  "profile_image": "",
  "resume_url": "#",
  "email": "michaelgabrielc.orozco@gmail.com",
  "social_links": [
    {
      "platform": "facebook",
      "url": "https://www.facebook.com/SuzukiAutoLipaByMichaelGabrielOrozco",
      "icon": "facebook"
    },
    {
      "platform": "viber",
      "url": "viber://chat?number=09692721107",
      "icon": "message-circle"
    },
    {
      "platform": "email",
      "url": "mailto:michaelgabrielc.orozco@gmail.com",
      "icon": "email"
    }
  ]
};

export const skills: Skill[] = [
  { "id": "skill-1", "name": "React / Next.js", "icon": "Code", "category": "Development", "proficiency": 95, "order": 1 },
  { "id": "skill-2", "name": "Node.js", "icon": "Server", "category": "Development", "proficiency": 85, "order": 2 },
  { "id": "skill-3", "name": "Tailwind CSS", "icon": "Layout", "category": "Design", "proficiency": 98, "order": 3 },
  { "id": "skill-4", "name": "Figma", "icon": "Figma", "category": "Design", "proficiency": 90, "order": 4 },
  { "id": "skill-5", "name": "Virtual Assistance", "icon": "Headphones", "category": "VA Tools", "proficiency": 100, "order": 5 },
  { "id": "skill-6", "name": "Project Management", "icon": "Zap", "category": "VA Tools", "proficiency": 95, "order": 6 }
];

export const projects: Project[] = [
  {
    "id": "proj-1",
    "title": "Suzuki S-PRESSO",
    "description": "Bold, compact, and packed with personality. The perfect city companion.",
    "category": "HATCHBACK",
    "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "live_demo_url": "#",
    "github_url": "#",
    "tech_stack": ["Touchscreen Audio", "High Ground Clearance", "Fuel Efficient"],
    "featured": true,
    "order": 1,
    "price": 620000
  }
];

export const testimonials: Testimonial[] = [];
export const messages: Message[] = [];
export const analytics: Analytics[] = [];
