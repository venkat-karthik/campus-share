import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ZonesPage from './pages/ZonesPage';
import ShareZonePage from './pages/ShareZonePage';
import ReceiveZonePage from './pages/ReceiveZonePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AttendancePage from './pages/AttendancePage';
import LostFoundPage from './pages/LostFoundPage';
import ClubsPage from './pages/ClubsPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/layouts/MainLayout';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    element: <RegisterPage />,
    visible: false,
  },
  {
    name: 'Main',
    path: '/',
    element: <MainLayout />,
    visible: false,
  },
  {
    name: 'Zones',
    path: '/zones',
    element: <ZonesPage />,
  },
  {
    name: 'Share Zone',
    path: '/share-zone/:zone',
    element: <ShareZonePage />,
    visible: false,
  },
  {
    name: 'Receive Zone',
    path: '/receive-zone/:zone',
    element: <ReceiveZonePage />,
    visible: false,
  },
  {
    name: 'Announcements',
    path: '/announcements',
    element: <AnnouncementsPage />,
  },
  {
    name: 'Attendance',
    path: '/attendance',
    element: <AttendancePage />,
  },
  {
    name: 'Lost & Found',
    path: '/lost-found',
    element: <LostFoundPage />,
  },
  {
    name: 'Clubs',
    path: '/clubs',
    element: <ClubsPage />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
];

export default routes;
