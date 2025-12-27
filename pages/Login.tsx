
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUser } from '../UserContext';
import authService from '../services/authService';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // 登录流程
        const result = await authService.login({ studentId, password });

        if (!result.data || !result.data.user) {
          throw new Error('登录响应格式错误：缺少用户信息');
        }

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
  }, [isLogin, studentId, password, username, name, email, login, navigate]);

  // 激活账号
  const handleActivate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await authService.activateAccount(activationEmail, activationCode);

      if (result.code === 0 && result.data) {
        // 使用返回的激活结果显示更友好的消息
        const activation = result.data;
        setSuccessMessage(
          `账号激活成功！欢迎 ${activation.username}（学号：${activation.studentId}）\n请使用学号和密码登录`
        );
        setShowActivation(false);
        setActivationCode('');
        setActivationEmail('');
        setEmail('');
        setStudentId('');
      } else {
        throw new Error(result.message || '激活失败，请检查验证码是否正确');
      }

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
  }, [activationEmail, activationCode]);

  // 重新发送验证码
  const handleResendCode = useCallback(async () => {
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
  }, [resendCooldown, activationEmail]);

  // 返回注册页面
  const handleBackToRegister = useCallback(() => {
    setShowActivation(false);
    setActivationCode('');
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8 transition-colors">
      {/* Card Container */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 dark:border-gray-800">

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
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 relative transition-colors">
          <div className="max-w-md mx-auto w-full">
            {/* 激活验证码界面 */}
            {showActivation ? (
              <Card className="border-0 shadow-none dark:bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl font-bold">激活账号</CardTitle>
                  <CardDescription>验证码已发送到 {activationEmail}</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleActivate} className="space-y-5">
                    {/* Messages */}
                    {successMessage && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    {/* 验证码输入 */}
                    <div className="space-y-2">
                      <Label>验证码</Label>
                      <div className="flex justify-center py-4">
                        <InputOTP
                          maxLength={6}
                          value={activationCode}
                          onChange={(value) => setActivationCode(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">验证码有效期为10分钟</p>
                    </div>

                    <Button
                      disabled={isLoading || activationCode.length !== 6}
                      className="w-full bg-wic-primary hover:bg-wic-secondary h-12 text-base"
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                      激活账号
                      {!isLoading && <ArrowRight className="ml-2" size={20} />}
                    </Button>
                  </form>

                  <div className="mt-6 flex flex-col gap-3">
                    <Button
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={isLoading || resendCooldown > 0}
                      className="text-wic-primary hover:text-wic-secondary w-full"
                    >
                      {resendCooldown > 0 ? `重新发送验证码 (${resendCooldown}s)` : '重新发送验证码'}
                    </Button>
                    <Button
                      variant="link"
                      onClick={handleBackToRegister}
                      className="text-muted-foreground w-full"
                    >
                      返回注册
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-none dark:bg-transparent">
                <CardHeader className="px-0 pt-0 text-center md:text-left">
                  <CardTitle className="text-3xl font-bold">
                    {isLogin ? t('login.title.login') : t('login.title.register')}
                  </CardTitle>
                  <CardDescription>
                    {isLogin ? t('login.subtitle.login') : t('login.subtitle.register')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence initial={false}>
                      {!isLogin && (
                        <>
                          {/* Name */}
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden space-y-2 p-2"
                          >
                            <Label>{t('login.label.name')}</Label>
                            <div className="relative group">
                              <User className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors h-4 w-4" />
                              <Input
                                placeholder="e.g. 张三"
                                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 transition-all focus:bg-white dark:focus:bg-slate-800"
                                required={!isLogin}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </motion.div>

                          {/* Username */}
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden space-y-2 p-2"
                          >
                            <Label>用户名</Label>
                            <div className="relative group">
                              <User className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors h-4 w-4" />
                              <Input
                                placeholder="e.g. zhangsan"
                                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 transition-all focus:bg-white dark:focus:bg-slate-800"
                                required={!isLogin}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                          </motion.div>

                          {/* Email */}
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden space-y-2 p-2"
                          >
                            <Label>邮箱（用于激活账号）</Label>
                            <div className="relative group">
                              <Mail className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors h-4 w-4" />
                              <Input
                                type="email"
                                placeholder="e.g. zhangsan@wic.edu.kg"
                                className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 transition-all focus:bg-white dark:focus:bg-slate-800"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {/* Messages */}
                    {successMessage && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400 text-sm">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                        {errorMessage}
                      </div>
                    )}

                    {/* ID / Email */}
                    <div className="space-y-2">
                      <Label>{t('login.label.id')}</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors h-4 w-4" />
                        <Input
                          placeholder={isLogin ? "20210001" : "student@wic.edu.kg"}
                          className="pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 transition-all focus:bg-white dark:focus:bg-slate-800"
                          required
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label>{t('login.label.password')}</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors h-4 w-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-10 py-2 bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 transition-all focus:bg-white dark:focus:bg-slate-800"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password */}
                    {isLogin && (
                      <div className="flex justify-end">
                        <Link to="#" className="text-sm text-wic-primary hover:text-wic-secondary font-medium transition-colors">
                          {t('login.forgot')}
                        </Link>
                      </div>
                    )}

                    <Button
                      disabled={isLoading}
                      className="w-full bg-wic-primary hover:bg-wic-secondary h-11 text-base shadow-lg hover:shadow-wic-primary/20"
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                      {isLogin ? t('login.btn.login') : t('login.btn.register')}
                      {!isLoading && <ArrowRight className="ml-2" size={18} />}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="px-0 flex justify-center">
                  <p className="text-muted-foreground text-sm">
                    {isLogin ? t('login.footer.no_account') : t('login.footer.has_account')}{" "}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-wic-primary font-semibold hover:underline ml-1"
                    >
                      {isLogin ? t('login.footer.link.register') : t('login.footer.link.login')}
                    </button>
                  </p>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
