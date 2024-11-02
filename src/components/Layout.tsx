import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, GraduationCap, LogOut, User, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const NavItems = () => (
    <>
      {user?.role === 'student' && (
        <button
          onClick={() => {
            navigate('/bookshop');
            setIsMenuOpen(false);
          }}
          className="flex items-center space-x-2 hover:text-indigo-200"
        >
          <BookOpen className="h-5 w-5" />
          <span>Bookshop</span>
        </button>
      )}
      
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5" />
        <span>{user?.username}</span>
      </div>
      
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 hover:text-indigo-200"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title - Always visible */}
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8" />
              <div className="grid">
                <span className="ml-2 text-xl font-bold truncate">Tayron Educational</span>
                <p className="ml-3 font-bold text-lg">Express</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavItems />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-indigo-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-indigo-500">
              <div className="flex flex-col space-y-4 items-start">
                <NavItems />
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;