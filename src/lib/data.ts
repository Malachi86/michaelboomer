import type { Profile, Skill, Project, Message, Analytics, Testimonial } from './types';

export const profile: Profile = {
  "full_name": "Marvin Paul Orozco",
  "title": "Web Developer & VA Specialist",
  "subtitle": "Fullstack Developer & Virtual Assistant",
  "bio": "I craft high-performance digital experiences and provide top-tier virtual assistance. With a focus on efficiency and creativity, I help businesses grow their online presence.",
  "profile_image": "",
  "resume_url": "#",
  "email": "orozcomarvinpaul@gmail.com",
  "social_links": [
    {
      "platform": "github",
      "url": "https://github.com/marvinorozco",
      "icon": "github"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/in/marvin-paul-orozco-57bb77392/",
      "icon": "linkedin"
    },
    {
      "platform": "email",
      "url": "mailto:orozcomarvinpaul@gmail.com",
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
    "title": "E-commerce System",
    "description": "A robust online shopping platform with inventory management and secure payments.",
    "category": "E-commerce",
    "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "live_demo_url": "#",
    "github_url": "#",
    "tech_stack": ["Next.js", "Firebase", "Stripe"],
    "featured": true,
    "order": 1
  },
  {
    "id": "proj-2",
    "title": "Automated VA Workflow",
    "description": "Streamlining administrative tasks using AI and automation tools for high productivity.",
    "category": "VA Project",
    "image_url": "https://images.unsplash.com/photo-1559028006-448665bd7c20?w=600&h=400&fit=crop",
    "video_url": "",
    "live_demo_url": "#",
    "github_url": "#",
    "tech_stack": ["Zapier", "Asana", "OpenAI"],
    "featured": true,
    "order": 2
  }
];

export const testimonials: Testimonial[] = [
  {
    "id": "test-1",
    "clientName": "Alex Rivera",
    "company": "TechStream",
    "feedback": "Marvin is a reliable developer who always finds solutions to complex problems.",
    "avatarUrl": "https://picsum.photos/seed/test1/100/100",
    "rating": 5,
    "approved": true,
    "createdAt": "2026-02-24T00:00:00.000Z"
  },
  {
    "id": "test-2",
    "clientName": "Sarah Jenkins",
    "company": "Green Solutions",
    "feedback": "His virtual assistance has been a game-changer for our daily operations.",
    "avatarUrl": "https://picsum.photos/seed/test2/100/100",
    "rating": 5,
    "approved": true,
    "createdAt": "2026-02-24T00:00:00.000Z"
  }
];

export const messages: Message[] = [];
export const analytics: Analytics[] = [];