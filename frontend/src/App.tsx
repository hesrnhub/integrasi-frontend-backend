import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Navbar } from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import StallDetailPage from './pages/StallDetailPage';
import StallFormPage from './pages/StallFormPage';
import StallListPage from './pages/StallListPage';
import { ForbiddenPage, NotFoundPage } from './pages/StatusPages';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Publik */}
          <Route path="/" element={<StallListPage />} />
          <Route path="/stalls/:id" element={<StallDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* Perlu login */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Perlu login + role owner/admin */}
          <Route path="/stalls/new" element={<ProtectedRoute roles={['owner', 'admin']}><StallFormPage /></ProtectedRoute>} />
          <Route path="/stalls/:id/edit" element={<ProtectedRoute roles={['owner', 'admin']}><StallFormPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
