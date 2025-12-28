import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../UserContext';

const AdminRoute: React.FC = () => {
    const { user, isAuthenticated } = useUser();

    // 1. Check if authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check permissions (Role 1=Organizer, 2=Admin, 3=User)
    // 2. Check permissions (Role 1=Organizer, 2=Admin, 3=User)
    // Only allow Role 1 (Organizer) and 2 (Admin)
    const hasAccess = user.role === 1 || user.role === 2;

    if (!hasAccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-4xl font-bold text-destructive mb-4">403 Forbidden</h1>
                <p className="text-muted-foreground mb-8">您没有权限访问此页面。</p>
                <a href="/" className="text-primary hover:underline">返回首页</a>
            </div>
        );
    }

    // 3. Render child routes (Admin Layout -> Dashboard)
    return <Outlet />;
};

export default AdminRoute;
