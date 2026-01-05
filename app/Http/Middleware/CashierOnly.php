<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CashierOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Simple role check - must be logged in as cashier
        if (! auth()->check() || ! auth()->user()->isCashier()) {
            abort(403, 'Cashiers only');
        }

        return $next($request);
    }
}
