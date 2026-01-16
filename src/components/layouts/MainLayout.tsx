import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Campus Share. All rights reserved.</p>
      </footer>
    </div>
  );
}
