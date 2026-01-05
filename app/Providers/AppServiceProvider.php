<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Determine base URL for current context
        $request = $this->app['request'];
        $isProduction = config('app.env') === 'production';
        $appUrl = rtrim(config('app.url'), '/');
        $currentOrigin = $request?->getSchemeAndHttpHost();

        if ($isProduction) {
            // In prod, honor configured APP_URL and HTTPS
            \Illuminate\Support\Facades\URL::forceScheme('https');
            if ($appUrl) {
                \Illuminate\Support\Facades\URL::forceRootUrl($appUrl);
            }
            $this->app['request']->server->set('HTTPS', true);
        } else {
            // In local/dev, avoid SSL mismatches by using the current request origin
            if ($currentOrigin) {
                \Illuminate\Support\Facades\URL::forceRootUrl($currentOrigin);
            }
        }

        // Configure Vite for subdirectory deployment
        \Illuminate\Support\Facades\Vite::createAssetPathsUsing(function ($path, $secure = null) {
            // Always use the configured APP_URL for build assets
            if (str_starts_with($path, 'build/')) {
                return rtrim(config('app.url'), '/') . '/' . $path;
            }
            
            // For other paths, use the default asset helper
            return asset($path, $secure);
        });

        // Configure URL generator for subdirectory deployment
        if ($isProduction && $appUrl) {
            \Illuminate\Support\Facades\URL::forceRootUrl($appUrl);
        }

        // Configure Inertia to use the correct URL and provide asset URL
        if (class_exists('\Inertia\Inertia')) {
            $sharedUrl = $isProduction && $appUrl ? $appUrl : ($currentOrigin ?: $appUrl);
            $sharedAssetUrl = config('app.asset_url') ?: $sharedUrl;
            $sharedStorageUrl = $sharedUrl ? $sharedUrl . '/storage' : null;

            \Inertia\Inertia::share([
                'app' => [
                    'name' => config('app.name'),
                    'url' => $sharedUrl,
                    'asset_url' => $sharedAssetUrl,
                    'storage_url' => $sharedStorageUrl,
                    'mail_from_address' => config('mail.from.address'),
                    'mail_from_name' => config('mail.from.name'),
                ],
            ]);
        }


        // Configure rate limiting for quote requests
        \Illuminate\Support\Facades\RateLimiter::for('quote-requests', function ($request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(3)->by($request->ip());
        });

        // Configure rate limiting for API requests
        \Illuminate\Support\Facades\RateLimiter::for('api', function ($request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
