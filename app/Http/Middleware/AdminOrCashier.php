<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOrCashier
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->check()) {
            abort(403, 'Authentication required');
        }

        $user = auth()->user();

        if (! $user->isAdmin() && ! $user->isCashier()) {
            abort(403, 'Admins or cashiers only');
        }

        return $next($request);
    }
}