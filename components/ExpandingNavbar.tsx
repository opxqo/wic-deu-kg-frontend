import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavLink {
    name: string;
    path: string;
    icon?: React.ElementType;
    iconUrl?: string;
    isExternal?: boolean;
}

interface ExpandingNavbarProps {
    links: NavLink[];
    isTransparent: boolean;
}

export const ExpandingNavbar: React.FC<ExpandingNavbarProps> = ({ links, isTransparent }) => {
    const location = useLocation();

    // Base container styles
    const containerClasses = cn(
        "flex justify-center items-center p-1.5 rounded-2xl transition-all duration-300",
        isTransparent
            ? "bg-black/10 backdrop-blur-md border border-white/10 shadow-sm"
            : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    );

    // Link Item Styles
    // Initial width: w-[60px] (compact) -> hover: w-[130px]
    // Reduced height to 44px to better fit the navbar
    const linkClasses = cn(
        "relative inline-flex items-center justify-center w-[60px] h-[44px] rounded-xl overflow-hidden transition-[width] duration-300 ease-out group text-decoration-none",
        "hover:w-[130px] focus:w-[130px] outline-none"
    );

    return (
        <div className={containerClasses}>
            {links.map((link) => {
                const isActive = location.pathname === link.path;
                const isExternal = link.isExternal;

                // Content for the link (Icon + Text)
                const LinkContent = () => (
                    <>
                        {/* Slide-in Background */}
                        <div className={cn(
                            "absolute inset-0 transform translate-x-full transition-transform duration-300 ease-out origin-right z-0",
                            "group-hover:translate-x-0 group-focus:translate-x-0",
                            isTransparent
                                ? "bg-white/20"
                                : "bg-gray-100 dark:bg-gray-800"
                        )} />

                        {/* Active Indicator (Static Background for current page) */}
                        {!isExternal && isActive && (
                            <div className={cn(
                                "absolute inset-0 z-0",
                                isTransparent
                                    ? "bg-white/10"
                                    : "bg-gray-100/50 dark:bg-gray-800/50"
                            )} />
                        )}

                        {/* Icon Container */}
                        <span className={cn(
                            "absolute left-[18px] z-10 flex items-center justify-center transition-colors duration-300",
                            isActive
                                ? (isTransparent ? "text-white" : "text-wic-primary dark:text-wic-accent")
                                : (isTransparent ? "text-white/80" : "text-gray-600 dark:text-gray-400"),
                            "group-hover:text-white group-hover:dark:text-white" // Optional: change icon color on hover if needed, keeping it simple for now
                        )}>
                            {link.iconUrl ? (
                                <img src={link.iconUrl} alt="" className="h-5 w-auto object-contain" />
                            ) : link.icon ? (
                                <link.icon size={20} />
                            ) : null}
                        </span>

                        {/* Title */}
                        <span className={cn(
                            "absolute left-[40px] whitespace-nowrap opacity-0 transform translate-x-10 transition-all duration-300 ease-out z-10 pl-2",
                            "group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0",
                            "text-sm font-medium",
                            isActive
                                ? (isTransparent ? "text-white" : "text-wic-primary dark:text-wic-accent")
                                : (isTransparent ? "text-white/90" : "text-gray-700 dark:text-gray-200")
                        )}>
                            {link.name}
                        </span>
                    </>
                );

                if (isExternal) {
                    return (
                        <a
                            key={link.path}
                            href={link.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClasses}
                        >
                            <LinkContent />
                        </a>
                    );
                }

                return (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={linkClasses}
                    >
                        <LinkContent />
                    </Link>
                );
            })}
        </div>
    );
};
