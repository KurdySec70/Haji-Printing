import React, { useState, useEffect } from 'react';
import { usePrefetch } from '@/hooks/usePrefetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Database, Clock, Trash2, RefreshCw } from 'lucide-react';

interface PerformanceStats {
    navigationTime: number;
    cacheHitRate: number;
    prefetchCount: number;
    activePrefetches: number;
    cacheSize: number;
}

/**
 * Performance Monitor Component
 * Shows real-time performance metrics and cache statistics
 */
export function PerformanceMonitor() {
    const [stats, setStats] = useState<PerformanceStats>({
        navigationTime: 0,
        cacheHitRate: 0,
        prefetchCount: 0,
        activePrefetches: 0,
        cacheSize: 0,
    });
    const [isVisible, setIsVisible] = useState(false);
    const { getPrefetchStats, clearCache } = usePrefetch();

    // Update stats periodically
    useEffect(() => {
        if (!isVisible) return;

        const updateStats = () => {
            const prefetchStats = getPrefetchStats();
            
            setStats(prev => ({
                ...prev,
                prefetchCount: prefetchStats.cacheSize,
                activePrefetches: prefetchStats.activePrefetches,
                cacheSize: prefetchStats.cacheSize,
            }));
        };

        const interval = setInterval(updateStats, 2000);
        updateStats(); // Initial update

        return () => clearInterval(interval);
    }, [isVisible, getPrefetchStats]);

    // Monitor navigation performance
    useEffect(() => {
        const measureNavigation = () => {
            const start = performance.now();
            
            return () => {
                const end = performance.now();
                const duration = end - start;
                
                setStats(prev => ({
                    ...prev,
                    navigationTime: duration,
                }));
            };
        };

        // Listen for navigation events
        measureNavigation();
        
        // This would be called when navigation completes
        // In a real implementation, you'd hook into Inertia's navigation events
        
        return () => {
            // Cleanup
        };
    }, []);

    if (!isVisible) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setIsVisible(true)}
                    size="sm"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                >
                    <Activity className="w-4 h-4 mr-2" />
                    Performance
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            Performance Monitor
                        </CardTitle>
                        <div className="flex gap-1">
                            <Button
                                onClick={() => {
                                    clearCache();
                                    setStats(prev => ({ ...prev, cacheSize: 0 }));
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                            <Button
                                onClick={() => setIsVisible(false)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                            >
                                ×
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-3">
                    {/* Navigation Time */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Navigation</span>
                        </div>
                        <Badge 
                            variant={stats.navigationTime < 200 ? "default" : stats.navigationTime < 500 ? "secondary" : "destructive"}
                            className="text-xs"
                        >
                            {stats.navigationTime.toFixed(0)}ms
                        </Badge>
                    </div>

                    {/* Cache Hit Rate */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Cache Hit Rate</span>
                        </div>
                        <Badge 
                            variant={stats.cacheHitRate > 80 ? "default" : stats.cacheHitRate > 60 ? "secondary" : "destructive"}
                            className="text-xs"
                        >
                            {stats.cacheHitRate.toFixed(1)}%
                        </Badge>
                    </div>

                    {/* Prefetch Count */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Prefetched</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {stats.prefetchCount} pages
                        </Badge>
                    </div>

                    {/* Active Prefetches */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Active</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {stats.activePrefetches} loading
                        </Badge>
                    </div>

                    {/* Performance Status */}
                    <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Status</span>
                            <Badge 
                                variant={
                                    stats.navigationTime < 200 && stats.cacheHitRate > 80 
                                        ? "default" 
                                        : "secondary"
                                }
                                className="text-xs"
                            >
                                {stats.navigationTime < 200 && stats.cacheHitRate > 80 
                                    ? "Excellent" 
                                    : stats.navigationTime < 500 
                                        ? "Good" 
                                        : "Needs Optimization"
                                }
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default PerformanceMonitor;
