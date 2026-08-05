
export type Profile = {
  full_name: string;
  title: string;
  subtitle: string;
  bio: string;
  profile_image: string;
  resume_url: string;
  email: string;
  social_links: {
    platform: string;
    url: string;
    icon: string;
  }[];
};

export type Skill = {
  id: string;
  name: string;
  icon: string;
  category: 'Development' | 'Design' | 'VA Tools' | 'Other';
  proficiency: number;
  order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: 'Web App' | 'Mobile App' | 'E-commerce' | 'VA Project' | 'Other';
  image_url?: string;
  video_url?: string;
  live_demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  featured: boolean;
  order: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  imageUrl: string;
  credentialUrl?: string;
  order: number;
  rotation?: number; // 0, 90, 180, 270
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  clientName: string;
  company: string;
  feedback: string;
  rating: number;
  avatarUrl?: string;
  approved: boolean;
  createdAt: string;
};

export type Analytics = {
  id: string;
  event_type: 'page_view' | 'click' | 'time_spent' | 'form_submit';
  page: string;
  element?: string;
  duration?: number;
  visitor_id: string;
  metadata?: Record<string, any>;
  createdAt: string;
};
