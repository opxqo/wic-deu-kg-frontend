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
    MoreHorizontal,
    Search,
    Edit2,
    Trash2,
    Plus,
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
import { Textarea } from "@/components/ui/textarea";

import departmentService, { DepartmentVO } from '../../services/departmentService';

const DepartmentManagement: React.FC = () => {
    const [departments, setDepartments] = useState<DepartmentVO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0, pages: 0 });

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await departmentService.getDepartmentsAdmin({
                page: pagination.current,
                size: pagination.size,
                keyword: searchTerm
            });

            if ((res.code === 0 || res.code === 200) && res.data) {
                // If backend returns page object
                if (res.data.records) {
                    setDepartments(res.data.records);
                    setPagination({
                        current: res.data.current || 1,
                        size: res.data.size || 10,
                        total: res.data.total || 0,
                        pages: res.data.pages || 0
                    });
                } else if (Array.isArray(res.data)) {
                    // If backend returns array (adapter for different API style if needed)
                    setDepartments(res.data);
                    setPagination({ ...pagination, total: res.data.length, pages: 1 });
                }
            }
        } catch (error) {
            console.error("Failed to fetch departments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDepartments();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, pagination.current]);

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

    const handleDelete = (id: number) => {
        openAlert(
            "确认删除学部",
            "确定要删除该学部吗？此操作可能会影响关联的专业和用户。",
            async () => {
                try {
                    await departmentService.deleteDepartment(id);
                    fetchDepartments();
                } catch (error) {
                    console.error("Failed to delete department", error);
                }
            },
            "destructive"
        );
    };

    // Edit/Create Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<DepartmentVO>>({
        code: '',
        nameZh: '',
        nameEn: '',
        descriptionZh: '',
        location: '',
        sortOrder: 0
    });

    const handleCreateClick = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            code: '',
            nameZh: '',
            nameEn: '',
            descriptionZh: '',
            location: '',
            sortOrder: 0
        });
        setDialogOpen(true);
    };

    const handleEditClick = (dept: DepartmentVO) => {
        setIsEditing(true);
        setEditingId(dept.id);
        setFormData({
            code: dept.code,
            nameZh: dept.nameZh,
            nameEn: dept.nameEn,
            descriptionZh: dept.descriptionZh,
            location: dept.location,
            sortOrder: dept.sortOrder
        });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (isEditing && editingId) {
                await departmentService.updateDepartment(editingId, formData);
            } else {
                await departmentService.createDepartment(formData);
            }
            setDialogOpen(false);
            fetchDepartments();
        } catch (error) {
            console.error("Failed to save department", error);
            alert("保存失败");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">学部管理</h1>
                    <p className="text-muted-foreground">管理学校的院系（学部）设置。</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleCreateClick}>
                        <Plus className="mr-2 h-4 w-4" /> 新增学部
                    </Button>
                    <Button variant="outline" onClick={() => fetchDepartments()}>
                        刷新
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜索学部名称、代码..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">代码</TableHead>
                            <TableHead>名称 (中/英)</TableHead>
                            <TableHead>位置</TableHead>
                            <TableHead>简介</TableHead>
                            <TableHead>排序</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        加载中...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : departments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    未找到学部数据。
                                </TableCell>
                            </TableRow>
                        ) : (
                            departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell>{dept.code}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{dept.nameZh}</span>
                                            <span className="text-xs text-muted-foreground">{dept.nameEn}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{dept.location}</TableCell>
                                    <TableCell className="max-w-[300px] truncate" title={dept.descriptionZh}>
                                        {dept.descriptionZh}
                                    </TableCell>
                                    <TableCell>{dept.sortOrder}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleEditClick(dept)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> 编辑
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(dept.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> 删除
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

            {/* Pagination - optional if API supports it */}
            {pagination.pages > 1 && (
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
                        第 {pagination.current} 页 / 共 {pagination.pages} 页
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
            )}

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

            {/* Edit/Create Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? '编辑学部' : '新增学部'}</DialogTitle>
                        <DialogDescription>
                            填写学部详细信息。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">代码</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="col-span-3"
                                placeholder="如: CS"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nameZh" className="text-right">中文名称</Label>
                            <Input
                                id="nameZh"
                                value={formData.nameZh}
                                onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                                className="col-span-3"
                                placeholder="如: 信息工程学部"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nameEn" className="text-right">英文名称</Label>
                            <Input
                                id="nameEn"
                                value={formData.nameEn}
                                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                className="col-span-3"
                                placeholder="如: Department of Information Engineering"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">位置</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="col-span-3"
                                placeholder="如: 南一教学楼"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sortOrder" className="text-right">排序权重</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <Label htmlFor="descriptionZh" className="text-right mt-2">中文简介</Label>
                            <Textarea
                                id="descriptionZh"
                                value={formData.descriptionZh}
                                onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                                className="col-span-3"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                        <Button type="submit" onClick={handleSubmit}>保存</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DepartmentManagement;
