import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: LifeBuoy, label: 'Support', path: '/support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-lg shadow-lg transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static z-50`}>
        <div className="h-full flex flex-col pt-16 px-4">
          <div className="flex items-center gap-2 px-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OrbeeAI
            </span>
          </div>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-lg shadow-sm fixed w-full lg:static z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
                <img
                  className="h-8 w-8 rounded-lg"
                  src={`https://ui-avatars.com/api/?name=${user?.email?.split('@')[0]}&background=0D8ABC&color=fff`}
                  alt="User avatar"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 pt-16 lg:pt-0 lg:pl-64 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto bg-white/80 backdrop-blur-lg py-4 px-4 lg:pl-64">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
            <p>All rights reserved @OrbeeAI By @Offerrush</p>
          </div>
        </footer>
      </div>
    </div>
  );
}