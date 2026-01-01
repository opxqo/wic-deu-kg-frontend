import React from 'react';
import { AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const MaintenanceScreen: React.FC = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="h-20 w-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">系统维护中</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    为了提供更好的服务，我们需要进行短暂的系统维护。请稍后再试。
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                    预计恢复时间：待定
                </p>

                <div className="flex gap-4">
                    {!user ? (
                        <Button onClick={handleLogin} variant="outline" className="gap-2">
                            <LogIn size={16} />
                            管理员登录
                        </Button>
                    ) : (
                        <Button onClick={handleLogout} variant="outline" className="gap-2 text-red-500 hover:text-red-600">
                            <LogOut size={16} />
                            退出登录
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaintenanceScreen;
