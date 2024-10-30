import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Video, TestTube } from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';
import { motion } from 'framer-motion';

function StudentDashboard() {
  const navigate = useNavigate();
  const { courses } = useCourseStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold text-center px-4">{course.title}</h3>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-gray-600 line-clamp-2">{course.description}</p>
              
              <div className="flex justify-between">
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Video className="h-5 w-5" />
                  <span>Videos</span>
                </button>
                
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <TestTube className="h-5 w-5" />
                  <span>Tests</span>
                </button>
                
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Book className="h-5 w-5" />
                  <span>Materials</span>
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