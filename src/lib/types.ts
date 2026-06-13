
export interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  modules: Module[];
  enrolledStudents: number;
  category: string;
  deadline?: string;
}

export interface Thread {
  id: string;
  courseId: string;
  author: string;
  content: string;
  createdAt: string;
  replies: number;
}
