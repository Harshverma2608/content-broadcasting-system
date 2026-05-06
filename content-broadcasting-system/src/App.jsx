import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UploadContent from './pages/teacher/UploadContent';
import MyContent from './pages/teacher/MyContent';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import PendingApprovals from './pages/principal/PendingApprovals';
import AllContent from './pages/principal/AllContent';
import LivePage from './pages/LivePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/live/:teacherId" element={<LivePage />} />

          {/* Teacher routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/upload"
            element={
              <ProtectedRoute role="teacher">
                <UploadContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/my-content"
            element={
              <ProtectedRoute role="teacher">
                <MyContent />
              </ProtectedRoute>
            }
          />

          {/* Principal routes */}
          <Route
            path="/principal/dashboard"
            element={
              <ProtectedRoute role="principal">
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/pending"
            element={
              <ProtectedRoute role="principal">
                <PendingApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/principal/all-content"
            element={
              <ProtectedRoute role="principal">
                <AllContent />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}
