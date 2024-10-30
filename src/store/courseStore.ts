import { create } from 'zustand';
import { Course, Video, Test, Material } from '../types';

interface CourseState {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  addVideo: (courseId: string, video: Video) => void;
  addTest: (courseId: string, test: Test) => void;
  addMaterial: (courseId: string, material: Material) => void;
  videos: Record<string, Video[]>;
  tests: Record<string, Test[]>;
  materials: Record<string, Material[]>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [
    {
      id: '1',
      title: 'Mathematics',
      description: 'Comprehensive mathematics course covering algebra, geometry, and calculus',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80',
      icon: 'calculator'
    },
    {
      id: '2',
      title: 'English Language',
      description: 'Master English grammar, vocabulary, and communication skills',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80',
      icon: 'book'
    },
    {
      id: '3',
      title: 'Science',
      description: 'Explore physics, chemistry, and biology concepts',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
      icon: 'flask'
    },
    {
      id: '4',
      title: 'Creative Arts',
      description: 'Develop artistic skills through various mediums',
      imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80',
      icon: 'palette'
    },
    {
      id: '5',
      title: 'Religious and Moral Education',
      description: 'Learn about different religions and moral values',
      imageUrl: 'https://images.unsplash.com/photo-1507409613952-518459ac866c?auto=format&fit=crop&q=80',
      icon: 'heart'
    },
    {
      id: '6',
      title: 'Our World Our People',
      description: 'Understanding society, culture, and citizenship',
      imageUrl: 'https://images.unsplash.com/photo-1532186651327-6ac23687d189?auto=format&fit=crop&q=80',
      icon: 'globe'
    },
    {
      id: '7',
      title: 'Social Studies',
      description: 'Study human society and social relationships',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80',
      icon: 'users'
    }
  ],
  videos: {},
  tests: {},
  materials: {},
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ 
    courses: [...state.courses, course]
  })),
  addVideo: (courseId, video) => set((state) => ({
    videos: {
      ...state.videos,
      [courseId]: [...(state.videos[courseId] || []), video]
    }
  })),
  addTest: (courseId, test) => set((state) => ({
    tests: {
      ...state.tests,
      [courseId]: [...(state.tests[courseId] || []), test]
    }
  })),
  addMaterial: (courseId, material) => set((state) => ({
    materials: {
      ...state.materials,
      [courseId]: [...(state.materials[courseId] || []), material]
    }
  }))
}));