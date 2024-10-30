import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, TestTube, Book, ArrowLeft } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer';
import TestComponent from '../../components/TestComponent';
import MaterialsList from '../../components/MaterialsList';
import { useCourseStore } from '../../store/courseStore';
import { motion } from 'framer-motion';

function CourseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'videos' | 'tests' | 'materials'>('videos');
  const { courses, videos, tests, materials } = useCourseStore();
  
  const course = courses.find(c => c.id === id);
  const courseVideos = videos[id!] || [];
  const courseTests = tests[id!] || [];
  const courseMaterials = materials[id!] || [];

  if (!course) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">Course not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Courses</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'videos'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Videos ({courseVideos.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'tests'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Tests ({courseTests.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'materials'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Book className="h-5 w-5" />
                <span>Materials ({courseMaterials.length})</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {courseVideos.length > 0 ? (
                courseVideos.map((video) => (
                  <VideoPlayer key={video.id} video={video} />
                ))
              ) : (
                <p className="text-center text-gray-500">No videos available for this course yet.</p>
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            courseTests.length > 0 ? (
              <TestComponent courseId={id!} />
            ) : (
              <p className="text-center text-gray-500">No tests available for this course yet.</p>
            )
          )}

          {activeTab === 'materials' && (
            courseMaterials.length > 0 ? (
              <MaterialsList materials={courseMaterials} />
            ) : (
              <p className="text-center text-gray-500">No materials available for this course yet.</p>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CourseView;