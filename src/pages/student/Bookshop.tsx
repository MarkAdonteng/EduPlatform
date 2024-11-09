import React, { useState, useEffect } from 'react';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import ShoppingCart from '../../components/ShoppingCart';

function Bookshop() {
  const [showCart, setShowCart] = useState(false);
  const { books, fetchBooks, loading, cart, addToCart } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const cartItemsCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bookshop</h1>
        <button
          onClick={() => setShowCart(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <CartIcon className="h-5 w-5" />
          <span>Cart ({cartItemsCount})</span>
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
                
                <button
                  onClick={() => addToCart(book.id)}
                  disabled={book.stock === 0}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
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

      <ShoppingCart isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}

export default Bookshop;