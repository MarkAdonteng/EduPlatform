import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;