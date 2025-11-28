
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, Moon, Sun } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { useUser } from '../UserContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useUser();
  
  const isHome = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20); // Trigger earlier for smoother feel
  });

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.chat'), path: '/chat' },
    { name: t('nav.food'), path: '/food' },
    { name: t('nav.library'), path: '/library' },
  ];

  // Logic: Transparent on Home top, White/Dark on scroll or other pages
  // Force background if mobile menu is open
  const isTransparentState = isHome && !isScrolled && !isMobileMenuOpen;

  const navBackground = isTransparentState 
    ? 'bg-transparent backdrop-blur-none border-transparent shadow-none' 
    : 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-gray-200/20 dark:shadow-black/20';
    
  // Animation states for height and logo
  const navHeight = isTransparentState ? 'h-20' : 'h-16';
  const logoSize = isTransparentState ? 'h-12' : 'h-10';

  // Icon/Text button styling for DESKTOP
  const iconBtnClass = `p-2 rounded-full transition-colors flex items-center gap-1 font-bold text-xs ${
    isTransparentState 
        ? 'text-white hover:bg-white/20' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`;
  
  // Logo URLs
  const logoWhite = "https://r2.wic.edu.kg/images/logo1.png";
  const logoBlack = "https://r2.wic.edu.kg/images/logo2.png";

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${navBackground}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${navHeight}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             {/* Use white logo on transparent background, OR if in dark mode (and not transparent bg but scrolled) */}
             <img 
               src={(isTransparentState || (theme === 'dark' && !isTransparentState)) ? logoWhite : logoBlack} 
               alt="Wuhan City University" 
               className={`${logoSize} w-auto object-contain transition-all duration-500 ease-in-out transform group-hover:scale-105`}
             />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === link.path
                      ? (isTransparentState 
                          ? 'bg-white/20 text-white backdrop-blur-sm shadow-sm' 
                          : 'bg-wic-primary/10 text-wic-primary dark:bg-wic-primary/20 dark:text-wic-accent shadow-sm')
                      : (isTransparentState 
                          ? 'text-white/90 hover:text-white hover:bg-white/10' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-wic-primary hover:bg-gray-50 dark:hover:bg-gray-800')
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User / Action (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
             <button onClick={toggleTheme} className={iconBtnClass}>
               {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             </button>
             
             <button onClick={toggleLanguage} className={iconBtnClass}>
                <Globe size={20} />
                <span>{language === 'zh' ? 'EN' : '中'}</span>
             </button>
             
             {isAuthenticated && user ? (
                 <Link 
                   to="/profile"
                   className={`ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800 border ${
                       isTransparentState ? 'border-white/30 bg-white/10 text-white' : 'border-gray-200 dark:border-gray-700'
                   }`}
                 >
                     <img src={user.avatar} alt="User" className="w-7 h-7 rounded-full object-cover" />
                     <span className={`text-sm font-semibold ${isTransparentState ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                         {user.name.split(' ')[0]}
                     </span>
                 </Link>
             ) : (
                !isLoginPage && (
                    <Link 
                    to="/login"
                    className={`ml-2 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-xl active:scale-95 ${
                        isTransparentState 
                        ? 'bg-white text-wic-primary hover:bg-gray-100' 
                        : 'bg-wic-primary text-white hover:bg-wic-secondary'
                    }`}
                    >
                        <User size={16} />
                        <span>{t('nav.login')}</span>
                    </Link>
                )
             )}
          </div>

          {/* Mobile Right Actions - Glass Capsule Style */}
          <div className="flex md:hidden items-center">
            <div className={`flex items-center gap-1 pl-3 pr-1 py-1.5 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
                isTransparentState 
                    ? 'bg-black/20 border-white/10 text-white' 
                    : 'bg-white/80 border-gray-200 text-gray-600 dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-200'
            }`}>
                {/* 1. Theme Toggle */}
                <button 
                    onClick={toggleTheme} 
                    className={`p-2 rounded-full transition-colors active:scale-95 ${
                        isTransparentState ? 'hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* 2. Divider */}
                <div className={`w-[1px] h-4 mx-0.5 ${
                    isTransparentState ? 'bg-white/20' : 'bg-gray-300 dark:bg-gray-600'
                }`} />

                {/* 3. Language */}
                <button 
                    onClick={toggleLanguage} 
                    className={`p-2 rounded-full transition-colors active:scale-95 flex items-center gap-1 ${
                        isTransparentState ? 'hover:bg-white/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                   <span className="text-[10px] font-bold tracking-wider">{language === 'zh' ? 'EN' : '中'}</span>
                </button>

                {/* 4. Menu Button (High Emphasis) */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="ml-1 p-2 bg-wic-primary text-white rounded-full shadow-md hover:bg-wic-secondary active:scale-90 transition-all"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-4 rounded-md text-base font-medium text-center ${
                      location.pathname === link.path 
                      ? 'text-wic-primary bg-wic-primary/10 dark:bg-wic-primary/20 dark:text-wic-accent' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && user ? (
                   <Link
                   to="/profile"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center justify-center gap-3 w-full mt-4 px-5 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                 >
                    <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full object-cover" />
                    <span>{user.name}</span>
                 </Link>
              ) : (
                !isLoginPage && (
                    <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full mt-4 px-5 py-3 rounded-full bg-wic-primary text-white text-center font-bold shadow-md hover:bg-wic-secondary"
                    >
                        {t('nav.login_register')}
                    </Link>
                )
             )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
