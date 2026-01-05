import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    color?: 'blue' | 'emerald' | 'yellow' | 'red' | 'purple' | 'indigo' | 'pink' | 'orange';
    className?: string;
}

const colorVariants = {
    blue: {
        bg: 'from-sky-500 to-sky-600',
        bgLight: 'from-sky-500/10 to-sky-600/10',
        icon: 'text-sky-500',
        trend: 'text-sky-500'
    },
    emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        bgLight: 'from-emerald-500/10 to-emerald-600/10',
        icon: 'text-emerald-500',
        trend: 'text-emerald-500'
    },
    yellow: {
        bg: 'from-amber-500 to-amber-600',
        bgLight: 'from-amber-500/10 to-amber-600/10',
        icon: 'text-amber-500',
        trend: 'text-amber-500'
    },
    red: {
        bg: 'from-red-500 to-red-600',
        bgLight: 'from-red-500/10 to-red-600/10',
        icon: 'text-red-500',
        trend: 'text-red-500'
    },
    purple: {
        bg: 'from-violet-500 to-violet-600',
        bgLight: 'from-violet-500/10 to-violet-600/10',
        icon: 'text-violet-500',
        trend: 'text-violet-500'
    },
    indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        bgLight: 'from-indigo-500/10 to-indigo-600/10',
        icon: 'text-indigo-500',
        trend: 'text-indigo-500'
    },
    pink: {
        bg: 'from-pink-500 to-pink-600',
        bgLight: 'from-pink-500/10 to-pink-600/10',
        icon: 'text-pink-500',
        trend: 'text-pink-500'
    },
    orange: {
        bg: 'bg-[#F58E18]',
        bgLight: 'bg-[#F58E18]/10',
        icon: 'text-[#F58E18]',
        trend: 'text-[#F58E18]'
    }
};

export default function StatsCard({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'blue',
    className = '' 
}: StatsCardProps) {
    const colors = colorVariants[color];

    return (
        <div className={`group relative overflow-hidden bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
            <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color === 'orange' ? 'bg-[#F58E18]' : `bg-gradient-to-br ${colors.bg}`} rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    
                    {/* Trend indicator */}
                    {trend && (
                        <div className={`flex items-center gap-1 ${colors.trend}`}>
                            {trend.isPositive ? (
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            <span className="text-xs sm:text-sm font-medium">
                                {trend.value > 0 ? '+' : ''}{trend.value}%
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {title}
                </div>
                
                {/* Trend label */}
                {trend && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {trend.label}
                    </div>
                )}
            </div>
        </div>
    );
}
