
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Book, Building, Calendar, Edit2, Save, X, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useLanguage } from '../LanguageContext';
import authService from '../services/authService';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile, uploadAvatar } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    major: '',
    bio: '',
    email: '',
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    } else {
      setFormData({
        name: user.name,
        department: user.department,
        major: user.major,
        bio: user.bio,
        email: user.email,
      });
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      setError('头像文件不能超过 2MB');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    try {
      await uploadAvatar(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      department: user.department,
      major: user.major,
      bio: user.bio,
      email: user.email,
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/');
  };

  // Calculate days since join (mock calculation based on fixed date if valid, otherwise random)
  const joinDate = new Date(user.joinDate);
  const daysJoined = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors">
      {/* Header Background */}
      <div className="h-60 bg-gradient-to-r from-wic-primary to-wic-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2800&auto=format&fit=crop" 
            alt="Campus" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Avatar & Quick Actions */}
          <div className="md:w-1/3 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 text-center border border-gray-100 dark:border-gray-800"
            >
              {/* 错误提示 */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="relative inline-block mb-4">
                <div 
                  className={`w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden shadow-lg mx-auto bg-gray-200 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                  onClick={handleAvatarClick}
                >
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  {isSaving && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {/* 隐藏的文件输入 */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                {isEditing && (
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 bg-wic-primary text-white rounded-full shadow-lg hover:bg-wic-secondary transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{user.id}</p>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-800 pt-6">
                 <div className="text-center">
                    <div className="font-bold text-xl text-gray-900 dark:text-white">12</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('profile.stats.reviews')}</div>
                 </div>
                 <div className="text-center border-l border-r border-gray-100 dark:border-gray-800">
                    <div className="font-bold text-xl text-gray-900 dark:text-white">48</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('profile.stats.likes')}</div>
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-xl text-gray-900 dark:text-white">{daysJoined}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('profile.stats.days')}</div>
                 </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
               <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
               >
                  <LogOut size={20} />
                  {t('profile.logout')}
               </button>
            </motion.div>
          </div>

          {/* Right Column: Details Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:w-2/3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h2>
               {!isEditing ? (
                 <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors"
                 >
                    <Edit2 size={16} />
                    {t('profile.edit')}
                 </button>
               ) : (
                 <div className="flex gap-2">
                    <button 
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors"
                    >
                        <X size={16} />
                        {t('profile.cancel')}
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-wic-primary hover:bg-wic-secondary rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save size={16} />
                        )}
                        {t('profile.save')}
                    </button>
                 </div>
               )}
            </div>
            
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('profile.label.name')}</label>
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-wic-primary/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}>
                            <User size={20} className="text-gray-400" />
                            <input 
                                type="text" 
                                disabled={!isEditing}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white font-medium"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('profile.label.email')}</label>
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-wic-primary/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}>
                            <Mail size={20} className="text-gray-400" />
                            <input 
                                type="email" 
                                disabled={!isEditing}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white font-medium"
                            />
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('profile.label.dept')}</label>
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-wic-primary/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}>
                            <Building size={20} className="text-gray-400" />
                            <input 
                                type="text" 
                                disabled={!isEditing}
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white font-medium"
                            />
                        </div>
                    </div>

                    {/* Major */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('profile.label.major')}</label>
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-wic-primary/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}>
                            <Book size={20} className="text-gray-400" />
                            <input 
                                type="text" 
                                disabled={!isEditing}
                                value={formData.major}
                                onChange={(e) => setFormData({...formData, major: e.target.value})}
                                className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('profile.label.bio')}</label>
                    <div className={`p-3 rounded-xl border transition-colors ${isEditing ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-wic-primary/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}>
                        <textarea 
                            disabled={!isEditing}
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            rows={4}
                            placeholder={t('profile.label.bio_placeholder')}
                            className="bg-transparent w-full focus:outline-none text-gray-900 dark:text-white font-medium resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Readonly: ID and Join Date */}
                <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-2 text-sm text-gray-500">
                         <div className="w-2 h-2 rounded-full bg-wic-primary"></div>
                         ID: {user.id}
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-500">
                         <Calendar size={14} />
                         Joined: {user.joinDate}
                     </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
