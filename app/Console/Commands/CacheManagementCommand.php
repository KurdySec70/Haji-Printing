<?php

namespace App\Console\Commands;

use App\Services\RedisCacheService;
use Illuminate\Console\Command;

class CacheManagementCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cache:manage 
                            {action : The action to perform (warm, clear, stats, flush)}
                            {--tag= : Specific tag to clear}
                            {--type= : Specific cache type to clear}';

    /**
     * The console command description.
     */
    protected $description = 'Manage application cache (warm, clear, stats, flush)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'warm':
                $this->warmCache();
                break;
            case 'clear':
                $this->clearCache();
                break;
            case 'stats':
                $this->showStats();
                break;
            case 'flush':
                $this->flushCache();
                break;
            default:
                $this->error("Unknown action: {$action}");
                $this->info('Available actions: warm, clear, stats, flush');
                return 1;
        }

        return 0;
    }

    /**
     * Warm up the cache
     */
    private function warmCache(): void
    {
        $this->info('Warming up cache...');
        
        try {
            RedisCacheService::warmUp();
            $this->info('✅ Cache warmed up successfully!');
        } catch (\Exception $e) {
            $this->error("❌ Cache warm-up failed: {$e->getMessage()}");
        }
    }

    /**
     * Clear specific cache
     */
    private function clearCache(): void
    {
        $tag = $this->option('tag');
        $type = $this->option('type');

        if ($tag) {
            $this->info("Clearing cache for tag: {$tag}");
            RedisCacheService::forgetByTag($tag);
            $this->info("✅ Cache cleared for tag: {$tag}");
        } elseif ($type) {
            $this->info("Clearing cache for type: {$type}");
            RedisCacheService::forget($type);
            $this->info("✅ Cache cleared for type: {$type}");
        } else {
            $this->error('Please specify --tag or --type option');
        }
    }

    /**
     * Show cache statistics
     */
    private function showStats(): void
    {
        $this->info('📊 Cache Statistics:');
        $this->newLine();

        try {
            $stats = RedisCacheService::getStats();
            $hitRate = RedisCacheService::getHitRate();

            $this->table(
                ['Metric', 'Value'],
                [
                    ['Redis Available', $stats['redis_available'] ? '✅ Yes' : '❌ No'],
                    ['Redis Connected', $stats['redis_connected'] ? '✅ Yes' : '❌ No'],
                    ['Cache Driver', $stats['cache_driver']],
                    ['Memory Usage', $stats['memory_usage']],
                    ['Key Count', $stats['key_count']],
                    ['Hit Rate', number_format($hitRate, 2) . '%'],
                ]
            );

            if ($hitRate > 80) {
                $this->info('🎉 Excellent cache performance!');
            } elseif ($hitRate > 60) {
                $this->info('👍 Good cache performance');
            } else {
                $this->warn('⚠️  Cache performance could be improved');
            }

        } catch (\Exception $e) {
            $this->error("❌ Failed to get cache stats: {$e->getMessage()}");
        }
    }

    /**
     * Flush all cache
     */
    private function flushCache(): void
    {
        if ($this->confirm('Are you sure you want to flush ALL cache? This action cannot be undone.')) {
            $this->info('Flushing all cache...');
            
            try {
                RedisCacheService::flush();
                $this->info('✅ All cache flushed successfully!');
            } catch (\Exception $e) {
                $this->error("❌ Cache flush failed: {$e->getMessage()}");
            }
        } else {
            $this->info('Cache flush cancelled.');
        }
    }
}
