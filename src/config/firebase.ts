import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  collection, 
  addDoc, 
  deleteDoc,
  doc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJ6KEACYglS4ub3t1uhdFb7KjHOGmnX_4",
  authDomain: "eduplatform-df34c.firebaseapp.com",
  projectId: "eduplatform-df34c",
  storageBucket: "eduplatform-df34c.appspot.com",
  messagingSenderId: "263585040602",
  appId: "1:263585040602:web:e84dd8051810d2afdbfde3",
  measurementId: "G-R6Q1N6GR2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('Offline persistence enabled');
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Initialize other Firebase services
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize collections with proper error handling
const initializeCollections = async () => {
  const collections = ['courses', 'videos', 'tests', 'materials', 'books'];
  
  for (const collectionName of collections) {
    try {
      const collectionRef = collection(db, collectionName);
      const dummyDoc = await addDoc(collectionRef, {
        _dummy: true,
        _initialized: true,
        createdAt: new Date().toISOString()
      });
      await deleteDoc(doc(db, collectionName, dummyDoc.id));
      console.log(`Collection ${collectionName} initialized successfully`);
    } catch (error) {
      console.error(`Error initializing collection ${collectionName}:`, error);
    }
  }
};

// Run initialization only if we're in a browser environment
if (typeof window !== 'undefined') {
  initializeCollections().catch((error) => {
    console.error('Error during collections initialization:', error);
  });
}

export { db, auth, storage };
export default app;