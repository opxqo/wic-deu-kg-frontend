import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, GraduationCap, Calendar, MessageSquare, Heart, MapPin, School, BookOpen, Mail } from 'lucide-react';
import { userService, UserCardVO } from '../services/userService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserCardVO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await userService.getUserCard(id);
                if (response.code === 200) {
                    setUser(response.data);
                } else {
                    setError(response.message || '获取用户信息失败');
                }
            } catch (err: any) {
                setError(err.message || '获取用户信息失败');
                // Mock data for development if API fails
                // setUser({
                //   userId: parseInt(id),
                //   studentId: '20210001',
                //   username: '测试用户',
                //   name: '张三',
                //   avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
                //   department: '计算机工程学院',
                //   major: '软件工程',
                //   bio: '热爱编程，热爱生活。追逐光影的少年。',
                //   joinDate: '2023-09-01',
                //   messageCount: 42,
                //   likeCount: 128
                // });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 bg-background dark:bg-slate-950">
                <div className="max-w-2xl mx-auto space-y-8">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-2/3" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center bg-background dark:bg-slate-950">
                <User size={64} className="text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">未找到用户</h2>
                <p className="text-muted-foreground mb-8">{error || '该用户可能不存在或已被删除'}</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowLeft size={16} className="mr-2" />
                    返回上一页
                </Button>
            </div>
        );
    }

    // user might be null initially
    if (!user) return null;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background dark:bg-slate-950 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 hover:bg-secondary/50"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    返回
                </Button>

                <Card className="overflow-hidden border-border/50 shadow-xl bg-card dark:bg-gray-900">
                    {/* Banner 背景区域 */}
                    <div className="h-48 relative overflow-hidden bg-gradient-to-r from-wic-primary/20 to-wic-accent/20 dark:from-wic-primary/10 dark:to-wic-accent/10">
                        {/* 装饰性背景圆 */}
                        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] rounded-full bg-wic-primary/5 blur-3xl" />
                        <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] rounded-full bg-wic-accent/5 blur-3xl" />
                    </div>

                    <CardContent className="relative px-6 sm:px-10 pb-10">
                        {/* 头像 */}
                        <div className="absolute -top-16 left-6 sm:left-10">
                            <Avatar className="w-32 h-32 border-4 border-card dark:border-gray-900 shadow-xl cursor-default">
                                <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                                    {user.name?.[0]?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* 基本信息 */}
                        <div className="pt-20 sm:flex sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground dark:text-white flex items-center gap-2">
                                    {user.name}
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        {user.roleName || '校友'}
                                    </Badge>
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed">
                                    {user.bio || "这个人很懒，什么都没有写..."}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* 详细资料 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                    <School size={20} className="text-wic-primary" />
                                    学院信息
                                </h3>
                                <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <BookOpen size={16} />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">院系</p>
                                            <p className="font-medium text-foreground">{user.department || '未填写'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <GraduationCap size={16} />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">专业</p>
                                            <p className="font-medium text-foreground">{user.major || '未填写'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                    <User size={20} className="text-wic-accent" />
                                    个人档案
                                </h3>
                                <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">加入时间</p>
                                            <p className="font-medium text-foreground">{formatDate(user.joinedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">位置</p>
                                            <p className="font-medium text-foreground">武汉城市学院</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                    <MessageSquare size={20} className="text-pink-500" />
                                    联系方式
                                </h3>
                                <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                                    {user.email ? (
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                                <Mail size={16} />
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs">邮箱</p>
                                                <a href={`mailto:${user.email}`} className="font-medium text-foreground hover:text-wic-primary transition-colors truncate block max-w-[180px]">
                                                    {user.email}
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground p-2">
                                            暂无联系方式
                                        </div>
                                    )}
                                    {/* 后续可以添加其他联系方式 */}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default UserProfile;
