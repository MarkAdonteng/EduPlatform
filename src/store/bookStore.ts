import { create } from 'zustand';
import { Book } from '../types';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface BookState {
  books: Book[];
  loading: boolean;
  cart: { [key: string]: number };
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addToCart: (bookId: string) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useBookStore = create<BookState>((set) => ({
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

  addBook: async (bookData) => {
    set({ loading: true });
    try {
      const docRef = await addDoc(collection(db, 'books'), bookData);
      const newBook = { id: docRef.id, ...bookData };
      set(state => ({ 
        books: [...state.books, newBook],
        loading: false 
      }));
    } catch (error) {
      console.error('Error adding book:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    set({ loading: true });
    try {
      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, bookData);
      set(state => ({
        books: state.books.map(book => 
          book.id === id ? { ...book, ...bookData } : book
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating book:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteBook: async (id) => {
    set({ loading: true });
    try {
      await deleteDoc(doc(db, 'books', id));
      set(state => ({
        books: state.books.filter(book => book.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting book:', error);
      set({ loading: false });
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