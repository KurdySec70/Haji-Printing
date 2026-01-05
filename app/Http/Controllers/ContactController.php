<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class ContactController extends Controller
{
    /**
     * Initiate contact form with email verification
     */
    public function initiateContact(Request $request)
    {
        // Rate limiting: 3 attempts per hour per IP
        $rateLimitKey = 'contact_initiate:' . $request->ip();
        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            return response()->json([
                'success' => false,
                'message' => 'Too many attempts. Please try again later.'
            ], 429);
        }

        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($rateLimitKey, 3600); // 1 hour
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate 6-digit verification code
            $verificationCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

            // Store form data and verification code in cache (10 minutes)
            $cacheKey = "contact_verify_{$request->email}";
            Cache::put($cacheKey, [
                'code' => $verificationCode,
                'form_data' => $request->all(),
                'attempts' => 0
            ], 600); // 10 minutes

            // Send verification email
            $emailData = [
                'name' => $request->name,
                'verification_code' => $verificationCode,
                'business_name' => config('mail.from.name', config('app.name'))
            ];

            Mail::send('emails.contact-verification', $emailData, function ($message) use ($request, $emailData) {
                $message->to($request->email, $request->name)
                        ->subject('Verification Code - ' . $emailData['business_name']);
            });

            RateLimiter::hit($rateLimitKey, 3600); // Track attempt

            Log::info('Contact verification email sent', [
                'email' => $request->email,
                'name' => $request->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent to your email. Please check your inbox.'
            ]);

        } catch (\Exception $e) {
            RateLimiter::hit($rateLimitKey, 3600);

            Log::error('Contact verification email failed', [
                'error' => $e->getMessage(),
                'email' => $request->email,
                'name' => $request->name
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification email. Please try again later.'
            ], 500);
        }
    }

    /**
     * Verify email and send contact form
     */
    public function verifyAndSend(Request $request)
    {
        // Rate limiting for verification attempts
        $rateLimitKey = 'contact_verify:' . $request->ip();
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            return response()->json([
                'success' => false,
                'message' => 'Too many verification attempts. Please try again later.'
            ], 429);
        }

        // Validate the verification request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'verification_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($rateLimitKey, 900); // 15 minutes
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification data',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $cacheKey = "contact_verify_{$request->email}";
            $cached = Cache::get($cacheKey);

            if (!$cached) {
                RateLimiter::hit($rateLimitKey, 900);
                return response()->json([
                    'success' => false,
                    'message' => 'Verification code expired or invalid. Please request a new one.'
                ], 400);
            }

            // Check verification attempts
            if ($cached['attempts'] >= 3) {
                Cache::forget($cacheKey);
                RateLimiter::hit($rateLimitKey, 900);
                return response()->json([
                    'success' => false,
                    'message' => 'Too many failed attempts. Please request a new verification code.'
                ], 400);
            }

            // Verify code
            if ($cached['code'] !== $request->verification_code) {
                // Increment attempts
                $cached['attempts']++;
                Cache::put($cacheKey, $cached, 600);
                RateLimiter::hit($rateLimitKey, 900);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code. ' . (3 - $cached['attempts']) . ' attempts remaining.'
                ], 400);
            }

            // Code is valid - send the actual contact form
            $formData = $cached['form_data'];

            // Get the business email from environment
            $businessEmail = config('mail.from.address');
            $businessName = config('mail.from.name', config('app.name'));

            // Prepare email data
            $emailData = [
                'name' => $formData['name'],
                'phone' => $formData['phone'],
                'email' => $formData['email'],
                'subject' => $formData['subject'],
                'messageContent' => $formData['message'],
                'businessName' => $businessName,
                'businessEmail' => $businessEmail,
                'ip_address' => $request->ip(),
                'timestamp' => now()->format('Y-m-d H:i:s'),
                'verified' => true
            ];

            // Send email to business
            Mail::send('emails.contact-form', $emailData, function ($message) use ($emailData) {
                $message->to($emailData['businessEmail'], $emailData['businessName'])
                        ->subject('✅ Verified Contact: ' . $emailData['subject'])
                        ->replyTo($emailData['email'], $emailData['name']);
            });

            // Send confirmation email to customer
            Mail::send('emails.contact-confirmation', $emailData, function ($message) use ($emailData) {
                $message->to($emailData['email'], $emailData['name'])
                        ->subject('Thank you for contacting ' . $emailData['businessName']);
            });

            // Clean up cache
            Cache::forget($cacheKey);

            Log::info('Verified contact form submitted successfully', [
                'name' => $formData['name'],
                'email' => $formData['email'],
                'phone' => $formData['phone'],
                'subject' => $formData['subject'],
                'verified' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully! We will get back to you soon.'
            ]);

        } catch (\Exception $e) {
            RateLimiter::hit($rateLimitKey, 900);

            Log::error('Verified contact form submission failed', [
                'error' => $e->getMessage(),
                'email' => $request->email
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ], 500);
        }
    }

    /**
     * Legacy method for backward compatibility (optional)
     */
    public function sendContactForm(Request $request)
    {
        // Redirect to new verification flow
        return $this->initiateContact($request);
    }
}
