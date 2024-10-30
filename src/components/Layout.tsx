import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, GraduationCap, LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Tayron Educational Express</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'student' && (
                <button
                  onClick={() => navigate('/bookshop')}
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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;