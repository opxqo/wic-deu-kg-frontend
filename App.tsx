import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import About from './pages/About';
import Chat from './pages/Chat';
import Food from './pages/Food';
import FoodDetail from './pages/FoodDetail';
import Library from './pages/Library';
import Seniors from './pages/Seniors';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import DepartmentManagement from './pages/Admin/DepartmentManagement';
import MessageManagement from './pages/Admin/MessageManagement';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { UserProvider } from './UserContext';
import { MobileMenuProvider } from './context/MobileMenuContext';
import MeteorEffect from './components/MeteorEffect';
import { Toaster } from "@/components/ui/toaster";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isSeniorsPage = location.pathname === '/seniors';
  const isAdminPage = location.pathname.startsWith('/admin');
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-wic-bg dark:bg-slate-950 text-wic-text dark:text-gray-100 font-sans selection:bg-wic-primary selection:text-white transition-colors duration-300 relative">
      {theme === 'dark' && <MeteorEffect />}
      {!isAdminPage && <Navbar />}
      <main className={`flex-grow ${(isChatPage || isAdminPage) ? '' : 'pt-16'} ${(isChatPage || isAdminPage) ? 'h-screen overflow-hidden' : ''} relative z-10`}>
        {children}
      </main>
      {(!isChatPage && !isSeniorsPage && !isAdminPage) && <Footer />}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const handleLoadingFinished = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onFinished={handleLoadingFinished} />;
  }

  return (
    <LanguageProvider>
      <UserProvider>
        <MobileMenuProvider>
          <HashRouter>
            <ScrollToTop />
            <Layout>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/food" element={<Food />} />
                  <Route path="/food/:id" element={<FoodDetail />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/seniors" element={<Seniors />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/user/:id" element={<UserProfile />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="departments" element={<DepartmentManagement />} />
                      <Route path="messages" element={<MessageManagement />} />
                    </Route>
                  </Route>
                </Routes>
              </AnimatePresence>
            </Layout>
          </HashRouter>
        </MobileMenuProvider>
      </UserProvider>
    </LanguageProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;