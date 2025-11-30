
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUser } from '../UserContext';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      login(); // Call context login to set mock user
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 md:p-8 transition-colors">
       {/* Card Container */}
       <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 dark:border-gray-700">
          
          {/* Left Side - Image (Hidden on small mobile, visible on desktop) */}
          <div className="hidden md:block w-1/2 relative overflow-hidden group">
             <div className="absolute inset-0 z-10 bg-gradient-to-br from-wic-primary/90 to-wic-secondary/80 mix-blend-multiply transition-opacity duration-700" />
             <img 
               src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop" 
               alt="Campus Library" 
               className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
             />
             
             <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                <div>
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8">
                        <ChevronLeft size={20} />
                        {t('login.back')}
                    </Link>
                    <img src="/logo1.svg" alt="Logo" className="h-10 opacity-90" />
                </div>
                
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login-text" : "register-text"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-4xl font-bold mb-4 leading-tight">
                                {isLogin ? t('login.welcome') : t('login.join')}
                            </h2>
                            <p className="text-lg text-white/90 leading-relaxed max-w-md font-light">
                                {isLogin 
                                    ? t('login.desc.login')
                                    : t('login.desc.register')}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                <div className="text-xs text-white/50">
                    © {new Date().getFullYear()} Wuhan City University
                </div>
             </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-gray-800 relative transition-colors">
             <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-10 md:text-left">
                   <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{isLogin ? t('login.title.login') : t('login.title.register')}</h1>
                   <p className="text-gray-500 dark:text-gray-400">
                       {isLogin ? t('login.subtitle.login') : t('login.subtitle.register')}
                   </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                   <AnimatePresence initial={false}>
                       {/* Name Field (Register only) */}
                       {!isLogin && (
                         <motion.div 
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                         >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('login.label.name')}</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="e.g. Zhang San" 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" 
                                    required={!isLogin}
                                />
                            </div>
                         </motion.div>
                       )}
                   </AnimatePresence>

                   {/* Email/ID */}
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('login.label.id')}</label>
                      <div className="relative group">
                          <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                          <input 
                            type="text" 
                            placeholder={isLogin ? "20210001" : "student@wic.edu.kg"} 
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" 
                            required
                          />
                      </div>
                   </div>

                   {/* Password */}
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('login.label.password')}</label>
                      <div className="relative group">
                          <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" 
                            required
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                      </div>
                   </div>

                   {/* Forgot Password Link */}
                   {isLogin && (
                      <div className="flex justify-end">
                         <a href="#" className="text-sm text-wic-primary hover:text-wic-secondary font-semibold transition-colors">{t('login.forgot')}</a>
                      </div>
                   )}

                   <button 
                     disabled={isLoading}
                     className="w-full bg-wic-primary hover:bg-wic-secondary text-white font-bold py-4 rounded-xl transition-all transform hover:shadow-lg hover:shadow-wic-primary/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                     {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? t('login.btn.login') : t('login.btn.register'))}
                     {!isLoading && <ArrowRight size={20} />}
                   </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
                   <p className="text-gray-500 dark:text-gray-400">
                      {isLogin ? t('login.footer.no_account') : t('login.footer.has_account')}{" "}
                      <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-wic-primary font-bold hover:underline ml-1 inline-flex items-center gap-1 group"
                      >
                        {isLogin ? t('login.footer.link.register') : t('login.footer.link.login')}
                      </button>
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Login;
