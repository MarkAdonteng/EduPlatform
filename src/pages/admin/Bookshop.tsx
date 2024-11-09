import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';

interface BookshopProps {
  onEdit: (book: any) => void;
  onDelete: (id: string, type: string, title: string) => void;
}

function AdminBookshop({ onEdit, onDelete }: BookshopProps) {
  const { books, loading } = useBookStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium text-lg">{book.title}</h3>
            <p className="text-sm text-gray-500">by {book.author}</p>
            <p className="mt-2 text-gray-600">{book.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-bold text-indigo-600">${book.price}</p>
                <p className="text-sm text-gray-500">{book.stock} in stock</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(book.id, 'bookshop', book.title)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {books.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p>No books available. Click "Add New" to add books.</p>
        </div>
      )}
    </div>
  );
}

export default AdminBookshop;