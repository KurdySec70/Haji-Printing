import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
    variant?: 'default' | 'centered' | 'minimal' | 'elevated';
    size?: 'sm' | 'md' | 'lg';
}

export default function PageHeader({
    title,
    subtitle,
    description,
    actions,
    className,
    variant = 'default',
    size = 'md'
}: PageHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const sizeClasses = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
    };

    const titleSizeClasses = {
        sm: "text-xl font-bold",
        md: "text-2xl font-bold",
        lg: "text-3xl font-bold"
    };

    const subtitleSizeClasses = {
        sm: "text-sm font-medium",
        md: "text-base font-medium",
        lg: "text-lg font-medium"
    };

    const descriptionSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    };

    const variantClasses = {
        default: "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-sm",
        centered: "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-sm text-center",
        minimal: "bg-transparent border-0 shadow-none",
        elevated: "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-sm"
    };

    return (
        <div className={cn(
            "w-full rounded-2xl transition-all duration-300 relative z-30",
            sizeClasses[size],
            variantClasses[variant],
            className
        )}>
            {/* Header Content */}
            <div className="space-y-4">
                {/* Title and Actions Row */}
                <div className={cn(
                    "flex flex-col sm:flex-row items-start sm:justify-between gap-4",
                    variant === 'centered' && "flex-col items-center text-center space-y-4"
                )}>
                    {/* Title Section */}
                    <div className={cn(
                        "flex-1 min-w-0 w-full",
                        variant === 'centered' && "text-center"
                    )}>
                        {/* Title Row with Mobile Menu */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex-1 min-w-0">
                                {/* Title */}
                                <h1 className={cn(
                                    titleSizeClasses[size],
                                    "text-gray-900 dark:text-white leading-tight"
                                )}>
                                    {title}
                                </h1>
                                
                                {/* Subtitle */}
                                {subtitle && (
                                    <p className={cn(
                                        subtitleSizeClasses[size],
                                        "text-gray-600 dark:text-gray-300 mt-1"
                                    )}>
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            
                            {/* Mobile Menu Button - Same line as title */}
                            {actions && (
                                <div className="sm:hidden ml-4 flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="h-10 w-10 p-0 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                                    >
                                        {isMobileMenuOpen ? (
                                            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        ) : (
                                            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                        
                        {/* Description */}
                        {description && (
                            <p className={cn(
                                descriptionSizeClasses[size],
                                "text-gray-500 dark:text-gray-400 mt-2 leading-relaxed",
                                variant === 'centered' ? "max-w-2xl mx-auto" : "max-w-3xl"
                            )}>
                                {description}
                            </p>
                        )}
                    </div>
                    
                    {/* Actions - Desktop Layout */}
                    {actions && (
                        <div className={cn(
                            "hidden sm:flex items-center gap-3 flex-shrink-0",
                            variant === 'centered' && "justify-center"
                        )}>
                            {actions}
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {actions && isMobileMenuOpen && (
                    <div className="sm:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-3">
                            {actions}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Pre-built action components for common use cases
export function PageHeaderActions({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-3", className)}>
            {children}
        </div>
    );
}

export function PageHeaderButton({ 
    children, 
    variant = "default",
    size = "default",
    className,
    ...props 
}: {
    children: ReactNode;
    variant?: "default" | "outline" | "secondary" | "ghost" | "gradient";
    size?: "default" | "sm" | "lg";
    className?: string;
    [key: string]: unknown;
}) {
    const variantClasses = {
        default: "bg-[#F58E18] text-white hover:bg-[#EA580C] shadow-sm transition-colors duration-200",
        outline: "bg-transparent border-2 border-[#F58E18] text-[#F58E18] hover:bg-[#F58E18] hover:text-white shadow-sm transition-colors duration-200",
        secondary: "bg-gray-100 dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333] border border-gray-200 dark:border-gray-800 transition-colors duration-200",
        ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200",
        gradient: "bg-[#F58E18] hover:bg-[#EA580C] text-white shadow-sm transition-colors duration-200 border-0"
    };

    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        default: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <Button
            className={cn(
                "w-full sm:w-auto transition-all duration-300 font-medium rounded-xl border-0 focus:ring-4 focus:ring-[#F58E18]/20",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {children}
        </Button>
    );
}

// Specialized header variants
export function PageHeaderWithStats({ 
    title, 
    subtitle, 
    stats, 
    actions, 
    className,
    variant = 'elevated'
}: {
    title: string;
    subtitle?: string;
    stats?: Array<{
        label: string;
        value: string | number;
        change?: string;
        trend?: 'up' | 'down' | 'neutral';
        icon?: ReactNode;
    }>;
    actions?: ReactNode;
    className?: string;
    variant?: 'default' | 'centered' | 'minimal' | 'elevated';
}) {
    return (
        <div className={cn("space-y-6", className)}>
            {/* Main Header */}
            <PageHeader
                title={title}
                subtitle={subtitle}
                actions={actions}
                variant={variant}
                size="lg"
            />
            
            {/* Stats Grid */}
            {stats && stats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group">
                            <div className="space-y-3">
                                {/* Icon and Trend */}
                                <div className="flex items-center justify-between">
                                    {stat.icon && (
                                        <div className="w-10 h-10 bg-[#F58E18] rounded-lg flex items-center justify-center text-white transition-colors duration-200">
                                            {stat.icon}
                                        </div>
                                    )}
                                    {stat.change && (
                                        <div className={cn(
                                            "text-xs font-semibold px-2.5 py-1 rounded-full",
                                            stat.trend === 'up' && "text-green-600 bg-green-100 dark:bg-green-900/20",
                                            stat.trend === 'down' && "text-red-600 bg-red-100 dark:bg-red-900/20",
                                            stat.trend === 'neutral' && "text-gray-600 bg-gray-100 dark:bg-gray-700"
                                        )}>
                                            {stat.change}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Value and Label */}
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
