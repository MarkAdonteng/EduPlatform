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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Courses</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
              className="w-full h-28 sm:h-36 md:h-48 object-cover cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            />

            <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 line-clamp-1">
                {course.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {course.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center justify-start space-x-1 text-indigo-600 hover:text-indigo-800"
                >
                  <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Videos</span>
                </button>

                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center justify-start space-x-1 text-indigo-600 hover:text-indigo-800"
                >
                  <TestTube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Tests</span>
                </button>

                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center justify-start space-x-1 text-indigo-600 hover:text-indigo-800"
                >
                  <Book className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Materials</span>
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