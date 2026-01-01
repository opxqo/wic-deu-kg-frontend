import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Bell,
    Home,
    Sun,
    Moon,
    School,
    MessageSquare,
    FileText,
    Server
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '../../UserContext';
import { useTheme } from '../../ThemeContext';
import { cn } from "@/lib/utils";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarTrigger,
    SidebarInset
} from "@/components/ui/sidebar"

const AdminLayout: React.FC = () => {
    const { user, logout } = useUser();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: '概览', path: '/admin' },
        { icon: Users, label: '用户管理', path: '/admin/users' },
        { icon: School, label: '学部管理', path: '/admin/departments' },
        { icon: MessageSquare, label: '留言管理', path: '/admin/messages' },
        { icon: FileText, label: '文章管理', path: '/admin/articles' },
        { icon: Server, label: '数据库备份', path: '/admin/database' },
        { icon: Settings, label: '系统设置', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    {/* Logo Area */}
                    <div className="flex items-center gap-2 p-2 font-bold text-xl overflow-hidden whitespace-nowrap">
                        <img src="/校徽.svg" alt="WIC Logo" className="w-8 h-8 shrink-0 object-contain" />
                        <span className="group-data-[collapsible=icon]:hidden">WIC Admin</span>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            onClick={() => navigate(item.path)}
                                            tooltip={item.label}
                                        >
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleLogout} tooltip="退出登录">
                                <LogOut />
                                <span>退出登录</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-10 justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-[1px] bg-border mr-2" /> {/* Separator */}
                        <h2 className="font-semibold text-lg capitalize text-foreground">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground mr-1"
                            onClick={() => navigate('/')}
                            title="返回首页"
                        >
                            <Home size={20} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground mr-1"
                            onClick={toggleTheme}
                            title="切换主题"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Bell size={20} />
                        </Button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.roleName || 'Admin'}</p>
                            </div>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 flex flex-col gap-4 p-4 pt-0">
                    <main className="flex-1 overflow-auto bg-secondary/10 p-6 rounded-xl border border-dashed mt-4">
                        <Outlet />
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminLayout;
