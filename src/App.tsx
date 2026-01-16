import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ZonesPage from '@/pages/ZonesPage';
import ShareZonePage from '@/pages/ShareZonePage';
import ReceiveZonePage from '@/pages/ReceiveZonePage';
import AnnouncementsPage from '@/pages/AnnouncementsPage';
import AttendancePage from '@/pages/AttendancePage';
import LostFoundPage from '@/pages/LostFoundPage';
import ClubsPage from '@/pages/ClubsPage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <IntersectObserver />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/zones" replace />} />
              <Route path="zones" element={<ZonesPage />} />
              <Route path="share-zone/:zone" element={<ShareZonePage />} />
              <Route path="receive-zone/:zone" element={<ReceiveZonePage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="lost-found" element={<LostFoundPage />} />
              <Route path="clubs" element={<ClubsPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
