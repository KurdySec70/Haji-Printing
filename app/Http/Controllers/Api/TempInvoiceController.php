<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TemporaryInvoiceLink;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class TempInvoiceController extends Controller
{
    /**
     * Create a temporary invoice link
     */
    public function createTempLink(Request $request)
    {
        try {
            // Log the request data for debugging
            \Log::info('TempInvoiceController - Request data:', $request->all());
            
            // Validate the request with more flexible rules
            $validator = Validator::make($request->all(), [
                'transaction_id' => 'required',
                'order_id' => 'required',
                'customer' => 'required|array',
                'customer.name' => 'required',
                'customer.email' => 'nullable',
                'customer.phone' => 'required',
                'items' => 'required|array|min:1',
                'items.*.name' => 'required',
                'items.*.quantity' => 'required|numeric|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
                'items.*.total' => 'required|numeric|min:0',
                'items.*.type' => 'required',
                'items.*.dimensions' => 'nullable',
                'items.*.weight' => 'nullable',
                'subtotal' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'grand_total' => 'required|numeric|min:0',
                'transaction_date' => 'required',
                'status' => 'required',
                'notes' => 'nullable',
                'created_at' => 'required',
                'updated_at' => 'required',
            ]);

            if ($validator->fails()) {
                \Log::error('TempInvoiceController - Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                    'request_data' => $request->all() // Include request data for debugging
                ], 422);
            }

            // Generate unique temporary ID
            $tempId = 'temp_' . time() . '_' . Str::random(12);
            
            // Create temporary invoice link
            $tempLink = TemporaryInvoiceLink::create([
                'temp_id' => $tempId,
                'transaction_data' => $request->all(),
                'expires_at' => Carbon::now()->addHours(3), // 3 hours expiration
            ]);

            // Generate the full URL
            $fullUrl = url("/invoice-temp/{$tempId}");

            return response()->json([
                'success' => true,
                'temp_link' => $fullUrl,
                'temp_id' => $tempId,
                'expires_at' => $tempLink->expires_at->toISOString(),
                'message' => 'Temporary invoice link created successfully'
            ]);

        } catch (\Exception $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create temporary invoice link',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get temporary invoice data by temp ID
     */
    public function getTempInvoiceData($tempId)
    {
        try {
            $tempLink = TemporaryInvoiceLink::where('temp_id', $tempId)->first();

            if (!$tempLink) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice link not found'
                ], 404);
            }

            if ($tempLink->isExpired()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice link has expired'
                ], 410);
            }

            if ($tempLink->is_used) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice link has already been used'
                ], 410);
            }

            // Increment access count
            $tempLink->incrementAccess();

            return response()->json([
                'success' => true,
                'transaction' => $tempLink->transaction_data,
                'temp_id' => $tempId,
                'expires_at' => $tempLink->expires_at->toISOString(),
                'access_count' => $tempLink->access_count + 1
            ]);

        } catch (\Exception $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve invoice data',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Mark temporary invoice link as used
     */
    public function markAsUsed($tempId)
    {
        try {
            $tempLink = TemporaryInvoiceLink::where('temp_id', $tempId)->first();

            if (!$tempLink) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice link not found'
                ], 404);
            }

            $tempLink->markAsUsed();

            return response()->json([
                'success' => true,
                'message' => 'Invoice link marked as used'
            ]);

        } catch (\Exception $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark invoice link as used',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }


    /**
     * Clean up expired links (can be called via cron job)
     */
    public function cleanupExpired()
    {
        try {
            $deletedCount = TemporaryInvoiceLink::cleanupExpired();

            return response()->json([
                'success' => true,
                'message' => "Cleaned up {$deletedCount} expired invoice links"
            ]);

        } catch (\Exception $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to clean up expired links',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
