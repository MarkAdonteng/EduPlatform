import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { GraduationCap, LogIn, User, Lock } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate network delay for loading animation
      await new Promise(resolve => setTimeout(resolve, 800));

      if (username === 'admin' && password === 'admin123') {
        setUser({
          id: '1',
          username: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        });
        navigate('/admin');
      } else if (username === 'student' && password === 'student123') {
        setUser({
          id: '2',
          username: 'student',
          role: 'student',
          createdAt: new Date().toISOString()
        });
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600 transform -skew-y-2"></div>
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="transform hover:scale-105 transition-transform duration-300 flex justify-center">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <GraduationCap className="h-16 w-16 text-indigo-600" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to
        </h2>
        <h1 className="mt-2 text-center text-4xl font-black text-indigo-600 animate-pulse">
          Tayron Educational Express
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 transform hover:shadow-3xl transition-all duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">⚠️</div>
                  <div className="ml-3">{error}</div>
                </div>
              </div>
            )}

            <div className="group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  Demo Credentials
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-center">
              <div className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-200">
                <p className="font-semibold text-gray-700">Admin Access</p>
                <p className="text-gray-500">admin / admin123</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors duration-200">
                <p className="font-semibold text-gray-700">Student Access</p>
                <p className="text-gray-500">student / student123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;