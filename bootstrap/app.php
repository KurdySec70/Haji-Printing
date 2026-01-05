<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\GuestOnly;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Remove CSRF protection - no tokens required
        $middleware->validateCsrfTokens(except: ['*']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Configure API middleware to use session-based authentication
        $middleware->api(append: [
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        ]);

        // Register role-based middleware aliases
        $middleware->alias([
            'guest' => GuestOnly::class,
            'quote.security' => \App\Http\Middleware\QuoteRequestSecurity::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, $request) {
            // Handle 404 errors
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                return \Inertia\Inertia::render('errors/404', [
                    'message' => 'The page you are looking for could not be found.'
                ])->toResponse($request)->setStatusCode(404);
            }

            // Handle other HTTP exceptions
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
                $statusCode = $e->getStatusCode();
                
                switch ($statusCode) {
                    case 401:
                        return \Inertia\Inertia::render('errors/401', [
                            'message' => 'You are not authorized to access this page.'
                        ])->toResponse($request)->setStatusCode(401);
                        
                    case 403:
                        return \Inertia\Inertia::render('errors/403', [
                            'message' => 'Access to this page is forbidden.'
                        ])->toResponse($request)->setStatusCode(403);
                        
                    case 410:
                        return \Inertia\Inertia::render('errors/410', [
                            'message' => 'This resource is no longer available.'
                        ])->toResponse($request)->setStatusCode(410);
                        
                    case 422:
                        return \Inertia\Inertia::render('errors/422', [
                            'message' => 'The request could not be processed due to validation errors.'
                        ])->toResponse($request)->setStatusCode(422);
                        
                    case 429:
                        return \Inertia\Inertia::render('errors/429', [
                            'message' => 'Too many requests. Please try again later.',
                            'retryAfter' => 60
                        ])->toResponse($request)->setStatusCode(429);
                        
                    case 500:
                        return \Inertia\Inertia::render('errors/500', [
                            'message' => 'An internal server error occurred.'
                        ])->toResponse($request)->setStatusCode(500);
                        
                    case 503:
                        return \Inertia\Inertia::render('errors/503', [
                            'message' => 'Service temporarily unavailable.',
                            'retryAfter' => 30
                        ])->toResponse($request)->setStatusCode(503);
                }
            }
        });
    })->create();
