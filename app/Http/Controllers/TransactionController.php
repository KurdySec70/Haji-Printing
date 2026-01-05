<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationWithInvoiceMail;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions.
     */
    public function index(Request $request)
    {
        // Handle refresh requests with comprehensive cache clearing
        if ($request->has('_refresh') || $request->has('_t') || $request->has('_cache_clear')) {
            try {
                // Clear multiple cache types for comprehensive refresh
                \Illuminate\Support\Facades\Cache::flush();

                // Clear view cache if it exists
                if (function_exists('view')) {
                    \Illuminate\Support\Facades\Artisan::call('view:clear');
                }

                // Clear config cache
                \Illuminate\Support\Facades\Artisan::call('config:clear');

                Log::info('Comprehensive cache clear performed for refresh request');
            } catch (\Exception $e) {
                Log::warning('Cache clearing partially failed during refresh', [
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Force fresh database query for comprehensive refresh
        $result = (function () use ($request) {
            // Ensure fresh query with no model caching
            $query = Transaction::select([
                'id', 'order_id', 'customer_id', 'cashier_id', 'amount', 'status', 'type', 'offer_status',
                'items', 'subtotal', 'discount_amount', 'grand_total', 'transaction_date', 'created_at', 'notes'
            ])->with([
                'customer:id,name,email',
                'cashier:id,name,role'
            ]);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $status = $request->status;
            
            if ($status === 'offer') {
                // Show all offer transactions
                $query->where('type', 'offer');
            } else {
                // Show only regular transactions (not offers) with the specified status
                $query->where('type', 'transaction')
                      ->where('status', $status);
            }
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        if ($request->filled('amount_min')) {
            $query->where('grand_total', '>=', $request->amount_min);
        }

        if ($request->filled('amount_max')) {
            $query->where('grand_total', '<=', $request->amount_max);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('offer_status')) {
            $query->where('offer_status', $request->offer_status);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'transaction_date');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['transaction_date', 'grand_total', 'status', 'order_id'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginate results
        $perPage = $request->get('per_page', 25);
        $transactions = $query->paginate($perPage)->withQueryString();

            // Get customers for filter dropdown
            $customers = User::where('role', 'customer')
                            ->select('id', 'name', 'email')
                            ->orderBy('name')
                            ->get();

            return [
                'transactions' => $transactions,
                'customers' => $customers,
                'filters' => $request->only(['search', 'status', 'customer_id', 'date_from', 'date_to', 'type', 'offer_status', 'sort_by', 'sort_order']),
            ];
        })();

        // Return JSON for API requests (like from the modal)
        if ($request->expectsJson() || $request->has('per_page')) {
            return response()->json([
                'success' => true,
                'transactions' => $result['transactions'],
                'customers' => $result['customers'],
                'filters' => $result['filters'],
            ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
              ->header('Pragma', 'no-cache')
              ->header('Expires', '0');
        }

        // Return Inertia response for page requests
        return Inertia::render('admin/transactions', $result);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'cashier_id' => 'nullable|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:paid,debt',
            'type' => 'nullable|in:transaction,offer',
            'offer_status' => 'nullable|in:pending,accepted_paid,accepted_debt,rejected',
            'notes' => 'nullable|string|max:1000',
            'items' => 'nullable|array',
            'subtotal' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $type = $request->type ?? 'transaction';
            $isOffer = $type === 'offer';

            $transaction = Transaction::create([
                'order_id' => $isOffer ? Transaction::generateOfferId() : Transaction::generateOrderId(),
                'customer_id' => $request->customer_id,
                'cashier_id' => $request->cashier_id ?? null,
                'amount' => $request->amount,
                'status' => $request->status,
                'type' => $type,
                'offer_status' => $isOffer ? ($request->offer_status ?? 'pending') : null,
                'notes' => $request->notes,
                'items' => $request->items,
                'subtotal' => $request->subtotal,
                'discount_amount' => $request->discount_amount ?? 0,
                'grand_total' => $request->grand_total,
                'transaction_date' => now(),
            ]);

            DB::commit();

            Log::info('Transaction created successfully', [
                'transaction_id' => $transaction->id,
                'order_id' => $transaction->order_id,
                'customer_id' => $transaction->customer_id,
                'amount' => $transaction->amount,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'transaction' => $transaction->load('customer'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to create transaction', [
                'error' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create transaction: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['customer', 'cashier']);
        
        return response()->json([
            'success' => true,
            'transaction' => $transaction,
        ]);
    }

    /**
     * Update the specified transaction.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'status' => 'sometimes|in:paid,debt',
            'notes' => 'nullable|string|max:1000',
            'amount' => 'sometimes|numeric|min:0',
            'subtotal' => 'sometimes|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'grand_total' => 'sometimes|numeric|min:0',
        ]);

        try {
            $transaction->update($request->only([
                'status', 'notes', 'amount', 'subtotal', 'discount_amount', 'grand_total'
            ]));

            Log::info('Transaction updated successfully', [
                'transaction_id' => $transaction->id,
                'order_id' => $transaction->order_id,
                'updated_fields' => array_keys($request->only([
                    'status', 'notes', 'amount', 'subtotal', 'discount_amount', 'grand_total'
                ])),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction updated successfully',
                'transaction' => $transaction->load('customer'),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update transaction', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update transaction: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified transaction.
     */
    public function destroy(Transaction $transaction)
    {
        try {
            $orderId = $transaction->order_id;
            $transaction->delete();

            Log::info('Transaction deleted successfully', [
                'order_id' => $orderId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction deleted successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete transaction', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete transaction: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get transaction statistics.
     */
    public function statistics(Request $request)
    {
        $query = Transaction::query();

        // Apply date filter if provided
        if ($request->filled('date_from')) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        $stats = [
            'total_transactions' => $query->count(),
            'total_amount' => $query->sum('grand_total'),
            'paid_transactions' => $query->clone()->where('status', 'paid')->count(),
            'paid_amount' => $query->clone()->where('status', 'paid')->sum('grand_total'),
            'debt_transactions' => $query->clone()->where('status', 'debt')->count(),
            'debt_amount' => $query->clone()->where('status', 'debt')->sum('grand_total'),
        ];

        return response()->json([
            'success' => true,
            'statistics' => $stats,
        ]);
    }

    /**
     * Export transactions to CSV.
     */
    public function export(Request $request)
    {
        $query = Transaction::with('customer');

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $status = $request->status;
            
            if ($status === 'offer') {
                // Show all offer transactions
                $query->where('type', 'offer');
            } else {
                // Show only regular transactions (not offers) with the specified status
                $query->where('type', 'transaction')
                      ->where('status', $status);
            }
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->get();

        $filename = 'transactions_export_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($transactions) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'Order ID',
                'Customer Name',
                'Customer Email',
                'Date',
                'Amount',
                'Status',
                'Notes'
            ]);

            // CSV data
            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->order_id,
                    $transaction->customer_name,
                    $transaction->customer_email,
                    $transaction->transaction_date->format('Y-m-d H:i:s'),
                    $transaction->grand_total,
                    $transaction->status_text,
                    $transaction->notes,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Accept an offer as paid transaction.
     */
    public function acceptOfferAsPaid(Request $request, Transaction $transaction)
    {
        if (!$transaction->isPendingOffer()) {
            return response()->json([
                'message' => 'Transaction is not a pending offer'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $offerId = $transaction->order_id;
            $customerId = $transaction->customer_id;
            $amount = $transaction->grand_total;

            $success = $transaction->acceptAsPaid();

            if ($success) {
                DB::commit();

                Log::info('Offer accepted as paid and converted to transaction', [
                    'original_offer_id' => $offerId,
                    'customer_id' => $customerId,
                    'amount' => $amount,
                    'status' => 'Transaction created and offer deleted'
                ]);

                return response()->json([
                    'message' => 'Offer accepted as paid and converted to transaction successfully'
                ]);
            } else {
                DB::rollback();
                return response()->json([
                    'message' => 'Failed to accept offer as paid'
                ], 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to accept offer as paid', [
                'offer_id' => $transaction->order_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to accept offer as paid'
            ], 500);
        }
    }

    /**
     * Accept an offer as debt transaction.
     */
    public function acceptOfferAsDebt(Request $request, Transaction $transaction)
    {
        if (!$transaction->isPendingOffer()) {
            return response()->json([
                'message' => 'Transaction is not a pending offer'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $offerId = $transaction->order_id;
            $customerId = $transaction->customer_id;
            $amount = $transaction->grand_total;

            $success = $transaction->acceptAsDebt();

            if ($success) {
                DB::commit();

                Log::info('Offer accepted as debt and converted to transaction', [
                    'original_offer_id' => $offerId,
                    'customer_id' => $customerId,
                    'amount' => $amount,
                    'status' => 'Transaction created and offer deleted'
                ]);

                return response()->json([
                    'message' => 'Offer accepted as debt and converted to transaction successfully'
                ]);
            } else {
                DB::rollback();
                return response()->json([
                    'message' => 'Failed to accept offer as debt'
                ], 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to accept offer as debt', [
                'offer_id' => $transaction->order_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to accept offer as debt'
            ], 500);
        }
    }

    /**
     * Reject an offer.
     */
    public function rejectOffer(Request $request, Transaction $transaction)
    {
        if (!$transaction->isPendingOffer()) {
            return response()->json([
                'message' => 'Transaction is not a pending offer'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $offerId = $transaction->order_id;
            $customerId = $transaction->customer_id;
            $amount = $transaction->grand_total;

            $success = $transaction->rejectOffer();

            if ($success) {
                DB::commit();

                Log::info('Offer rejected and deleted', [
                    'offer_id' => $offerId,
                    'customer_id' => $customerId,
                    'amount' => $amount,
                    'status' => 'Offer fully deleted'
                ]);

                return response()->json([
                    'message' => 'Offer rejected and deleted successfully'
                ]);
            } else {
                DB::rollback();
                return response()->json([
                    'message' => 'Failed to reject offer'
                ], 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to reject offer', [
                'offer_id' => $transaction->order_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to reject offer'
            ], 500);
        }
    }


    /**
     * Get all pending offers.
     */
    public function pendingOffers(Request $request)
    {
        $offers = Transaction::pendingOffers()
            ->with(['customer:id,name,email,phone', 'cashier:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($offers);
    }


}
