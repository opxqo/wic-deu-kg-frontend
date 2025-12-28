import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, GraduationCap, Calendar, MessageSquare, Heart, MapPin, School, BookOpen, Mail } from 'lucide-react';
import { userService, UserCardVO } from '../services/userService';
import { messageApi, SeniorMessageVO } from '../services/messageApi';
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
    const [messages, setMessages] = useState<SeniorMessageVO[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await userService.getUserCard(id);

                let userData: UserCardVO | null = null;
                if ((response.code === 0 || response.code === 200) && response.data) {
                    userData = response.data;
                    setUser(userData);
                } else {
                    setError(response.message || '获取用户信息失败');
                }

                if (userData && userData.studentId) {
                    try {
                        const messagesResponse = await messageApi.getUserMessages(userData.studentId);
                        if ((messagesResponse.code === 0 || messagesResponse.code === 200) && messagesResponse.data) {
                            setMessages(messagesResponse.data.records);
                        }
                    } catch (msgErr) {
                        console.error("Failed to fetch messages:", msgErr);
                        // 留言获取失败不影响主页面显示
                    }
                }

            } catch (err: any) {
                setError(err.message || '获取用户信息失败');
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
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
            {/* 留言墙展示区域 - 背景层 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {messages.map((msg, index) => {
                        // 使用 index 决定左右，确保均匀的一左一右
                        // 0: 左, 1: 右, 2: 左, 3: 右 ...
                        const isLeft = index % 2 === 0;

                        // 使用 msg.id 作为随机种子，保证外观一致性
                        const seed = msg.id;

                        // 简单的伪随机函数
                        const pseudoRandom = (input: number) => {
                            const x = Math.sin(input) * 10000;
                            return x - Math.floor(x);
                        };

                        // 计算该侧的索引
                        const sideIndex = Math.floor(index / 2);
                        // 估算该侧总数 (向上取整)
                        const totalInSide = Math.ceil(messages.length / 2);

                        // 在垂直方向均匀分布
                        // 将屏幕垂直分为 totalInSide 个区块，每个便签在自己的区块内随机浮动
                        // 区块高度百分比
                        const sliceHeight = 90 / totalInSide;
                        // 基础 Top: 顶部预留 5%
                        const baseTop = 5 + sideIndex * sliceHeight;

                        // 在区块内随机偏移，但保持在区块内 (比如说偏移 10% - 90% 的 sliceHeight)
                        // 加上一点随机性
                        const randomOffsetInSlice = pseudoRandom(seed) * (sliceHeight * 0.6);

                        const finalTop = baseTop + (sliceHeight * 0.2) + randomOffsetInSlice;

                        // 距离边缘的距离. 既然要均匀分布背景，可以稍微放宽范围
                        // 但不能挡住中间卡片。中间卡片大概占 40-50%
                        // 所以两边可以占 0-25% 左右
                        // 左侧: 2% - 25%
                        // 右侧: 也是距离右边缘 2% - 25%
                        const randomEdge = 2 + Math.floor(pseudoRandom(seed + 1) * 23);

                        const randomRotate = -6 + Math.floor(pseudoRandom(seed + 2) * 12); // -6deg - 6deg

                        // 颜色
                        const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-pink-100', 'bg-green-100'];
                        const colorIndex = Math.floor(pseudoRandom(seed + 3) * colors.length);
                        const bgColor = colors[colorIndex];

                        // 限制显示数量，防止过多
                        if (index > 15) return null;

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                                style={{
                                    top: `${finalTop}%`,
                                    left: isLeft ? `${randomEdge}%` : 'auto',
                                    right: !isLeft ? `${randomEdge}%` : 'auto',
                                    transform: `rotate(${randomRotate}deg)`,
                                }}
                                className={`absolute pointer-events-auto w-40 md:w-56 p-4 shadow-lg rounded-sm cursor-pointer hover:z-20 hover:scale-110 transition-transform duration-200 ${bgColor} dark:opacity-80`}
                                title={`By: ${msg.signature || '匿名'}\nTime: ${new Date(msg.createdAt).toLocaleDateString()}`}
                            >
                                {/* 模拟胶带效果 (可选) */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/30 rotate-1 transform"></div>

                                <p className="text-sm text-gray-800 dark:text-gray-900 font-handwriting line-clamp-4 leading-normal select-none break-words">
                                    {msg.content}
                                </p>
                                <div className="mt-2 text-right">
                                    <span className="text-xs text-gray-500 dark:text-gray-700 font-handwriting">
                                        — {msg.signature || 'Anonymous'}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto relative z-10"
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
                    {/* Banner 背景区域 */}
                    <div
                        className="h-32 md:h-48 relative overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://api.imlcd.cn/bg/gq.php")' }}
                    />

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
                                            <p className="font-medium text-foreground">{formatDate(user.createdAt)}</p>
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
