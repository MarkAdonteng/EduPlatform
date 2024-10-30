export interface User {
  id: string;
  username: string;
  role: 'admin' | 'student';
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  icon: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
}

export interface Test {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Video {
  id: string;
  courseId: string;
  title: string;
  url: string;
  description: string;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'other';
  url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  courseId: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedVideos: string[];
  completedTests: string[];
  downloadedMaterials: string[];
  lastAccessed: string;
  progress: number;
}