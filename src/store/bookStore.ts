import { create } from 'zustand';
import { Book } from '../types';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface BookState {
  books: Book[];
  loading: boolean;
  cart: { [key: string]: number };
  fetchBooks: () => Promise<void>;
  addBook: (book: Book) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addToCart: (bookId: string) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useBookStore = create<BookState>((set, _get) => ({
  books: [],
  loading: false,
  cart: {},

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
  },

  addBook: async (book) => {
    try {
      const docRef = await addDoc(collection(db, 'books'), book);
      const newBook = { ...book, id: docRef.id };
      set(state => ({ books: [...state.books, newBook] }));
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  updateBook: async (id, book) => {
    try {
      await updateDoc(doc(db, 'books', id), book);
      set(state => ({
        books: state.books.map(b => b.id === id ? { ...b, ...book } : b)
      }));
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      await deleteDoc(doc(db, 'books', id));
      set(state => ({
        books: state.books.filter(b => b.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  addToCart: (bookId) => {
    set(state => ({
      cart: {
        ...state.cart,
        [bookId]: (state.cart[bookId] || 0) + 1
      }
    }));
  },

  removeFromCart: (bookId) => {
    set(state => {
      const newCart = { ...state.cart };
      delete newCart[bookId];
      return { cart: newCart };
    });
  },

  updateCartQuantity: (bookId, quantity) => {
    set(state => ({
      cart: {
        ...state.cart,
        [bookId]: quantity
      }
    }));
  },

  clearCart: () => {
    set({ cart: {} });
  }
}));