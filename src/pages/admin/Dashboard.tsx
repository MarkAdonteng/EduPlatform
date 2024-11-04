import React, { useState, useEffect } from 'react';
import { PlusCircle, Book, Video, TestTube, X, FileText, Trash2, Edit ,ShoppingBag} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '../../store/courseStore';
import AdminBookshop from './Bookshop';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{
    id: string;
    type: string;
    courseId?: string;
    title?: string;
  } | null>(null);
  const [questions, setQuestions] = useState<{ text: string; options: string[]; correctAnswer: number; }[]>([
    { text: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const { 
    courses, 
    videos, 
    tests, 
    materials, 
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    addVideo,
    updateVideo,
    deleteVideo,
    addTest,
    updateTest,
    deleteTest,
    addMaterial,
    updateMaterial,
    deleteMaterial
  } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const tabs = [
    { id: 'courses', label: 'Courses', icon: Book },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'tests', label: 'Tests', icon: TestTube },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'bookshop', label: 'Bookshop', icon: ShoppingBag },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingItem) {
        switch (activeTab) {
          case 'courses':
            await updateCourse(editingItem.id, {
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              imageUrl: formData.get('imageUrl') as string,
            });
            break;
          case 'videos':
            await updateVideo(selectedCourse, editingItem.id, {
              title: formData.get('title') as string,
              url: formData.get('url') as string,
              description: formData.get('description') as string,
            });
            break;
          case 'tests':
            await updateTest(selectedCourse, editingItem.id, {
              title: formData.get('title') as string,
              questions: JSON.parse(formData.get('questions') as string),
            });
            break;
            case 'materials':
            await updateMaterial(selectedCourse, editingItem.id, {
              title: formData.get('title') as string,
              type: formData.get('type') as 'pdf' | 'doc' | 'ppt' | 'other',
              url: formData.get('url') as string,
              description: formData.get('description') as string,
              updatedAt: new Date().toISOString()
            });
            break;
        }
      } else {
        switch (activeTab) {
          case 'courses':
            await addCourse({
              id: crypto.randomUUID(),
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              imageUrl: formData.get('imageUrl') as string,
              icon: 'book'
            });
            break;
          case 'videos':
            await addVideo(selectedCourse, {
              id: crypto.randomUUID(),
              courseId: selectedCourse,
              title: formData.get('title') as string,
              url: formData.get('url') as string,
              description: formData.get('description') as string,
            });
            break;
          case 'tests':
            await addTest(selectedCourse, {
              id: crypto.randomUUID(),
              courseId: selectedCourse,
              title: formData.get('title') as string,
              questions: questions.map((question, _index) => ({
                ...question,
                id: crypto.randomUUID(), // or you can use `index` if a sequential ID is sufficient
              })),
            });
            break;
            case 'materials':
            await addMaterial(selectedCourse, {
              id: crypto.randomUUID(),
              courseId: selectedCourse,
              title: formData.get('title') as string,
              type: formData.get('type') as 'pdf' | 'doc' | 'ppt' | 'other',
              url: formData.get('url') as string,
              description: formData.get('description') as string,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            break;
        }
      }

      setShowModal(false);
      setEditingItem(null);
      setSelectedFile(null);
      setSelectedCourse(selectedCourse);
      setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

//  const handleDelete = async (id: string, type: string, courseId?: string) => {
//     try {
//       switch (type) {
//         case 'courses':
//           await deleteCourse(id);
//           break;
//         case 'videos':
//           if (courseId) await deleteVideo(courseId, id);
//           break;
//         case 'tests':
//           if (courseId) await deleteTest(courseId, id);
//           break;
//         case 'materials':
//           if (courseId) await deleteMaterial(courseId, id);
//           break;
//         default:
//           console.error(`Unknown type: ${type}`);
//           return;
//       }
//       console.log(`Successfully deleted ${type} with id: ${id}`);
//     } catch (error) {
//       console.error(`Error deleting ${type}:`, error);
//     }
//   };

const handleDelete = (id: string, type: string, courseId?: string, title?: string) => {
  setDeleteInfo({ id, type, courseId, title });
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  if (!deleteInfo) return;

  try {
    switch (deleteInfo.type) {
      case 'courses':
        await deleteCourse(deleteInfo.id);
        break;
      case 'videos':
        if (deleteInfo.courseId) await deleteVideo(deleteInfo.courseId, deleteInfo.id);
        break;
      case 'tests':
        if (deleteInfo.courseId) await deleteTest(deleteInfo.courseId, deleteInfo.id);
        break;
      case 'materials':
        if (deleteInfo.courseId) await deleteMaterial(deleteInfo.courseId, deleteInfo.id);
        break;
    }
  } catch (error) {
    console.error(`Error deleting ${deleteInfo.type}:`, error);
  }
};
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'courses':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
  {courses.map((course) => (
    <div 
      key={course.id} 
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img 
        src={course.imageUrl} 
        alt={course.title} 
        className="w-full h-32 sm:h-40 md:h-48 object-cover" 
      />
      <div className="p-2 sm:p-3 md:p-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-1">
          {course.title}
        </h3>
        <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base line-clamp-2">
          {course.description}
        </p>
        <div className="mt-2 sm:mt-3 md:mt-4 flex justify-end space-x-1 sm:space-x-2">
          <button
            onClick={() => {
              setEditingItem(course);
              setShowModal(true);
            }}
            className="p-1 sm:p-1.5 md:p-2 text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={() => handleDelete(course.id, 'courses')}
            className="p-1 sm:p-1.5 md:p-2 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
        );
        
      case 'videos':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            {selectedCourse && videos[selectedCourse]?.map((video) => (
              <div key={video.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-gray-600 mt-1">{video.description}</p>
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                      Watch Video
                    </a>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(video);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id, 'videos', selectedCourse)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            {selectedCourse && materials[selectedCourse]?.map((material) => (
              <div key={material.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{material.title}</h3>
                    <p className="text-gray-600 mt-1">{material.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Type: {material.type.toUpperCase()}</p>
                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                      Download Material
                    </a>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(material);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id, 'materials', selectedCourse)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'tests':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            {selectedCourse && tests[selectedCourse]?.map((test) => (
              <div key={test.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{test.title}</h3>
                    <p className="text-gray-600 mt-1">{test.questions.length} questions</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(test);
                        setQuestions(test.questions);
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id, 'tests', selectedCourse)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        case 'bookshop':
  return <AdminBookshop/>;
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editingItem?.title}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                defaultValue={editingItem?.description}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                defaultValue={editingItem?.imageUrl}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );

      case 'videos':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                name="courseId"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editingItem?.title}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Video URL</label>
              <input
                type="url"
                name="url"
                defaultValue={editingItem?.url}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                defaultValue={editingItem?.description}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );

        case 'materials':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  name="courseId"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingItem?.title}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  defaultValue={editingItem?.type}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">DOC</option>
                  <option value="ppt">PPT</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Material URL</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingItem?.url}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://example.com/material.pdf"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Enter the direct URL to the material file</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          );
  
      case 'tests':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                name="courseId"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editingItem?.title}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
              {questions.map((question, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].text = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    placeholder="Question text"
                    className="mb-2 w-full"
                  />
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].options[optionIndex] = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1 mr-2"
                      />
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => {
                          const newQuestions = [...questions];
                          newQuestions[index].correctAnswer = optionIndex;
                          setQuestions(newQuestions);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }])}
                className="mt-2 px-4 py-2 bg-gray-100 rounded-md"
              >
                Add Question
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
          <PlusCircle className="h-5 w-5" />
          <span>Add New</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex flex-nowrap px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 1)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          {renderContent()}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {renderForm()}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingItem ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteInfo(null);
        }}
        onConfirm={handleConfirmDelete}
        type={deleteInfo?.type || ''}
        title={deleteInfo?.title}
      />
    </div>
  );
}

export default AdminDashboard;