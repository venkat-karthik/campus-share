import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen, Users, MapPin, Megaphone, Calendar, Search, Shield, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/zones', label: 'Zones', icon: MapPin },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/attendance', label: 'Attendance', icon: Calendar },
  { path: '/lost-found', label: 'Lost & Found', icon: Search },
  { path: '/clubs', label: 'Clubs', icon: Users },
];

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/zones" className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold gradient-text">Campus Share</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-sm text-muted-foreground">
            Welcome, <strong>{profile?.full_name}</strong>
          </span>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden lg:flex">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <div className="pb-4 border-b">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{profile?.full_name}</p>
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut} className="mt-4">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
