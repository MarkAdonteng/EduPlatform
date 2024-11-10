/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ShoppingCart as CartIcon} from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import ShoppingCart from '../../components/ShoppingCart';

const Bookshop = () => {
  const [showCart, setShowCart] = useState(false);
  const { books, fetchBooks, loading, cart, addToCart } = useBookStore();
  const [addedToCart, setAddedToCart] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const cartItemsCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  const handleAddToCart = (bookId:any) => {
    addToCart(bookId);
    setAddedToCart(bookId);
    setTimeout(() => setAddedToCart(null), 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-3 px-2 -mx-2 sm:-mx-4 lg:-mx-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 transition-all hover:text-indigo-600">
            Bookshop
          </h1>
          <button
            onClick={() => setShowCart(true)}
            className="group flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full 
                     hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 
                     active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <CartIcon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-12" />
            <span className="font-medium">{cartItemsCount}</span>
          </button>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="group bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md overflow-hidden 
                     transform transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 
                         group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 
                           transition-opacity duration-300 flex items-center justify-center'>
              {/* Floating Add to Cart Button */}
              {book.stock > 0 && (
                <button
                  onClick={() => handleAddToCart(book.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md
                           opacity-0 group-hover:opacity-100 transition-all duration-300
                           hover:bg-indigo-600 hover:text-white transform hover:scale-110
                           ${addedToCart === book.id ? 'animate-bounce' : ''}`}
                >
                     <CartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
              </div>

              {/* Stock Badge */}
              {book.stock === 0 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 
                             transition-colors duration-300 group-hover:text-indigo-600">
                  {book.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 italic line-clamp-1">by {book.author}</p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm sm:text-base font-bold text-indigo-600">
                  GHC {book.price.toFixed(2)}
                </span>

                <span className={`text-xs transition-colors duration-300 
                  ${book.stock > 5 
                    ? 'text-green-600' 
                    : book.stock > 0 
                      ? 'text-orange-500' 
                      : 'text-red-500'
                  }`}>
                  {book.stock === 0 
                    ? 'Unavailable' 
                    : book.stock === 1 
                      ? 'Last copy!' 
                      : `${book.stock} left`}
                </span>
              </div>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-base sm:text-lg font-medium">No books available.</p>
            <p className="text-xs sm:text-sm mt-1">Please check back later!</p>
          </div>
        )}
      </div>

      <ShoppingCart isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

export default Bookshop;