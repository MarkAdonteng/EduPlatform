import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useBookStore } from '../store/bookStore';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { books, cart, removeFromCart, updateCartQuantity } = useBookStore();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const cartItems = Object.entries(cart).map(([bookId, quantity]) => {
    const book = books.find(b => b.id === bookId);
    return book ? { ...book, quantity } : null;
  }).filter(Boolean);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item?.price || 0) * (item?.quantity || 0);
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map(item => item && (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-500">GHC {item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold">GHC {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              disabled={cartItems.length === 0}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Checkout Message */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-center mb-4">Notice</h3>
            <p className="text-center text-gray-700">This feature is currently under development. Please check back soon!</p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;
