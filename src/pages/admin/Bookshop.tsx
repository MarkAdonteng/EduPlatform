import React, { useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import { Book } from '../../types';

interface AdminBookshopProps {
  onEdit: (book: Book) => void;
  onDelete: (id: string, type: string, title?: string) => void;
}

function AdminBookshop({ onEdit, onDelete }: AdminBookshopProps) {
  const { books, fetchBooks, loading } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
      {books.map((book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
            </div>
            
            <p className="text-gray-700 line-clamp-2">{book.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-indigo-600">
                GHC {book.price}
              </span>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(book.id, 'bookshop', book.title)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              {book.stock} copies available
            </p>
          </div>
        </div>
      ))}

      {books.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p>No books available in the store.</p>
        </div>
      )}
    </div>
  );
}

export default AdminBookshop;