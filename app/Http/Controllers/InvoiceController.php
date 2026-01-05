<?php

namespace App\Http\Controllers;

use App\Models\TemporaryInvoiceLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display temporary invoice page
     */
    public function showTempInvoice($tempId)
    {
        try {
            $tempLink = TemporaryInvoiceLink::where('temp_id', $tempId)->first();

            if (!$tempLink) {
                return Inertia::render('errors/404', [
                    'message' => 'Invoice link not found'
                ])->toResponse(request())->setStatusCode(404);
            }

            if ($tempLink->isExpired()) {
                return Inertia::render('errors/410', [
                    'message' => 'Invoice link has expired',
                    'expired_at' => $tempLink->expires_at->format('Y-m-d H:i:s')
                ])->toResponse(request())->setStatusCode(410);
            }

            if ($tempLink->is_used) {
                return Inertia::render('errors/410', [
                    'message' => 'Invoice link has already been used'
                ])->toResponse(request())->setStatusCode(410);
            }

            // Increment access count
            $tempLink->incrementAccess();

            return Inertia::render('invoice-temp', [
                'transaction' => $tempLink->transaction_data,
                'tempId' => $tempId,
                'expiresAt' => $tempLink->expires_at->toISOString(),
                'accessCount' => $tempLink->access_count + 1
            ]);

        } catch (\Exception $e) {
            
            return Inertia::render('errors/500', [
                'message' => 'Failed to load invoice'
            ])->toResponse(request())->setStatusCode(500);
        }
    }


    /**
     * Display temporary offer page
     */
    public function showTempOffer($tempId)
    {
        try {
            $tempLink = TemporaryInvoiceLink::where('temp_id', $tempId)->first();

            if (!$tempLink) {
                return Inertia::render('errors/404', [
                    'message' => 'Offer link not found'
                ])->toResponse(request())->setStatusCode(404);
            }

            if ($tempLink->isExpired()) {
                return Inertia::render('errors/410', [
                    'message' => 'Offer link has expired',
                    'expired_at' => $tempLink->expires_at->format('Y-m-d H:i:s')
                ])->toResponse(request())->setStatusCode(410);
            }

            if ($tempLink->is_used) {
                return Inertia::render('errors/410', [
                    'message' => 'Offer link has already been used'
                ])->toResponse(request())->setStatusCode(410);
            }

            // Increment access count
            $tempLink->incrementAccess();

            return Inertia::render('offer-temp', [
                'transaction' => $tempLink->transaction_data,
                'tempId' => $tempId,
                'expiresAt' => $tempLink->expires_at->toISOString(),
                'accessCount' => $tempLink->access_count + 1
            ]);

        } catch (\Exception $e) {

            return Inertia::render('errors/500', [
                'message' => 'Failed to load offer'
            ])->toResponse(request())->setStatusCode(500);
        }
    }

    /**
     * Mark temporary invoice as used (optional - can be called when PDF is downloaded)
     */
    public function markTempInvoiceAsUsed($tempId)
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
                'message' => 'Invoice marked as used'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to mark invoice as used'
            ], 500);
        }
    }
}
