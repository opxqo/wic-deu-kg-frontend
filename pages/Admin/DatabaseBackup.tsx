import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Server,
    HardDrive,
    Table,
    FileText,
    Save,
    Clock,
    Download,
    AlertCircle,
    RefreshCw,
    CheckCircle2
} from "lucide-react";
import { databaseService, DatabaseBackupInfo } from '../../services/databaseService';
import { useToast } from "@/hooks/use-toast";

const DatabaseBackup: React.FC = () => {
    const [data, setData] = useState<DatabaseBackupInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [backingUp, setBackingUp] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await databaseService.getBackupInfo();
            if (result.code === 0 && result.data) {
                setData(result.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "获取数据失败",
                    description: result.message || "无法加载数据库信息"
                });
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "网络错误",
                description: e.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBackup = async () => {
        setBackingUp(true);
        try {
            const result = await databaseService.executeBackup();
            if (result.code === 0 && result.data) {
                setData(result.data);
                toast({
                    title: "备份成功",
                    description: "数据库备份已完成",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "备份失败",
                    description: result.message || "执行备份时出现错误"
                });
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "操作失败",
                description: e.message
            });
        } finally {
            setBackingUp(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive">无法加载数据</p>
                <Button onClick={fetchData} variant="outline">重试</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">数据库备份</h2>
                    <p className="text-muted-foreground">管理数据库状态与备份</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData} disabled={loading || backingUp}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        刷新
                    </Button>
                    <Button onClick={handleBackup} disabled={backingUp}>
                        {backingUp ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {backingUp ? '备份中...' : '立即备份'}
                    </Button>
                </div>
            </div>

            {/* 概览卡片 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">数据库名称</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.databaseName}</div>
                        <p className="text-xs text-muted-foreground">{data?.databaseVersion}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">总大小</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.databaseSizeFormatted}</div>
                        <p className="text-xs text-muted-foreground">{data?.databaseSizeBytes} bytes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">表数量</CardTitle>
                        <Table className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.tableCount}</div>
                        <p className="text-xs text-muted-foreground">总记录数: {data?.totalRecords}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">上次备份</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {data?.backupTime ? (
                            <>
                                <div className="text-sm font-bold truncate" title={data.backupTime}>
                                    {new Date(data.backupTime).toLocaleString()}
                                </div>
                                {data.backupFileUrl && (
                                    <a
                                        href={data.backupFileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center mt-1"
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        下载备份文件
                                    </a>
                                )}
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">无备份记录</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 表详情列表 */}
            <Card>
                <CardHeader>
                    <CardTitle>数据表详情</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">表名</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">说明</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">记录数</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">数据大小</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">更新时间</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {data?.tables.map((table) => (
                                        <tr key={table.tableName} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{table.tableName}</td>
                                            <td className="p-4 align-middle text-muted-foreground">{table.tableComment || '-'}</td>
                                            <td className="p-4 align-middle text-right">{table.rowCount}</td>
                                            <td className="p-4 align-middle text-right">{table.dataSizeFormatted}</td>
                                            <td className="p-4 align-middle text-right">
                                                {table.updateTime ? new Date(table.updateTime).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DatabaseBackup;
