import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { configService, SysConfigVO } from '../../services/configService';
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
    const [config, setConfig] = useState<SysConfigVO>({
        maintenanceMode: false,
        openRegistration: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const result = await configService.getSystemConfig();
            if (result.code === 0 && result.data) {
                setConfig(result.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "获取配置失败",
                    description: result.message
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "网络错误",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await configService.updateSystemConfig(config);
            if (result.code === 0) {
                toast({ title: "保存成功", description: "系统配置已更新" });
                if (result.data) setConfig(result.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "保存失败",
                    description: result.message
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "操作失败",
                description: error.message
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">系统设置</h2>
                <p className="text-muted-foreground">管理系统参数与配置</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>基本设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
                            <span>维护模式</span>
                            <span className="font-normal text-xs text-muted-foreground">开启后普通用户将无法访问系统</span>
                        </Label>
                        <Switch
                            id="maintenance-mode"
                            checked={config.maintenanceMode}
                            onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="registration" className="flex flex-col space-y-1">
                            <span>开放注册</span>
                            <span className="font-normal text-xs text-muted-foreground">允许新用户自行注册账号</span>
                        </Label>
                        <Switch
                            id="registration"
                            checked={config.openRegistration}
                            onCheckedChange={(checked) => setConfig({ ...config, openRegistration: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                    保存更改
                </Button>
            </div>
        </div>
    );
};

export default Settings;
