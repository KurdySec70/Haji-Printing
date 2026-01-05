<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Inertia\Inertia;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Handle the incoming request.
     */
    public function handle(Request $request, \Closure $next)
    {
        // Set the correct URL for Inertia responses
        \Inertia\Inertia::setRootView('app');

        return parent::handle($request, $next);
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Sets the root template that will be loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     */
    public function rootView(Request $request): string
    {
        return $this->rootView;
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $this->resolveUser($request),
                'isAuthenticated' => (bool) $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'app' => [
                'url' => $this->getCurrentUrl($request),
                'asset_url' => env('ASSET_URL', $this->getCurrentUrl($request)),
                'name' => config('app.name'),
                'env' => config('app.env'),
                'base_path' => env('APP_BASE_PATH', ''),
                'domain' => env('APP_DOMAIN', parse_url(config('app.url'), PHP_URL_HOST)),
                'protocol' => $request->getScheme(),
                'debug' => config('app.debug'),
                'mail_from_address' => config('mail.from.address'),
                'mail_from_name' => config('mail.from.name'),
                'vite_dev_server' => env('VITE_DEV_SERVER_URL', 'http://localhost:5173'),
            ],
        ];
    }

    /**
     * Get the current URL with correct protocol and base path
     */
    private function getCurrentUrl(Request $request): string
    {
        $scheme = $request->getScheme();  // http or https
        $host = $request->getHost();      // localhost
        $port = $request->getPort();      // 80, 443, or custom

        // Build base URL
        $url = $scheme . '://' . $host;

        // Add port if not standard
        if (($scheme === 'http' && $port !== 80) || ($scheme === 'https' && $port !== 443)) {
            $url .= ':' . $port;
        }

        // Add base path if configured
        $basePath = env('APP_BASE_PATH', '');
        if ($basePath) {
            $url .= $basePath;
        }

        return $url;
    }

    private function resolveUser(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
            $user = User::query()
                ->select(['id', 'name', 'email', 'username', 'phone', 'role', 'created_at', 'updated_at'])
                ->where('role', 'admin')
                ->orderBy('id')
                ->first()
                ?? User::query()
                    ->select(['id', 'name', 'email', 'username', 'phone', 'role', 'created_at', 'updated_at'])
                    ->orderBy('id')
                    ->first();
        }

        if (! $user) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'phone' => $user->phone,
            'role' => $user->role,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
