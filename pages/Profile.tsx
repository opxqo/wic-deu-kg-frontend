
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Book, Building, Calendar, Edit2, Save, X, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useLanguage } from '../LanguageContext';
import authService from '../services/authService';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock Data for Cascading Select
const DEPARTMENT_DATA = [
  {
    name: "信息工程学部",
    majors: ["计算机科学与技术", "软件工程", "物联网工程", "电子信息工程", "通信工程", "数据科学与大数据技术"],
  },
  {
    name: "经济与管理学部",
    majors: ["会计学", "财务管理", "国际经济与贸易", "工商管理", "市场营销", "物流管理"],
  },
  {
    name: "医学部",
    majors: ["护理学", "康复治疗学", "医学检验技术", "药学"],
  },
  {
    name: "艺术设计学部",
    majors: ["环境设计", "视觉传达设计", "产品设计", "数字媒体艺术", "动画"],
  },
  {
    name: "外语学部",
    majors: ["英语", "日语", "商务英语", "翻译"],
  },
  {
    name: "建筑工程学部",
    majors: ["土木工程", "工程造价", "建筑学", "城乡规划"],
  },
  {
    name: "机电工程学部",
    majors: ["机械设计制造及其自动化", "车辆工程", "电气工程及其自动化", "机器人工程"],
  },
];

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

  // Initials for avatar fallback
  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : 'U';

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
            >
              <Card className="text-center overflow-hidden border-gray-100 dark:border-gray-800 shadow-xl">
                <CardContent className="pt-8 pb-8">
                  {/* 错误提示 */}
                  {error && (
                    <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="relative inline-block mb-4 group">
                    <Avatar
                      className={cn(
                        "w-32 h-32 ring-4 ring-background shadow-lg mx-auto",
                        isEditing && "cursor-pointer hover:opacity-80 transition-opacity"
                      )}
                      onClick={handleAvatarClick}
                    >
                      <AvatarImage src={user.avatar} className="object-cover" />
                      <AvatarFallback className="text-4xl bg-muted text-muted-foreground">{initials}</AvatarFallback>
                    </Avatar>

                    {isSaving && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* 隐藏的文件输入 */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleAvatarClick}
                        className="absolute bottom-0 right-0 rounded-full shadow-lg"
                      >
                        <Camera size={16} />
                      </Button>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
                  <p className="text-muted-foreground text-sm mb-6">{user.id}</p>

                  <div className="grid grid-cols-3 gap-2 border-t pt-6 bg-muted/20 -mx-6 -mb-8 pb-6">
                    <div className="text-center">
                      <div className="font-bold text-xl text-foreground">12</div>
                      <div className="text-xs text-muted-foreground">{t('profile.stats.reviews')}</div>
                    </div>
                    <div className="text-center border-l border-r border-border">
                      <div className="font-bold text-xl text-foreground">48</div>
                      <div className="text-xs text-muted-foreground">{t('profile.stats.likes')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-xl text-foreground">{daysJoined}</div>
                      <div className="text-xs text-muted-foreground">{t('profile.stats.days')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-gray-100 dark:border-gray-800 shadow-sm border-0">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-14 text-destructive hover:text-destructive hover:bg-destructive/10 text-base"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    {t('profile.logout')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Details Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:w-2/3"
          >
            <Card className="shadow-xl border-gray-100 dark:border-gray-800 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
                <CardTitle className="text-xl font-bold">{t('profile.title')}</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 size={16} />
                    {t('profile.edit')}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2">
                      <X size={16} />
                      {t('profile.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {t('profile.save')}
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.label.name')}</Label>
                    <div className={cn("flex items-center gap-3", !isEditing && "opacity-75")}>
                      <User size={18} className="text-muted-foreground shrink-0" />
                      <Input
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn("bg-transparent", !isEditing && "border-transparent px-0 shadow-none h-auto py-0")}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.label.email')}</Label>
                    <div className={cn("flex items-center gap-3", !isEditing && "opacity-75")}>
                      <Mail size={18} className="text-muted-foreground shrink-0" />
                      <Input
                        type="email"
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn("bg-transparent", !isEditing && "border-transparent px-0 shadow-none h-auto py-0")}
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.label.dept')}</Label>
                    <div className={cn("flex items-center gap-3", !isEditing && "opacity-75")}>
                      <Building size={18} className="text-muted-foreground shrink-0" />
                      {isEditing ? (
                        <Select
                          value={formData.department}
                          onValueChange={(value) => setFormData({ ...formData, department: value, major: '' })}
                        >
                          <SelectTrigger className="bg-transparent border-input h-auto py-1 shadow-sm">
                            <SelectValue placeholder="选择所属学部" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENT_DATA.map((dept) => (
                              <SelectItem key={dept.name} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          disabled
                          value={formData.department}
                          className="bg-transparent border-transparent px-0 shadow-none h-auto py-0"
                        />
                      )}
                    </div>
                  </div>

                  {/* Major */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.label.major')}</Label>
                    <div className={cn("flex items-center gap-3", !isEditing && "opacity-75")}>
                      <Book size={18} className="text-muted-foreground shrink-0" />
                      {isEditing ? (
                        <Select
                          value={formData.major}
                          onValueChange={(value) => setFormData({ ...formData, major: value })}
                          disabled={!formData.department}
                        >
                          <SelectTrigger className="bg-transparent border-input h-auto py-1 shadow-sm">
                            <SelectValue placeholder="选择专业" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENT_DATA.find(d => d.name === formData.department)?.majors.map((major) => (
                              <SelectItem key={major} value={major}>
                                {major}
                              </SelectItem>
                            )) || (
                                <SelectItem value="placeholder" disabled>请先选择学部</SelectItem>
                              )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          disabled
                          value={formData.major}
                          className="bg-transparent border-transparent px-0 shadow-none h-auto py-0"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.label.bio')}</Label>
                  <textarea
                    disabled={!isEditing}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder={t('profile.label.bio_placeholder')}
                    className={cn(
                      "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      !isEditing && "border-transparent shadow-none bg-transparent resize-none p-0 focus-visible:ring-0"
                    )}
                  />
                </div>

                {/* Readonly: ID and Join Date */}
                <div className="flex gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    <span className="font-mono">ID: {user.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>Joined: {user.joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
