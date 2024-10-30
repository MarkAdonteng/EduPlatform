import React from 'react';
import { ShoppingCart } from 'lucide-react';

const books = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    author: 'Dr. John Smith',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80',
    description: 'Comprehensive guide to advanced mathematics concepts',
    stock: 15
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    author: 'Dr. Sarah Johnson',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80',
    description: 'Essential physics concepts explained clearly',
    stock: 20
  },
  // Add more books as needed
];

function Bookshop() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bookshop</h1>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          <ShoppingCart className="h-5 w-5" />
          <span>Cart (0)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              
              <p className="text-gray-700">{book.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-indigo-600">
                  ${book.price}
                </span>
                
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Add to Cart
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                {book.stock} copies available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookshop;