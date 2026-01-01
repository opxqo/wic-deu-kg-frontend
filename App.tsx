import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import PageLoader from './components/PageLoader';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { UserProvider, useUser } from './UserContext';
import { MobileMenuProvider } from './context/MobileMenuContext';
import MeteorEffect from './components/MeteorEffect';
import { Toaster } from "@/components/ui/toaster";
import { ConfigProvider, useConfig } from './context/ConfigContext';
import MaintenanceScreen from './components/MaintenanceScreen';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Article = React.lazy(() => import('./pages/Article'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Food = React.lazy(() => import('./pages/Food'));
const FoodDetail = React.lazy(() => import('./pages/FoodDetail'));
const Library = React.lazy(() => import('./pages/Library'));
const Seniors = React.lazy(() => import('./pages/Seniors'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Login = React.lazy(() => import('./pages/Login'));
const Profile = React.lazy(() => import('./pages/Profile'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const MessageTest = React.lazy(() => import('./pages/MessageTest'));

// Admin pages & components
const AdminRoute = React.lazy(() => import('./components/AdminRoute'));
const AdminLayout = React.lazy(() => import('./pages/Admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/Admin/Dashboard'));
const UserManagement = React.lazy(() => import('./pages/Admin/UserManagement'));
const DepartmentManagement = React.lazy(() => import('./pages/Admin/DepartmentManagement'));
const MessageManagement = React.lazy(() => import('./pages/Admin/MessageManagement'));
const ArticleManagement = React.lazy(() => import('./pages/Admin/ArticleManagement'));
const DatabaseBackup = React.lazy(() => import('./pages/Admin/DatabaseBackup'));
const Settings = React.lazy(() => import('./pages/Admin/Settings'));

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

// Main Routing Configuration
const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
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
        <Route path="/test/messages" element={<MessageTest />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="messages" element={<MessageManagement />} />
            <Route path="articles" element={<ArticleManagement />} />
            <Route path="database" element={<DatabaseBackup />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/article/:id" element={<Article />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </React.Suspense>
  );
};

// Application Content Logic (Maintenance Mode & Layout)
const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { config, loading: configLoading } = useConfig();
  const { user } = useUser();
  const location = useLocation();

  const handleLoadingFinished = () => {
    setLoading(false);
  };

  if (loading || configLoading) {
    return <LoadingScreen onFinished={handleLoadingFinished} />;
  }

  // Maintenance Mode Logic
  // Show maintenance screen if:
  // 1. Maintenance mode is ON
  // 2. User is NOT an admin (role=2) AND NOT an organizer (role=1)
  // 3. Current path is NOT /login (allow access to login page)

  // Convert role to number to be safe (in case API/Storage returns string)
  const userRole = user ? Number(user.role) : 0;
  // Allow Admin (2) and Organizer (1)
  const isPrivilegedUser = userRole === 1 || userRole === 2;

  const isMaintenance = config.maintenanceMode && !isPrivilegedUser;
  const isLoginPage = location.pathname === '/login';

  if (isMaintenance && !isLoginPage) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <Layout>
        <AnimatePresence mode="wait">
          <AppRoutes />
        </AnimatePresence>
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <MobileMenuProvider>
              <HashRouter>
                <AppContent />
                <Toaster />
              </HashRouter>
            </MobileMenuProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;