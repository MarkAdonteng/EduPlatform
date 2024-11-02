import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Video, TestTube } from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';
import { motion } from 'framer-motion';

function StudentDashboard() {
  const navigate = useNavigate();
  const { courses, fetchCourses, loading } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 px-4 sm:px-0">My Courses</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-32 sm:h-48 object-cover cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            />
            
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-between">
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center space-x-1 sm:space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">Videos</span>
                </button>
                
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center space-x-1 sm:space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">Tests</span>
                </button>
                
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center space-x-1 sm:space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Book className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">Materials</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;