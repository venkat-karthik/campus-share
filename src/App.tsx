import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import IntersectObserver from '@/components/common/IntersectObserver';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/query-client';

// Lazy load pages
const MainLayout = lazy(() => import('@/components/layouts/MainLayout'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ZonesPage = lazy(() => import('@/pages/ZonesPage'));
const ShareZonePage = lazy(() => import('@/pages/ShareZonePage'));
const ReceiveZonePage = lazy(() => import('@/pages/ReceiveZonePage'));
const AnnouncementsPage = lazy(() => import('@/pages/AnnouncementsPage'));
const AttendancePage = lazy(() => import('@/pages/AttendancePage'));
const LostFoundPage = lazy(() => import('@/pages/LostFoundPage'));
const ClubsPage = lazy(() => import('@/pages/ClubsPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <RouteGuard>
              <IntersectObserver />
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
              <Toaster />
            </RouteGuard>
          </AuthProvider>
        </Router>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
