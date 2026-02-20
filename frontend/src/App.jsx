import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Bookings from './pages/Bookings';
import UserManagement from './pages/UserManagement';
import { useToast, ToastContainer } from './components/ui';
import { Bell, Search, GraduationCap } from 'lucide-react';

function AppLayout({ children, addToast }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center justify-between px-8 py-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search anything..."
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-[#6366F1] transition-all w-64 placeholder:text-slate-400 text-[#1E293B]"
              />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer bg-transparent border-none group">
                <Bell size={18} className="text-slate-500 group-hover:text-indigo-500 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Divider */}
              <div className="w-px h-8 bg-slate-200" />

              {/* User Avatar */}
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-200/50 group-hover:shadow-lg group-hover:shadow-indigo-300/50 transition-shadow">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">Admin</p>
                  <p className="text-[10px] text-slate-400">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    addToast(`Welcome back, ${user.name}!`, 'success');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <Router>
      <AppLayout addToast={addToast}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard addToast={addToast} />} />
          <Route path="/resources" element={<Resources addToast={addToast} />} />
          <Route path="/bookings" element={<Bookings addToast={addToast} />} />
          <Route path="/users" element={<UserManagement addToast={addToast} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Router>
  );
}