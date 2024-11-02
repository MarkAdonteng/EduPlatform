import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/login';
import AdminDashboard from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import CourseView from './pages/student/CourseView';
import Bookshop from './pages/student/Bookshop';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== allowedRole) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="student">
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/course/:id" element={
          <ProtectedRoute allowedRole="student">
            <Layout>
              <CourseView />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/bookshop" element={
          <ProtectedRoute allowedRole="student">
            <Layout>
              <Bookshop />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;