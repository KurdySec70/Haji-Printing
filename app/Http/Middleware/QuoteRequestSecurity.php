<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class QuoteRequestSecurity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // No security checks required
        return $next($request);
    }
    
    /**
     * Check if IP is permanently blocked
     */
    private function isIpBlocked(string $ip): bool
    {
        return Cache::has("blocked_ip_{$ip}");
    }
    
    /**
     * Check for suspicious request patterns
     */
    private function isSuspiciousRequest(Request $request): bool
    {
        $name = $request->input('name', '');
        $email = $request->input('email', '');
        $message = $request->input('message', '');
        
        // Check for spam patterns
        $spamPatterns = [
            '/\b(viagra|cialis|casino|poker|lottery|winner|congratulations)\b/i',
            '/\b(click here|free money|make money|work from home)\b/i',
            '/\b(bitcoin|cryptocurrency|investment|trading)\b/i',
            '/\b(loan|credit|debt|mortgage|refinance)\b/i',
            '/\b(weight loss|diet pills|supplements)\b/i',
        ];
        
        $textToCheck = $name . ' ' . $email . ' ' . $message;
        
        foreach ($spamPatterns as $pattern) {
            if (preg_match($pattern, $textToCheck)) {
                return true;
            }
        }
        
        // Check for excessive repetition
        if (strlen($message) > 1000 && substr_count($message, substr($message, 0, 50)) > 5) {
            return true;
        }
        
        // Check for suspicious email patterns
        if (preg_match('/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/', $email)) {
            $emailParts = explode('@', $email);
            if (strlen($emailParts[0]) > 50 || substr_count($emailParts[0], '.') > 3) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Temporarily block an IP
     */
    private function temporarilyBlockIp(string $ip, int $minutes): void
    {
        Cache::put("blocked_ip_{$ip}", true, now()->addMinutes($minutes));
    }
    
    /**
     * Track request frequency per IP
     */
    private function trackRequestFrequency(string $ip): void
    {
        $key = "quote_requests_{$ip}";
        $requests = Cache::get($key, []);
        
        // Keep only requests from the last hour
        $requests = array_filter($requests, function ($timestamp) {
            return $timestamp > now()->subHour()->timestamp;
        });
        
        $requests[] = now()->timestamp;
        Cache::put($key, $requests, now()->addHour());
        
        // If more than 10 requests in the last hour, temporarily block
        if (count($requests) > 10) {
            $this->temporarilyBlockIp($ip, 60);
        }
    }
}