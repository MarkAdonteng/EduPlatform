import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course, Video, Material, Test } from '../types';

export const getCourses = async (): Promise<Course[]> => {
  const coursesRef = collection(db, 'courses');
  const snapshot = await getDocs(coursesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const courseRef = doc(db, 'courses', id);
  const courseDoc = await getDoc(courseRef);
  return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } as Course : null;
};

export const getCourseVideos = async (courseId: string): Promise<Video[]> => {
  const videosRef = collection(db, 'videos');
  const q = query(videosRef, where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
};

export const getCourseMaterials = async (courseId: string): Promise<Material[]> => {
  const materialsRef = collection(db, 'materials');
  const q = query(materialsRef, where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
};

export const getCourseTests = async (courseId: string): Promise<Test[]> => {
  const testsRef = collection(db, 'tests');
  const q = query(testsRef, where('courseId', '==', courseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
};