import { create } from 'zustand';
import { Course, Video, Test, Material, Book } from '../types';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface CourseState {
  courses: Course[];
  videos: Record<string, Video[]>;
  tests: Record<string, Test[]>;
  materials: Record<string, Material[]>;
  books: Book[];
  loading: boolean;
  fetchCourses: () => Promise<void>;
  fetchBooks: () => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addVideo: (courseId: string, video: Video) => Promise<void>;
  updateVideo: (courseId: string, videoId: string, video: Partial<Video>) => Promise<void>;
  deleteVideo: (courseId: string, videoId: string) => Promise<void>;
  addTest: (courseId: string, test: Test) => Promise<void>;
  updateTest: (courseId: string, testId: string, test: Partial<Test>) => Promise<void>;
  deleteTest: (courseId: string, testId: string) => Promise<void>;
  addMaterial: (courseId: string, material: Material) => Promise<void>;
  updateMaterial: (courseId: string, materialId: string, material: Partial<Material>) => Promise<void>;
  deleteMaterial: (courseId: string, materialId: string) => Promise<void>;
  error?: string;
}

export const useCourseStore = create<CourseState>((set, _get) => ({
  courses: [],
  videos: {},
  tests: {},
  materials: {},
  books: [],
  loading: false,

  fetchCourses: async () => {
    set({ loading: true });
    try {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

      const videosSnapshot = await getDocs(collection(db, 'videos'));
      const videos: Record<string, Video[]> = {};
      videosSnapshot.docs.forEach(doc => {
        const video = { id: doc.id, ...doc.data() } as Video;
        if (!videos[video.courseId]) videos[video.courseId] = [];
        videos[video.courseId].push(video);
      });

      const testsSnapshot = await getDocs(collection(db, 'tests'));
      const tests: Record<string, Test[]> = {};
      testsSnapshot.docs.forEach(doc => {
        const test = { id: doc.id, ...doc.data() } as Test;
        if (!tests[test.courseId]) tests[test.courseId] = [];
        tests[test.courseId].push(test);
      });

      const materialsSnapshot = await getDocs(collection(db, 'materials'));
      const materials: Record<string, Material[]> = {};
      materialsSnapshot.docs.forEach(doc => {
        const material = { id: doc.id, ...doc.data() } as Material;
        if (!materials[material.courseId]) materials[material.courseId] = [];
        materials[material.courseId].push(material);
      });

      set({ courses, videos, tests, materials, loading: false });
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ loading: false });
    }
  },

  addCourse: async (course) => {
    try {
      const docRef = await addDoc(collection(db, 'courses'), course);
      const newCourse = { ...course, id: docRef.id };
      set(state => ({ courses: [...state.courses, newCourse] }));
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  updateCourse: async (id, course) => {
    try {
      await updateDoc(doc(db, 'courses', id), course);
      set(state => ({
        courses: state.courses.map(c => c.id === id ? { ...c, ...course } : c)
      }));
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (id) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      set(state => ({
        courses: state.courses.filter(c => c.id !== id),
        videos: { ...state.videos, [id]: [] },
        tests: { ...state.tests, [id]: [] },
        materials: { ...state.materials, [id]: [] }
      }));
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  addVideo: async (courseId, video) => {
    try {
      const docRef = await addDoc(collection(db, 'videos'), { ...video, courseId });
      const newVideo = { ...video, id: docRef.id, courseId };
      set(state => ({
        videos: {
          ...state.videos,
          [courseId]: [...(state.videos[courseId] || []), newVideo]
        }
      }));
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  },

  updateVideo: async (courseId, videoId, video) => {
    try {
      await updateDoc(doc(db, 'videos', videoId), video);
      set(state => ({
        videos: {
          ...state.videos,
          [courseId]: state.videos[courseId].map(v => 
            v.id === videoId ? { ...v, ...video } : v
          )
        }
      }));
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  deleteVideo: async (courseId, videoId) => {
    try {
      await deleteDoc(doc(db, 'videos', videoId));
      set(state => ({
        videos: {
          ...state.videos,
          [courseId]: state.videos[courseId].filter(v => v.id !== videoId)
        }
      }));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  addTest: async (courseId, test) => {
    try {
      const docRef = await addDoc(collection(db, 'tests'), { ...test, courseId });
      const newTest = { ...test, id: docRef.id, courseId };
      set(state => ({
        tests: {
          ...state.tests,
          [courseId]: [...(state.tests[courseId] || []), newTest]
        }
      }));
    } catch (error) {
      console.error('Error adding test:', error);
      throw error;
    }
  },

  updateTest: async (courseId, testId, test) => {
    try {
      await updateDoc(doc(db, 'tests', testId), test);
      set(state => ({
        tests: {
          ...state.tests,
          [courseId]: state.tests[courseId].map(t => 
            t.id === testId ? { ...t, ...test } : t
          )
        }
      }));
    } catch (error) {
      console.error('Error updating test:', error);
      throw error;
    }
  },

  deleteTest: async (courseId, testId) => {
    try {
      await deleteDoc(doc(db, 'tests', testId));
      set(state => ({
        tests: {
          ...state.tests,
          [courseId]: state.tests[courseId].filter(t => t.id !== testId)
        }
      }));
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  },

  addMaterial: async (courseId, material) => {
    try {
      const docRef = await addDoc(collection(db, 'materials'), { ...material, courseId });
      const newMaterial = { ...material, id: docRef.id, courseId };
      set(state => ({
        materials: {
          ...state.materials,
          [courseId]: [...(state.materials[courseId] || []), newMaterial]
        }
      }));
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  },

  updateMaterial: async (courseId, materialId, material) => {
    try {
      await updateDoc(doc(db, 'materials', materialId), material);
      set(state => ({
        materials: {
          ...state.materials,
          [courseId]: state.materials[courseId].map(m => 
            m.id === materialId ? { ...m, ...material } : m
          )
        }
      }));
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  },

  deleteMaterial: async (courseId, materialId) => {
    try {
      await deleteDoc(doc(db, 'materials', materialId));
      set(state => ({
        materials: {
          ...state.materials,
          [courseId]: state.materials[courseId].filter(m => m.id !== materialId)
        }
      }));
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  },

  fetchBooks: async () => {
    set({ loading: true });
    try {
      const snapshot = await getDocs(collection(db, 'books'));
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      set({ books, loading: false });
    } catch (error) {
      console.error('Error fetching books:', error);
      set({ loading: false });
    }
  }
}));