<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Redis Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Redis-based caching system used throughout the application.
    | This provides intelligent caching with TTL, tags, and invalidation strategies.
    |
    */

    'default' => env('REDIS_CACHE_DRIVER', 'redis'),

    'connections' => [
        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            'prefix' => env('REDIS_CACHE_PREFIX', 'haji_cache:'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache TTL Settings
    |--------------------------------------------------------------------------
    |
    | Time-to-live settings for different types of cached data (in seconds).
    | These values determine how long data remains in cache before expiring.
    |
    */

    'ttl' => [
        'dashboard' => env('CACHE_DASHBOARD_TTL', 300),      // 5 minutes
        'products' => env('CACHE_PRODUCTS_TTL', 600),        // 10 minutes
        'customers' => env('CACHE_CUSTOMERS_TTL', 600),      // 10 minutes
        'transactions' => env('CACHE_TRANSACTIONS_TTL', 60), // 1 minute
        'settings' => env('CACHE_SETTINGS_TTL', 1800),       // 30 minutes
        'users' => env('CACHE_USERS_TTL', 300),              // 5 minutes
        'posts' => env('CACHE_POSTS_TTL', 900),              // 15 minutes
        'prefetch' => env('CACHE_PREFETCH_TTL', 300),        // 5 minutes
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Tags
    |--------------------------------------------------------------------------
    |
    | Tags for cache invalidation. When data changes, related caches can be
    | invalidated by tag, providing fine-grained cache control.
    |
    */

    'tags' => [
        'dashboard' => ['dashboard', 'stats'],
        'products' => ['products', 'catalog'],
        'customers' => ['customers', 'users'],
        'transactions' => ['transactions', 'orders'],
        'settings' => ['settings', 'config'],
        'users' => ['users', 'auth'],
        'posts' => ['posts', 'content'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Settings
    |--------------------------------------------------------------------------
    |
    | Settings that affect cache performance and behavior.
    |
    */

    'performance' => [
        'enable_compression' => env('CACHE_COMPRESSION', true),
        'enable_serialization' => env('CACHE_SERIALIZATION', true),
        'max_memory_usage' => env('CACHE_MAX_MEMORY', '256MB'),
        'gc_probability' => env('CACHE_GC_PROBABILITY', 1),
        'gc_divisor' => env('CACHE_GC_DIVISOR', 100),
    ],

    /*
    |--------------------------------------------------------------------------
    | Prefetch Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for intelligent prefetching system.
    |
    */

    'prefetch' => [
        'enabled' => env('PREFETCH_ENABLED', true),
        'hover_delay' => env('PREFETCH_HOVER_DELAY', 200), // milliseconds
        'max_concurrent' => env('PREFETCH_MAX_CONCURRENT', 5),
        'priority_levels' => [
            'high' => 1,
            'normal' => 2,
            'low' => 3,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring Settings
    |--------------------------------------------------------------------------
    |
    | Settings for cache monitoring and statistics.
    |
    */

    'monitoring' => [
        'enabled' => env('CACHE_MONITORING', true),
        'log_hits' => env('CACHE_LOG_HITS', false),
        'log_misses' => env('CACHE_LOG_MISSES', true),
        'log_operations' => env('CACHE_LOG_OPERATIONS', false),
        'stats_interval' => env('CACHE_STATS_INTERVAL', 60), // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Fallback Settings
    |--------------------------------------------------------------------------
    |
    | Fallback behavior when Redis is unavailable.
    |
    */

    'fallback' => [
        'enabled' => env('CACHE_FALLBACK', true),
        'driver' => env('CACHE_FALLBACK_DRIVER', 'file'),
        'graceful_degradation' => env('CACHE_GRACEFUL_DEGRADATION', true),
    ],
];
