<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandlePrefetchRequests
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is a prefetch request
        if ($request->header('X-Prefetch') === 'true') {
            // Add prefetch headers to response
            $response = $next($request);
            
            // Add cache headers for prefetched content
            $response->headers->set('X-Prefetched', 'true');
            $response->headers->set('Cache-Control', 'public, max-age=300'); // 5 minutes
            
            // Add priority header
            $priority = $request->header('X-Priority', 'normal');
            $response->headers->set('X-Priority', $priority);
            
            return $response;
        }

        return $next($request);
    }
}
