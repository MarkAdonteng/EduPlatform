import { create } from 'zustand';
import { Course, Video, Test, Material, Book } from '../types';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';

interface DeleteConfirmation {
  show: boolean;
  type: 'course' | 'video' | 'test' | 'material';
  id: string;
  courseId?: string;
  onConfirm: () => void;
}

interface CourseState {
  courses: Course[];
  videos: Record<string, Video[]>;
  tests: Record<string, Test[]>;
  materials: Record<string, Material[]>;
  books: Book[];
  loading: boolean;
  deleteConfirmation: DeleteConfirmation | null;
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
  showDeleteConfirmation: (confirmation: Omit<DeleteConfirmation, 'show'>) => void;
  hideDeleteConfirmation: () => void;
  error?: string;
}

export const useCourseStore = create<CourseState>((set, _get) => ({
  courses: [],
  videos: {},
  tests: {},
  materials: {},
  books: [],
  loading: false,
  deleteConfirmation: null,

  showDeleteConfirmation: (confirmation) => {
    set({ deleteConfirmation: { ...confirmation, show: true } });
  },

  hideDeleteConfirmation: () => {
    set({ deleteConfirmation: null });
  },

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
    set({ loading: true });
    try {
      const docRef = await addDoc(collection(db, 'courses'), course);
      const docSnapshot = await getDoc(docRef);
      const newCourse = { id: docSnapshot.id, ...docSnapshot.data() } as Course;
      
      set(state => ({ 
        courses: [...state.courses, newCourse],
        loading: false 
      }));
    } catch (error) {
      console.error('Error adding course:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateCourse: async (idValue, course) => {
    // set({ loading: true });
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('id', '==', idValue)
      );
      const querySnapshot = await getDocs(coursesQuery);

      if (!querySnapshot.empty) {
        const courseDocRef = querySnapshot.docs[0].ref;
        await updateDoc(courseDocRef, course);

        set(state => ({
          courses: state.courses.map(c => c.id === idValue ? { ...c, ...course } : c),
          loading: false
        }));

        console.log(`Successfully updated course with id field value: ${idValue}`);
      } else {
        console.log(`No course found with id field value: ${idValue}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error updating course:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteCourse: async (idValue) => {
    set({ loading: true });
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('id', '==', idValue)
      );
      const querySnapshot = await getDocs(coursesQuery);
  
      if (!querySnapshot.empty) {
        const courseDocRef = querySnapshot.docs[0].ref;
        await deleteDoc(courseDocRef);
  
        set((state) => {
          const newVideos = { ...state.videos };
          const newTests = { ...state.tests };
          const newMaterials = { ...state.materials };
  
          // Remove the course data completely
          delete newVideos[idValue];
          delete newTests[idValue];
          delete newMaterials[idValue];
  
          return {
            courses: state.courses.filter((c) => c.id !== idValue),
            videos: newVideos,
            tests: newTests,
            materials: newMaterials,
            loading: false,
          };
        });
  
        console.log(`Successfully deleted course with id field value: ${idValue}`);
      } else {
        console.log(`No course found with id field value: ${idValue}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  addVideo: async (courseId, video) => {
    set({ loading: true });
    try {
      const docRef = await addDoc(collection(db, 'videos'), { ...video, courseId });
      const docSnapshot = await getDoc(docRef);
      const newVideo = { id: docSnapshot.id, ...docSnapshot.data() } as Video;

      set(state => ({
        videos: {
          ...state.videos,
          [courseId]: [...(state.videos[courseId] || []), newVideo]
        },
        loading: false
      }));

      console.log(`Successfully added video to course with courseId: ${courseId}`);
    } catch (error) {
      console.error('Error adding video:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateVideo: async (courseId, videoIdValue, video) => {
    set({ loading: true });
    try {
      const videosQuery = query(
        collection(db, 'videos'),
        where('id', '==', videoIdValue),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(videosQuery);

      if (!querySnapshot.empty) {
        const videoDocRef = querySnapshot.docs[0].ref;
        await updateDoc(videoDocRef, video);

        set(state => ({
          videos: {
            ...state.videos,
            [courseId]: state.videos[courseId].map(v => 
              v.id === videoIdValue ? { ...v, ...video } : v
            )
          },
          loading: false
        }));

        console.log(`Successfully updated video with id field value: ${videoIdValue} for course with courseId: ${courseId}`);
      } else {
        console.log(`No video found with id field value: ${videoIdValue} for course with courseId: ${courseId}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error updating video:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteVideo: async (courseId, videoIdValue) => {
    set({ loading: true });
    try {
      const videosQuery = query(
        collection(db, 'videos'),
        where('id', '==', videoIdValue),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(videosQuery);

      if (!querySnapshot.empty) {
        const videoDocRef = querySnapshot.docs[0].ref;
        await deleteDoc(videoDocRef);

        set(state => ({
          videos: {
            ...state.videos,
            [courseId]: state.videos[courseId].filter(v => v.id !== videoIdValue)
          },
          loading: false
        }));

        console.log(`Successfully deleted video with id field value: ${videoIdValue} for course with courseId: ${courseId}`);
      } else {
        console.log(`No video found with id field value: ${videoIdValue} for course with courseId: ${courseId}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      set({ loading: false });
      throw error;
    }
  },

  addTest: async (courseId, test) => {
    set({ loading: true });
    try {
      const docRef = await addDoc(collection(db, 'tests'), { ...test, courseId });
      const docSnapshot = await getDoc(docRef);
      const newTest = { id: docSnapshot.id, ...docSnapshot.data() } as Test;

      set(state => ({
        tests: {
          ...state.tests,
          [courseId]: [...(state.tests[courseId] || []), newTest]
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error adding test:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateTest: async (courseId, testIdValue, test) => {
    set({ loading: true });
    try {
      const testsQuery = query(
        collection(db, 'tests'),
        where('id', '==', testIdValue),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(testsQuery);

      if (!querySnapshot.empty) {
        const testDocRef = querySnapshot.docs[0].ref;
        const existingData = querySnapshot.docs[0].data();

        const updateData = {
          ...existingData,
          ...test,
          questions: test.questions ?? existingData.questions,
        };

        await updateDoc(testDocRef, updateData);

        set(state => ({
          tests: {
            ...state.tests,
            [courseId]: state.tests[courseId].map(t => 
              t.id === testIdValue ? { ...t, ...updateData } : t
            )
          },
          loading: false
        }));

        console.log(`Successfully updated test with id field value: ${testIdValue} for course with courseId: ${courseId}`);
      } else {
        console.log(`No test found with id field value: ${testIdValue} for course with courseId: ${courseId}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error updating test:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteTest: async (courseId, testIdValue) => {
    set({ loading: true });
    try {
      const testsQuery = query(
        collection(db, 'tests'),
        where('id', '==', testIdValue),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(testsQuery);

      if (!querySnapshot.empty) {
        const testDocRef = querySnapshot.docs[0].ref;
        await deleteDoc(testDocRef);

        set(state => ({
          tests: {
            ...state.tests,
            [courseId]: state.tests[courseId].filter(t => t.id !== testIdValue)
          },
          loading: false
        }));

        console.log(`Successfully deleted test with id field value: ${testIdValue} for course with courseId: ${courseId}`);
      } else {
        console.log(`No test found with id field value: ${testIdValue} for course with courseId: ${courseId}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      set({ loading: false });
      throw error;
    }
  },

  addMaterial: async (courseId, material) => {
    set({ loading: true });
    try {
      const materialData = {
        ...material,
        courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'materials'), materialData);
      const docSnapshot = await getDoc(docRef);
      const newMaterial = { id: docSnapshot.id, ...docSnapshot.data() } as Material;

      set(state => ({
        materials: {
          ...state.materials,
          [courseId]: [...(state.materials[courseId] || []), newMaterial]
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error adding material:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateMaterial: async (courseId, materialIdValue, material) => {
    set({ loading: true });
    try {
      const materialsQuery = query(
        collection(db, 'materials'),
        where('id', '==', materialIdValue),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(materialsQuery);

      if (!querySnapshot.empty) {
        const materialDocRef = querySnapshot.docs[0].ref;
        const updateData = {
          ...material,
          updatedAt: new Date().toISOString()
        };

        await updateDoc(materialDocRef, updateData);

        set(state => ({
          materials: {
            ...state.materials,
            [courseId]: state.materials[courseId].map(m => 
              m.id === materialIdValue ? { ...m, ...updateData } : m
            )
          },
          loading: false
        }));

        console.log(`Successfully updated material with id field value: ${materialIdValue} for course with courseId: ${courseId}`);
      } else {
        console.log(`No material found with id field value: ${materialIdValue} for course with courseId: ${courseId}`);
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error updating material:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteMaterial: async (courseId: string, materialId: string) => {
    set({ loading: true });
    try {
      const materialsRef = collection(db, 'materials');
      
      const q = query(
        materialsRef, 
        where('id', '==', materialId),
        where('courseId', '==', courseId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Material not found');
      }
      
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(docToDelete.ref);
      
      set(state => ({
        materials: {
          ...state.materials,
          [courseId]: state.materials[courseId].filter(m => m.id !== materialId)
        },
        loading: false
      }));
  
      console.log(`Successfully deleted material with ID: ${materialId} from course: ${courseId}`);
    } catch (error) {
      console.error('Error deleting material:', error);
      set({ loading: false });
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