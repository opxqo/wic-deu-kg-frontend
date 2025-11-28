
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './UserContext';
import { MobileMenuProvider } from './context/MobileMenuContext';

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

  return (
    <div className="min-h-screen flex flex-col bg-wic-bg dark:bg-slate-950 text-wic-text dark:text-gray-100 font-sans selection:bg-wic-primary selection:text-white transition-colors duration-300">
      <Navbar />
      <main className={`flex-grow pt-16 ${isChatPage ? 'h-screen overflow-hidden' : ''}`}>
        {children}
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
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
                  </Routes>
                </AnimatePresence>
              </Layout>
            </HashRouter>
          </MobileMenuProvider>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
