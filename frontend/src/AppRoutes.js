import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import UnifiedLogin from './pages/UnifiedLogin';

// Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Student Pages
import StudentProfile from './pages/student/StudentProfile';
import StudentViolations from './pages/student/StudentViolations';
import StudentCertificates from './pages/student/StudentCertificates';
import ViewTeachers from './pages/student/ViewTeachers';
import StudentDetail from './pages/student/StudentDetail';
import ViolationDetail from './pages/student/ViolationDetail';

// Teacher Pages
import TeacherProfile from './pages/teacher/TeacherProfile';
import CapstoneManagement from './pages/teacher/CapstoneManagement';
import AdvisoryStudents from './pages/teacher/AdvisoryStudents';
import ViewStudents from './pages/teacher/ViewStudents';
import TeacherDetail from './pages/teacher/TeacherDetail';

// Admin Pages
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageViolations from './pages/admin/ManageViolations';
import SystemLogs from './pages/admin/SystemLogs';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const role = user?.role;
    switch (role) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><UnifiedLogin /></PublicRoute>} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Layout role="student" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="violations" element={<StudentViolations />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="teachers" element={<ViewTeachers />} />
        <Route path="teacher/:teacherId" element={<TeacherDetail />} />
        <Route path="violation/:violationId" element={<ViolationDetail />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <Layout role="teacher" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="capstone" element={<CapstoneManagement />} />
        <Route path="advisory" element={<AdvisoryStudents />} />
        <Route path="students" element={<ViewStudents />} />
        <Route path="student/:studentId" element={<StudentDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout role="admin" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="violations" element={<ManageViolations />} />
        <Route path="logs" element={<SystemLogs />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="student/:studentId" element={<StudentDetail />} />
        <Route path="teacher/:teacherId" element={<TeacherDetail />} />
        <Route path="violation/:violationId" element={<ViolationDetail />} />
      </Route>

      {/* Catch all - redirect to unified login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
