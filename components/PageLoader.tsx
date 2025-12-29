import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const PageLoader: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`flex h-screen w-full items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-wic-bg'}`}>
            <Loader2 className={`h-8 w-8 animate-spin ${isDark ? 'text-primary' : 'text-wic-primary'}`} />
        </div>
    );
};

export default PageLoader;
