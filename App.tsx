import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import PageLoader from './components/PageLoader';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { UserProvider } from './UserContext';
import { MobileMenuProvider } from './context/MobileMenuContext';
import MeteorEffect from './components/MeteorEffect';
import { Toaster } from "@/components/ui/toaster";

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
                      </Route>
                    </Route>
                    <Route path="/article/:id" element={<Article />} />
                  </Routes>
                </React.Suspense>
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