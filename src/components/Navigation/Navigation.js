import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Trophy, 
  Users, 
  Target, 
  BarChart3, 
  Settings, 
  Calendar,
  Award,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Trophy, description: 'Overview & Stats' },
    { name: 'Contestants', path: '/contestants', icon: Users, description: 'Season 49 Cast' },
    { name: 'Draft', path: '/draft', icon: Target, description: 'Rank & Pick' },
    { name: 'Episodes', path: '/episodes', icon: Calendar, description: 'Episode Results' },
  ];

  // Add admin navigation if user is admin
  const adminItems = user?.isAdmin ? [
    { name: 'Admin', path: '/admin', icon: Settings, description: 'Admin Panel', admin: true }
  ] : [];

  const allItems = [...navigationItems, ...adminItems];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-survivor-orange mr-3" />
              <Link to="/dashboard" className="text-xl font-bold text-gray-900 hover:text-survivor-orange transition-colors">
                Survivor Fantasy League
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {allItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'text-survivor-orange bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${item.admin ? 'border-l-2 border-survivor-orange pl-2 ml-2' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden md:block">
                Welcome, {user?.firstName || user?.username}!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-sm">
          <div className="px-4 py-2 space-y-1">
            {allItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-survivor-orange bg-orange-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${item.admin ? 'border-l-4 border-survivor-orange' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
