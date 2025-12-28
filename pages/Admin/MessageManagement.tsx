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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    MoreHorizontal,
    Search,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    MessageSquare,
    Clock,
    AlertCircle
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { messageService, SeniorMessageVO, MessageStats } from '../../services/messageService';

const MessageManagement: React.FC = () => {
    const [messages, setMessages] = useState<SeniorMessageVO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', '0', '1', '2'
    const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0, pages: 0 });
    const [stats, setStats] = useState<MessageStats>({ pending: 0, published: 0, rejected: 0, total: 0 });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const status = statusFilter !== 'all' ? parseInt(statusFilter) : undefined;
            const res = await messageService.getMessages({
                page: pagination.current,
                size: pagination.size,
                keyword: searchTerm,
                status
            });

            if ((res.code === 0 || res.code === 200) && res.data) {
                setMessages(res.data.records || []);
                setPagination({
                    current: res.data.current || 1,
                    size: res.data.size || 10,
                    total: res.data.total || 0,
                    pages: res.data.pages || 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await messageService.getMessageStats();
            if ((res.code === 0 || res.code === 200) && res.data) {
                setStats(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchMessages();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, statusFilter, pagination.current]);

    // Selection Handling
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(messages.map(m => m.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        }
    };

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

    // Reject Dialog State
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectTarget, setRejectTarget] = useState<number[]>([]); // Single ID or multiple IDs

    const openRejectDialog = (ids: number[]) => {
        setRejectTarget(ids);
        setRejectReason('');
        setRejectOpen(true);
    };

    const handleRejectSubmit = async () => {
        try {
            if (rejectTarget.length === 1) {
                await messageService.rejectMessage(rejectTarget[0], rejectReason);
            } else {
                await messageService.batchReject(rejectTarget, rejectReason);
            }
            setRejectOpen(false);
            fetchMessages();
            fetchStats();
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to reject", error);
        }
    };

    // Actions
    const handleApprove = async (ids: number[]) => {
        try {
            if (ids.length === 1) {
                await messageService.approveMessage(ids[0]);
            } else {
                await messageService.batchApprove(ids);
            }
            fetchMessages();
            fetchStats();
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleDelete = (ids: number[]) => {
        openAlert(
            "确认删除",
            `确定要删除这 ${ids.length} 条留言吗？此操作不可恢复。`,
            async () => {
                try {
                    if (ids.length === 1) {
                        await messageService.deleteMessage(ids[0]);
                    } else {
                        await messageService.batchDelete(ids);
                    }
                    fetchMessages();
                    fetchStats();
                    setSelectedIds([]);
                } catch (error) {
                    console.error("Failed to delete", error);
                }
            },
            "destructive"
        );
    };

    const getStatusBadge = (status?: number) => {
        switch (status) {
            case 1: return <Badge className="bg-green-500 hover:bg-green-600">已发布</Badge>;
            case 2: return <Badge variant="destructive">已拒绝</Badge>;
            case 0:
            default: return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">待审核</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">留言板管理</h1>
                    <p className="text-muted-foreground">审核、管理校友和学生的留言。</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => { fetchMessages(); fetchStats(); }}>
                        刷新
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">待审核</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">已发布</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.published}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">已拒绝</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rejected}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总留言</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Tabs */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <Tabs value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPagination({ ...pagination, current: 1 }); }} className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="all">全部</TabsTrigger>
                            <TabsTrigger value="0">待审核</TabsTrigger>
                            <TabsTrigger value="1">已发布</TabsTrigger>
                            <TabsTrigger value="2">已拒绝</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜索留言内容、署名..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Batch Actions Toolbar */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-medium px-2">已选择 {selectedIds.length} 项:</span>
                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedIds)}>
                            <CheckCircle className="mr-2 h-4 w-4" /> 批量通过
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => openRejectDialog(selectedIds)}>
                            <XCircle className="mr-2 h-4 w-4" /> 批量拒绝
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(selectedIds)}>
                            <Trash2 className="mr-2 h-4 w-4" /> 批量删除
                        </Button>
                        <div className="flex-1" />
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>取消选择</Button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={messages.length > 0 && selectedIds.length === messages.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[300px]">留言内容</TableHead>
                            <TableHead>署名</TableHead>
                            <TableHead>样式</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>时间</TableHead>
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
                        ) : messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    未找到留言。
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(msg.id)}
                                            onCheckedChange={(checked) => handleSelectOne(msg.id, checked as boolean)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate font-medium" title={msg.content}>
                                            {msg.content}
                                        </div>
                                    </TableCell>
                                    <TableCell>{msg.signature || <span className="text-muted-foreground italic">匿名</span>}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <span style={{ color: msg.inkColor }}>A</span>
                                            <span>{msg.font?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(msg.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-'}
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
                                                {msg.status === 0 && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleApprove([msg.id])} className="text-green-600">
                                                            <CheckCircle className="mr-2 h-4 w-4" /> 通过审核
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openRejectDialog([msg.id])} className="text-orange-600">
                                                            <XCircle className="mr-2 h-4 w-4" /> 拒绝发布
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                {msg.status === 1 && (
                                                    <DropdownMenuItem onClick={() => openRejectDialog([msg.id])} className="text-orange-600">
                                                        <XCircle className="mr-2 h-4 w-4" /> 撤回/拒绝
                                                    </DropdownMenuItem>
                                                )}
                                                {(msg.status === 2 || msg.status === 1) && (
                                                    <DropdownMenuItem onClick={() => handleApprove([msg.id])} className="text-green-600">
                                                        <CheckCircle className="mr-2 h-4 w-4" /> 重新发布
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete([msg.id])}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> 删除留言
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

            {/* Pagination */}
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

            {/* Reject Reason Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>拒绝理由</DialogTitle>
                        <DialogDescription>
                            请输入拒绝这条留言的原因（可选）。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="reason" className="sr-only">原因</Label>
                        <Textarea
                            id="reason"
                            placeholder="例如：含有不当言论..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectOpen(false)}>取消</Button>
                        <Button variant="destructive" onClick={handleRejectSubmit}>确认拒绝</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessageManagement;
