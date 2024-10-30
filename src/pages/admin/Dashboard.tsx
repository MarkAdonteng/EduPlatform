import React, { useState } from 'react';
import { PlusCircle, Book, Video, TestTube, Users, X, FileText, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Video {
  id: string;
  title: string;
  courseId: string;
  url: string;
  description: string;
}

interface Test {
  id: string;
  title: string;
  courseId: string;
  questions: Question[];
}

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Note {
  id: string;
  title: string;
  courseId: string;
  content: string;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [questions, setQuestions] = useState<Question[]>([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    switch (activeTab) {
      case 'users':
        const newUser = {
          id: crypto.randomUUID(),
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as string,
        };
        setUsers([...users, newUser]);
        break;

      case 'courses':
        const newCourse = {
          id: crypto.randomUUID(),
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          imageUrl: formData.get('imageUrl') as string,
        };
        setCourses([...courses, newCourse]);
        break;

      case 'videos':
        const newVideo = {
          id: crypto.randomUUID(),
          title: formData.get('title') as string,
          courseId: formData.get('courseId') as string,
          url: formData.get('url') as string,
          description: formData.get('description') as string,
        };
        setVideos([...videos, newVideo]);
        break;

      case 'tests':
        const newTest = {
          id: crypto.randomUUID(),
          title: formData.get('title') as string,
          courseId: formData.get('courseId') as string,
          questions: questions,
        };
        setTests([...tests, newTest]);
        break;

      case 'notes':
        const newNote = {
          id: crypto.randomUUID(),
          title: formData.get('title') as string,
          courseId: formData.get('courseId') as string,
          content: formData.get('content') as string,
        };
        setNotes([...notes, newNote]);
        break;
    }

    setShowModal(false);
    setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions];
    if (field === 'text') {
      newQuestions[index].text = value as string;
    } else if (field === 'correctAnswer') {
      newQuestions[index].correctAnswer = value as number;
    } else {
      const optionIndex = parseInt(field);
      newQuestions[index].options[optionIndex] = value as string;
    }
    setQuestions(newQuestions);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email} - {user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'courses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-4 rounded-lg shadow">
                <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'videos':
        return (
          <div className="grid grid-cols-1 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.description}</p>
                <div className="mt-2">
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                    Watch Video
                  </a>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'tests':
        return (
          <div className="grid grid-cols-1 gap-4">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium">{test.title}</h3>
                <p className="text-sm text-gray-500">{test.questions.length} questions</p>
                <div className="mt-4 space-y-2">
                  {test.questions.map((question, index) => (
                    <div key={index} className="pl-4 border-l-2 border-gray-200">
                      <p className="font-medium">{question.text}</p>
                      <div className="ml-4 text-sm text-gray-600">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={optIndex === question.correctAnswer ? 'text-green-600' : ''}>
                            {optIndex + 1}. {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'notes':
        return (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium">{note.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{note.content}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        );

      case 'videos':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Video Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course</label>
              <select
                id="courseId"
                name="courseId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">Video URL</label>
              <input
                type="url"
                id="url"
                name="url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        );

      case 'tests':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Test Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course</label>
              <select
                id="courseId"
                name="courseId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Questions</h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Add Question
                </button>
              </div>
              
              {questions.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question {qIndex + 1}</label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter question text"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleQuestionChange(qIndex, oIndex.toString(), e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          required
                        />
                        <label className="text-sm text-gray-600">Correct</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Note Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course</label>
              <select
                id="courseId"
                name="courseId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                id="content"
                name="content"
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        );
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: Book },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'tests', label: 'Tests', icon: TestTube },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add New</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-4 text-center border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New {activeTab.slice(0, -1)}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {renderForm()}
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;