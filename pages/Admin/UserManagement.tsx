import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MoreHorizontal,
    Search,
    Shield,
    ShieldAlert,
    User,
    Trash2,
    Ban,
    CheckCircle,
    Loader2
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { userService, UserListVO } from '../../services/userService';
import { useToast } from "@/hooks/use-toast";



const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserListVO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0, pages: 0 });
    // const { toast } = useToast(); // Assuming useToast hook exists, if not will use alert or create it

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const role = roleFilter !== 'all' ? parseInt(roleFilter) : undefined;
            const status = statusFilter !== 'all' ? parseInt(statusFilter) : undefined;

            // Mock data for development if API fails (or while API is being built)
            // Remove this block once API is ready
            /*
            setTimeout(() => {
                setUsers([
                    { id: 1, studentId: '2021001', username: 'admin', name: 'Admin User', email: 'admin@wic.edu', avatar: '', department: 'CS', major: 'SE', role: 2, roleName: 'Admin', status: 1, createdAt: '2024-01-01' },
                    { id: 2, studentId: '2021002', username: 'org', name: 'Organizer User', email: 'org@wic.edu', avatar: '', department: 'Design', major: 'Art', role: 1, roleName: 'Organizer', status: 1, createdAt: '2024-02-01' },
                    { id: 3, studentId: '2021003', username: 'user1', name: 'Normal User', email: 'user1@wic.edu', avatar: '', department: 'Biz', major: 'Finance', role: 3, roleName: 'User', status: 1, createdAt: '2024-03-01' },
                    { id: 4, studentId: '2021004', username: 'banned', name: 'Banned User', email: 'bad@wic.edu', avatar: '', department: 'CS', major: 'Net', role: 3, roleName: 'User', status: 2, createdAt: '2024-04-01' },
                ]);
                setLoading(false);
            }, 500);
            return; 
            */

            const res = await userService.getUsers({
                page: pagination.current,
                size: pagination.size,
                keyword: searchTerm,
                role,
                status
            });

            if ((res.code === 0 || res.code === 200) && res.data) {
                setUsers(res.data.records || []);
                setPagination({
                    current: res.data.current || 1,
                    size: res.data.size || 10,
                    total: res.data.total || 0,
                    pages: res.data.pages || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchTerm, roleFilter, statusFilter, pagination.current]);

    // Alert Dialog State
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        description: string;
        action: () => Promise<void>;
        variant?: "default" | "destructive";
    }>({ title: '', description: '', action: async () => { } });

    const openAlert = (title: string, description: string, action: () => Promise<void>, variant: "default" | "destructive" = "default") => {
        setAlertConfig({ title, description, action, variant });
        setAlertOpen(true);
    };

    const handleConfirm = async () => {
        try {
            await alertConfig.action();
        } finally {
            setAlertOpen(false);
        }
    };

    const handleStatusChange = (id: number, newStatus: number) => {
        openAlert(
            "确认更改状态",
            `确定要${newStatus === 1 ? '解封' : '封禁'}该用户吗？`,
            async () => {
                try {
                    await userService.updateUserStatus(id, newStatus);
                    fetchUsers();
                } catch (error) {
                    console.error("Failed to update status", error);
                    // toast({ title: "操作失败", variant: "destructive" });
                }
            },
            newStatus === 2 ? "destructive" : "default"
        );
    };

    const handleRoleChange = (id: number, newRole: number) => {
        openAlert(
            "确认更改角色",
            "确定要更改该用户的角色吗？这可能赋予敏感权限。",
            async () => {
                try {
                    await userService.updateUserRole(id, newRole);
                    fetchUsers();
                } catch (error) {
                    console.error("Failed to update role", error);
                }
            },
            "default"
        );
    };

    const handleDeleteUser = (id: number) => {
        openAlert(
            "确认删除用户",
            "确定要永久删除该用户吗？此操作不可恢复！",
            async () => {
                try {
                    await userService.deleteUser(id);
                    fetchUsers();
                } catch (error) {
                    console.error("Failed to delete user", error);
                }
            },
            "destructive"
        );
    };

    const getRoleBadge = (role: number) => {
        switch (role) {
            case 1: return <Badge className="bg-purple-500 hover:bg-purple-600">组织者</Badge>;
            case 2: return <Badge className="bg-red-500 hover:bg-red-600">管理员</Badge>;
            default: return <Badge variant="secondary">用户</Badge>;
        }
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1: return <Badge variant="outline" className="text-green-600 border-green-600">正常</Badge>;
            case 2: return <Badge variant="destructive">封禁</Badge>;
            case 0: return <Badge variant="outline" className="text-yellow-600 border-yellow-600">未激活</Badge>;
            default: return <Badge variant="outline">未知</Badge>;
        }
    };

    // Edit Dialog State
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserListVO | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', department: '', major: '' });

    const handleEditClick = (user: UserListVO) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            department: user.department,
            major: user.major
        });
        setEditOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            await userService.updateUserDetails(editingUser.id, editForm);
            setEditOpen(false);
            fetchUsers();
            // toast({ title: "更新成功" });
        } catch (error) {
            console.error("Failed to update user", error);
            alert("更新失败");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
                    <p className="text-muted-foreground">管理系统用户、角色及权限。</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => fetchUsers()}>
                        刷新列表
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜索姓名、学号或邮箱..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="角色" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有角色</SelectItem>
                        <SelectItem value="1">组织者</SelectItem>
                        <SelectItem value="2">管理员</SelectItem>
                        <SelectItem value="3">普通用户</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="1">正常</SelectItem>
                        <SelectItem value="2">已封禁</SelectItem>
                        <SelectItem value="0">未激活</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">用户</TableHead>
                            <TableHead>学号</TableHead>
                            <TableHead>院系/专业</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>注册时间</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        加载中...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    未找到匹配的用户。
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.studentId}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{user.department}</span>
                                            <span className="text-xs text-muted-foreground">{user.major}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">打开菜单</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>操作</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.studentId)}>
                                                    复制学号
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                                    <User className="mr-2 h-4 w-4" /> 编辑信息
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>更改角色</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 3)}>
                                                    <User className="mr-2 h-4 w-4" /> 设为普通用户
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 1)}>
                                                    <Shield className="mr-2 h-4 w-4" /> 设为组织者
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 2)}>
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> 设为管理员
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>账号状态</DropdownMenuLabel>
                                                {user.status === 2 ? (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 1)}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> 解封用户
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 2)}>
                                                        <Ban className="mr-2 h-4 w-4 text-orange-500" /> 封禁用户
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> 删除用户
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Simple Pagination Control */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(p => ({ ...p, current: Math.max(1, p.current - 1) }))}
                    disabled={pagination.current <= 1 || loading}
                >
                    上一页
                </Button>
                <div className="text-sm text-muted-foreground">
                    第 {pagination.current} 页 / 共 {Math.max(1, pagination.pages)} 页
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(p => ({ ...p, current: Math.min(pagination.pages, p.current + 1) }))}
                    disabled={pagination.current >= pagination.pages || loading}
                >
                    下一页
                </Button>
            </div>

            {/* Alert Dialog */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={alertConfig.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
                        >
                            确认
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit User Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>编辑用户信息</DialogTitle>
                        <DialogDescription>
                            修改用户的基本信息。点击保存以更新。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                姓名
                            </Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                邮箱
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                                院系
                            </Label>
                            <Input
                                id="department"
                                value={editForm.department}
                                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="major" className="text-right">
                                专业
                            </Label>
                            <Input
                                id="major"
                                value={editForm.major}
                                onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdateUser}>保存更改</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;
