
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from './types';
import authService from './services/authService';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (data?: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // 页面加载时从 localStorage 恢复登录状态，并获取最新用户信息
  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser && authService.isAuthenticated()) {
      // 1. 先用本地缓存快速渲染
      setUser({
        name: savedUser.name,
        id: savedUser.studentId,
        email: savedUser.email,
        department: savedUser.department,
        major: savedUser.major,
        bio: savedUser.bio,
        avatar: savedUser.avatar,
        joinDate: savedUser.createdAt,
      } as UserProfile);

      // 2. 异步获取最新用户信息 (GET /api/users/me)
      authService.fetchCurrentUser().then(result => {
        if ((result.code === 0 || result.code === 200) && result.data) {
          const freshUser = result.data;
          setUser({
            name: freshUser.name,
            id: freshUser.studentId,
            email: freshUser.email,
            department: freshUser.department,
            major: freshUser.major,
            bio: freshUser.bio,
            avatar: freshUser.avatar,
            joinDate: freshUser.createdAt,
          } as UserProfile);
        }
      }).catch(console.error);
    }
  }, []);

  const login = (data?: Partial<UserProfile>) => {
    // 设置用户状态（由 Login 页面传入真实数据）
    if (data) {
      setUser(data as UserProfile);
    }
  };

  const logout = () => {
    // 清除本地存储的令牌和用户信息
    authService.clearAuth();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      // 调用后端 API 更新个人资料
      const result = await authService.updateProfile({
        name: data.name,
        email: data.email,
        department: data.department,
        major: data.major,
        bio: data.bio,
      });

      // 检查响应状态码 (兼容 0 和 200)
      if ((result.code === 0 || result.code === 200) && result.data) {
        setUser(prev => prev ? {
          ...prev,
          name: result.data.name || prev.name,
          email: result.data.email || prev.email,
          department: result.data.department || prev.department,
          major: result.data.major || prev.major,
          bio: result.data.bio || prev.bio,
          avatar: result.data.avatar || prev.avatar,
        } : null);
      } else {
        throw new Error(result.message || '更新失败');
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      throw error;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const result = await authService.uploadAvatar(file);

      // 检查响应状态码 (兼容 0 和 200)
      if ((result.code === 0 || result.code === 200) && result.data) {
        setUser(prev => prev ? {
          ...prev,
          avatar: result.data.avatar,
        } : null);
      } else {
        throw new Error(result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, uploadAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
