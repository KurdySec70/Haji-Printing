<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RedisCacheService
{
    /**
     * Remember data in cache with fallback to Laravel cache
     */
    public static function remember(string $key, array $tags, callable $callback, int $ttl = 300)
    {
        try {
            // Try Redis first
            if (self::isRedisAvailable()) {
                $cacheKey = self::generateCacheKey($key, $tags);
                return Cache::store('redis')->remember($cacheKey, $ttl, $callback);
            }
        } catch (\Exception $e) {
            Log::warning('Redis cache failed, falling back to Laravel cache', [
                'error' => $e->getMessage(),
                'key' => $key
            ]);
        }

        // Fallback to Laravel cache
        $cacheKey = self::generateCacheKey($key, $tags);
        return Cache::remember($cacheKey, $ttl, $callback);
    }

    /**
     * Check if Redis is available
     */
    public static function isRedisAvailable(): bool
    {
        try {
            Cache::store('redis')->get('test');
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Generate cache key from base key and tags
     */
    private static function generateCacheKey(string $key, array $tags): string
    {
        $tagString = md5(serialize($tags));
        return "{$key}_{$tagString}";
    }

    /**
     * Clear cache by key
     */
    public static function forget(string $key): bool
    {
        try {
            if (self::isRedisAvailable()) {
                return Cache::store('redis')->forget($key);
            }
        } catch (\Exception $e) {
            Log::warning('Redis cache forget failed', ['error' => $e->getMessage()]);
        }

        return Cache::forget($key);
    }

    /**
     * Clear all cache
     */
    public static function clearAll(): bool
    {
        try {
            if (self::isRedisAvailable()) {
                Cache::store('redis')->flush();
            }
        } catch (\Exception $e) {
            Log::warning('Redis cache clear failed', ['error' => $e->getMessage()]);
        }

        Cache::flush();
        return true;
    }

    /**
     * Clear cache by type
     */
    public static function clearByType(string $type): bool
    {
        try {
            if (self::isRedisAvailable()) {
                $keys = Cache::store('redis')->getRedis()->keys("*{$type}*");
                foreach ($keys as $key) {
                    Cache::store('redis')->forget($key);
                }
            }
        } catch (\Exception $e) {
            Log::warning('Redis cache clear by type failed', ['error' => $e->getMessage()]);
        }

        return true;
    }

    /**
     * Get cache statistics
     */
    public static function getStats(?string $type = null): array
    {
        try {
            if (self::isRedisAvailable()) {
                $redis = Cache::store('redis')->getRedis();
                $keys = $redis->keys($type ? "*{$type}*" : "*");
                
                return [
                    'total_keys' => count($keys),
                    'memory_usage' => $redis->info('memory')['used_memory_human'] ?? 'N/A',
                    'cache_type' => 'Redis'
                ];
            }
        } catch (\Exception $e) {
            Log::warning('Redis cache stats failed', ['error' => $e->getMessage()]);
        }

        return [
            'total_keys' => 0,
            'memory_usage' => 'N/A',
            'cache_type' => 'Laravel Cache (Redis unavailable)'
        ];
    }
}