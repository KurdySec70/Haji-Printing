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
        $isProduction = config('app.env') === 'production';
        $appUrl = rtrim(config('app.url'), '/');
        $request = $this->app['request'];
        $currentOrigin = $request?->getSchemeAndHttpHost();

        // Configure URLs based on environment
        if ($isProduction && $appUrl) {
            \Illuminate\Support\Facades\URL::forceRootUrl($appUrl);
            \Illuminate\Support\Facades\URL::forceScheme('https');
        } elseif ($currentOrigin) {
            \Illuminate\Support\Facades\URL::forceRootUrl($currentOrigin);
        }

        // In production, force use of build files
        if ($isProduction) {
            // Remove hot file before views render (Vite dev server may recreate it)
            \Illuminate\Support\Facades\View::composer('*', function () {
                $hotFile = public_path('hot');
                if (file_exists($hotFile)) {
                    @unlink($hotFile);
                }
            });
            
            // Explicitly set Vite to use build directory
            \Illuminate\Support\Facades\Vite::useBuildDirectory('build');
        }

        // Configure Inertia
        if (class_exists('\Inertia\Inertia')) {
            $sharedUrl = $isProduction && $appUrl ? $appUrl : ($currentOrigin ?: $appUrl);
            
            \Inertia\Inertia::share([
                'app' => [
                    'name' => config('app.name'),
                    'url' => $sharedUrl,
                    'asset_url' => config('app.asset_url') ?: $sharedUrl,
                    'storage_url' => $sharedUrl ? $sharedUrl . '/storage' : null,
                    'mail_from_address' => config('mail.from.address'),
                    'mail_from_name' => config('mail.from.name'),
                ],
            ]);
        }

        // Rate limiting
        \Illuminate\Support\Facades\RateLimiter::for('quote-requests', function ($request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(3)->by($request->ip());
        });

        \Illuminate\Support\Facades\RateLimiter::for('api', function ($request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
