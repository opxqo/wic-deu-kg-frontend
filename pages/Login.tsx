
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUser } from '../UserContext';
import authService from '../services/authService';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // 注册表单额外字段
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // 激活验证码相关
  const [showActivation, setShowActivation] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationEmail, setActivationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      if (isLogin) {
        // 登录流程
        const result = await authService.login({ studentId, password });
        
        // 保存令牌和用户信息到本地存储
        authService.saveAuth(result.data.token, result.data.user);
        
        // 更新 Context 中的用户状态
        login({
          name: result.data.user.name,
          id: result.data.user.studentId,
          email: result.data.user.email,
          department: result.data.user.department,
          major: result.data.user.major,
          bio: result.data.user.bio,
          avatar: result.data.user.avatar,
          joinDate: result.data.user.createdAt,
        });
        
        navigate('/profile');
      } else {
        // 注册流程
        await authService.register({
          studentId,
          username,
          password,
          name,
          email: email || undefined,
        });
        
        // 注册成功，显示激活验证码输入界面
        setActivationEmail(email);
        setShowActivation(true);
        setSuccessMessage('注册成功！验证码已发送到您的邮箱，请输入验证码激活账号');
        // 清空注册表单
        setUsername('');
        setName('');
        setPassword('');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : (isLogin ? '登录失败，请重试' : '注册失败，请重试'));
    } finally {
      setIsLoading(false);
    }
  };

  // 激活账号
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await authService.activateAccount(activationEmail, activationCode);
      setSuccessMessage('账号激活成功！请登录');
      setShowActivation(false);
      setActivationCode('');
      setActivationEmail('');
      setEmail('');
      setStudentId('');
      // 切换到登录页面
      setIsLogin(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '激活失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 重新发送验证码
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await authService.resendActivationCode(activationEmail);
      setSuccessMessage('验证码已重新发送到您的邮箱');
      // 开始60秒倒计时
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 返回注册页面
  const handleBackToRegister = () => {
    setShowActivation(false);
    setActivationCode('');
    setSuccessMessage('');
    setErrorMessage('');
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
                {/* 激活验证码界面 */}
                {showActivation ? (
                  <>
                    <div className="text-center mb-10 md:text-left">
                       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">激活账号</h1>
                       <p className="text-gray-500 dark:text-gray-400">
                           验证码已发送到 {activationEmail}
                       </p>
                    </div>

                    <form onSubmit={handleActivate} className="space-y-5">
                       {/* 成功提示 */}
                       {successMessage && (
                         <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm"
                         >
                           {successMessage}
                         </motion.div>
                       )}

                       {/* 错误提示 */}
                       {errorMessage && (
                         <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                         >
                           {errorMessage}
                         </motion.div>
                       )}

                       {/* 验证码输入 */}
                       <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">验证码</label>
                          <div className="relative group">
                              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                              <input 
                                type="text" 
                                placeholder="请输入6位验证码" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white text-center text-2xl tracking-[0.3em]" 
                                required
                                maxLength={6}
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ''))}/>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">验证码有效期为10分钟</p>
                       </div>

                       <button 
                         disabled={isLoading || activationCode.length !== 6}
                         className="w-full bg-wic-primary hover:bg-wic-secondary text-white font-bold py-4 rounded-xl transition-all transform hover:shadow-lg hover:shadow-wic-primary/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                       >
                         {isLoading ? <Loader2 className="animate-spin" size={20} /> : '激活账号'}
                         {!isLoading && <ArrowRight size={20} />}
                       </button>
                    </form>

                    <div className="mt-6 flex flex-col gap-3">
                       <button 
                         onClick={handleResendCode}
                         disabled={isLoading || resendCooldown > 0}
                         className="text-wic-primary hover:text-wic-secondary font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                       >
                         {resendCooldown > 0 ? `重新发送验证码 (${resendCooldown}s)` : '重新发送验证码'}
                       </button>
                       <button 
                         onClick={handleBackToRegister}
                         className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                       >
                         返回注册
                       </button>
                    </div>
                  </>
                ) : (
                  <>
                <div className="text-center mb-10 md:text-left">
                   <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{isLogin ? t('login.title.login') : t('login.title.register')}</h1>
                   <p className="text-gray-500 dark:text-gray-400">
                       {isLogin ? t('login.subtitle.login') : t('login.subtitle.register')}
                   </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                   <AnimatePresence initial={false}>
                       {/* Register only fields */}
                       {!isLogin && (
                         <>
                           {/* 真实姓名 */}
                           <motion.div 
                              initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              className="overflow-hidden"
                           >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('login.label.name')}</label>
                              <div className="relative group">
                                  <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                                  <input 
                                      type="text" 
                                      placeholder="e.g. 张三" 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" 
                                      required={!isLogin}
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                  />
                              </div>
                           </motion.div>

                           {/* 用户名 */}
                           <motion.div 
                              initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              className="overflow-hidden"
                           >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">用户名</label>
                              <div className="relative group">
                                  <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                                  <input 
                                      type="text" 
                                      placeholder="e.g. zhangsan" 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" 
                                      required={!isLogin}
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                  />
                              </div>
                           </motion.div>

                           {/* 邮箱 */}
                           <motion.div 
                              initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              className="overflow-hidden"
                           >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">邮箱（用于激活账号）</label>
                              <div className="relative group">
                                  <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={20} />
                                  <input 
                                      type="email" 
                                      placeholder="e.g. zhangsan@wic.edu.kg" 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-wic-primary/20 focus:border-wic-primary outline-none transition-all placeholder:text-gray-400 dark:text-white" 
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                  />
                              </div>
                           </motion.div>
                         </>
                       )}
                   </AnimatePresence>

                   {/* 成功提示 */}
                   {successMessage && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm"
                     >
                       {successMessage}
                     </motion.div>
                   )}

                   {/* 错误提示 */}
                   {errorMessage && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                     >
                       {errorMessage}
                     </motion.div>
                   )}

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
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                  </>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Login;
