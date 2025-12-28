import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, Activity } from "lucide-react";

const InfoCard: React.FC<{
    title: string;
    value: string;
    description: string;
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
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
                {trend && (
                    <div className={`text-xs mt-2 flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">欢迎回来，这里是系统概览。</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                    title="总用户数"
                    value="1,234"
                    description="活跃用户持续增长"
                    icon={Users}
                    trend="12% 较上月"
                    trendUp={true}
                />
                <InfoCard
                    title="今日访问"
                    value="423"
                    description="过去24小时 PV"
                    icon={Activity}
                />
                <InfoCard
                    title="新增帖子"
                    value="58"
                    description="社区内容更新"
                    icon={MessageSquare}
                    trend="5% 较昨日"
                    trendUp={true}
                />
                <InfoCard
                    title="系统状态"
                    value="正常"
                    description="所有服务运行良好"
                    icon={BookOpen}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-secondary/10 rounded-md border border-dashed">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="p-3 bg-secondary/20 rounded-lg text-sm flex items-center justify-between hover:bg-secondary/30 cursor-pointer">
                                <span>审核新用户注册</span>
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">3</span>
                            </div>
                            <div className="p-3 bg-secondary/20 rounded-lg text-sm flex items-center justify-between hover:bg-secondary/30 cursor-pointer">
                                <span>处理举报信息</span>
                                <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">1</span>
                            </div>
                            <div className="p-3 bg-secondary/20 rounded-lg text-sm flex items-center justify-between hover:bg-secondary/30 cursor-pointer">
                                <span>发布系统公告</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
