import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Image, MessageSquare, Clock, AlertCircle, Server, Cpu, HardDrive, RefreshCw } from "lucide-react";
import { getDashboardData, DashboardVO, DailyCount } from '../../services/dashboardService';

// ============ 子组件 ============

/** 统计卡片 */
const StatCard: React.FC<{
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    trend?: string;
    trendUp?: boolean;
}> = ({ title, value, description, icon: Icon, trend, trendUp }) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
                {trend && (
                    <div className={`text-xs mt-2 flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

/** 待处理项卡片 */
const PendingCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    urgent?: boolean;
}> = ({ title, value, icon: Icon, urgent }) => {
    return (
        <div className={`p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer transition-colors
            ${value > 0 ? (urgent ? 'bg-destructive/10 hover:bg-destructive/20' : 'bg-secondary/20 hover:bg-secondary/30') : 'bg-secondary/10'}`}>
            <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full
                ${value > 0 ? (urgent ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground') : 'bg-muted text-muted-foreground'}`}>
                {value}
            </span>
        </div>
    );
};

/** 趋势迷你图 (SVG 平滑曲线版) */
const TrendMiniChart: React.FC<{ data: DailyCount[]; label: string; color?: string }> = ({ data, label, color = "currentColor" }) => {
    if (!data || data.length === 0) return null;

    const height = 120;
    const width = 300; // SVG 视口宽度，实际宽度由 CSS 控制
    const padding = 10;

    // 1. 数据归一化
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const minCount = 0; // 始终从0开始，体现绝对量

    // 坐标计算函数
    const getX = (index: number) => (index / (data.length - 1)) * (width - padding * 2) + padding;
    const getY = (value: number) => height - padding - ((value - minCount) / (maxCount - minCount)) * (height - padding * 2);

    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.count), ...d }));

    // 2. 生成平滑曲线路径 (Catmull-Rom spline 简化版或简单的三次贝塞尔)
    // 这里使用简单的控制点计算法生成平滑曲线
    const linePath = points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x},${point.y}`;

        // 计算控制点 (简单的平滑策略)
        const prev = arr[i - 1];
        const controlX1 = prev.x + (point.x - prev.x) * 0.5;
        const controlY1 = prev.y;
        const controlX2 = prev.x + (point.x - prev.x) * 0.5;
        const controlY2 = point.y;

        return `${acc} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${point.x},${point.y}`;
    }, "");

    // 3. 生成填充区域路径 (闭合到底部)
    const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

    const uniqueId = React.useId();

    return (
        <div className="space-y-4 group">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    最高: {maxCount}
                </div>
            </div>

            <div className="h-40 w-full relative">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id={`gradient-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* 填充区域 */}
                    <path
                        d={areaPath}
                        fill={`url(#gradient-${uniqueId})`}
                        className="transition-all duration-300"
                    />

                    {/* 曲线线条 */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                    />

                    {/* 数据点 (仅 Hover 时显示) */}
                    {points.map((point, i) => (
                        <g key={i} className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer group/point">
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill="hsl(var(--background))"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                            />
                            {/* Tooltip */}
                            <foreignObject x={Math.min(point.x - 20, width - 40)} y={Math.max(point.y - 30, 0)} width="60" height="30" className="overflow-visible pointer-events-none">
                                <div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md text-center whitespace-nowrap transform -translate-x-1/4 border">
                                    {point.count}
                                </div>
                            </foreignObject>
                        </g>
                    ))}
                </svg>

                {/* 底部日期标签（首尾） */}
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                    <span>{data[0]?.date.slice(5)}</span>
                    <span>{data[data.length - 1]?.date.slice(5)}</span>
                </div>
            </div>
        </div>
    );
};

// ============ 主组件 ============

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardVO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getDashboardData();
            if (result.code === 0 && result.data) {
                setData(result.data);
            } else {
                setError(result.message || '获取数据失败');
            }
        } catch (e: any) {
            setError(e.message || '网络错误');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 加载状态
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive">{error}</p>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    重试
                </button>
            </div>
        );
    }

    if (!data) return null;

    const { statCard, pendingItems, trendData, systemStatus } = data;
    const memoryPercent = systemStatus.jvmMemoryMax > 0
        ? Math.round((systemStatus.jvmMemoryUsed / systemStatus.jvmMemoryMax) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* 标题行 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">欢迎回来，这里是系统概览。</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 rounded-md hover:bg-secondary transition-colors"
                    title="刷新数据"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* 统计卡片 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="用户总数"
                    value={statCard.totalUsers.toLocaleString()}
                    description={`今日新增 ${statCard.newUsersToday} 人`}
                    icon={Users}
                    trend={statCard.newUsersToday > 0 ? `+${statCard.newUsersToday} 今日` : undefined}
                    trendUp={statCard.newUsersToday > 0}
                />
                <StatCard
                    title="文章总数"
                    value={statCard.totalArticles.toLocaleString()}
                    description={`已发布 ${statCard.publishedArticles} 篇`}
                    icon={FileText}
                />
                <StatCard
                    title="图库图片"
                    value={statCard.totalGalleryImages.toLocaleString()}
                    description="校园风采"
                    icon={Image}
                />
                <StatCard
                    title="留言总数"
                    value={statCard.totalMessages.toLocaleString()}
                    description="校园互动"
                    icon={MessageSquare}
                />
            </div>

            {/* 中间区域：趋势图 + 待处理事项 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* 趋势图 */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>近7日趋势</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <TrendMiniChart data={trendData.userTrend} label="用户增长" />
                        <TrendMiniChart data={trendData.articleTrend} label="文章发布" />
                    </CardContent>
                </Card>

                {/* 待处理事项 */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>待处理事项</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <PendingCard
                            title="待审核留言"
                            value={pendingItems.pendingMessages}
                            icon={MessageSquare}
                        />
                        <PendingCard
                            title="待审核图片"
                            value={pendingItems.pendingImages}
                            icon={Image}
                        />
                        <PendingCard
                            title="草稿文章"
                            value={pendingItems.draftArticles}
                            icon={FileText}
                        />
                        <PendingCard
                            title="禁用用户"
                            value={pendingItems.disabledUsers}
                            icon={Users}
                            urgent={pendingItems.disabledUsers > 0}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* 系统状态 */}
            <Card>
                <CardHeader>
                    <CardTitle>系统状态</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* 服务器时间 */}
                        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">服务器时间</div>
                                <div className="text-sm font-medium">
                                    {new Date(systemStatus.serverTime).toLocaleString('zh-CN')}
                                </div>
                            </div>
                        </div>

                        {/* 内存使用 */}
                        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                            <HardDrive className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-1">
                                <div className="text-xs text-muted-foreground">JVM 内存</div>
                                <div className="text-sm font-medium">
                                    {systemStatus.jvmMemoryUsed} / {systemStatus.jvmMemoryMax} MB
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full mt-1">
                                    <div
                                        className={`h-full rounded-full transition-all ${memoryPercent > 80 ? 'bg-destructive' : 'bg-primary'}`}
                                        style={{ width: `${memoryPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CPU */}
                        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                            <Cpu className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">CPU 核心</div>
                                <div className="text-sm font-medium">{systemStatus.cpuCores} 核</div>
                            </div>
                        </div>

                        {/* 运行环境 */}
                        <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                            <Server className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">运行环境</div>
                                <div className="text-sm font-medium truncate" title={`${systemStatus.osName} / Java ${systemStatus.javaVersion}`}>
                                    Java {systemStatus.javaVersion}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
