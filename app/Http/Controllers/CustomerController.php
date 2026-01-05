<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Models\InvoiceSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers (Admin).
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 25);
        $customers = User::where('role', 'customer')
            ->select('id', 'name', 'email', 'phone', 'username', 'role', 'created_at', 'updated_at')
            ->orderBy('name')
            ->paginate($perPage)->withQueryString();

        return Inertia::render('admin/customers', [
            'customers' => $customers,
        ]);
    }

    /**
     * Search customers (Admin).
     */
    public function search(Request $request)
    {
        $query = User::where('role', 'customer');

        if ($request->filled('q') || $request->filled('search')) {
            $search = $request->input('q') ?: $request->input('search');
            if (!empty(trim($search))) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "{$search}%")
                      ->orWhere('email', 'like', "{$search}%")
                      ->orWhere('phone', 'like', "{$search}%");
                });
            }
        }

        $customers = $query->select('id', 'name', 'email', 'phone', 'username', 'role', 'created_at', 'updated_at')
            ->orderBy('name')
            ->limit(20) // Limit results for performance
            ->get();

        return response()->json([
            'success' => true,
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created customer (Admin).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:25',
            'password' => 'required|string|min:8',
            'username' => 'nullable|string|max:255|unique:users,username',
        ]);

        // Generate username if not provided
        $username = $request->username;
        if (empty($username)) {
            $username = $this->generateUsername($request->name, $request->email);
        }

        $customer = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $username,
            'phone' => $request->phone,
            'password' => bcrypt($request->password),
            'role' => 'customer',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'customer' => $customer->only(['id', 'name', 'email', 'phone', 'username', 'role', 'created_at', 'updated_at'])
        ], 201);
    }

    /**
     * Display the specified customer (Admin).
     */
    public function show($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified customer (Admin).
     */
    public function update(Request $request, $id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'username' => 'nullable|string|max:255|unique:users,username,' . $id,
            'phone' => 'nullable|string|max:25',
            'password' => 'nullable|string|min:8',
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ];

        // Handle username update
        if ($request->filled('username')) {
            $updateData['username'] = $request->username;
        }

        if ($request->filled('password')) {
            $updateData['password'] = bcrypt($request->password);
        }

        $customer->update($updateData);

        // Return JSON for AJAX requests (like from POS pages)
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully',
                'customer' => $customer->fresh()
            ]);
        }

        // No authentication required
        return redirect()->back()->with('success', 'Customer updated successfully');
    }

    /**
     * Remove the specified customer (Admin).
     */
    public function destroy($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $customer->delete();

        return redirect()->route('admin.customers.index')->with('success', 'Customer deleted successfully');
    }
    /**
     * Display the customer dashboard.
     */
    public function dashboard(Request $request)
    {
        $customer = $request->user();

        if (! $customer || ! $customer->isCustomer()) {
            abort(403, 'Customer access required');
        }

        $aggregates = Transaction::where('customer_id', $customer->id)
            ->selectRaw('COUNT(*) as total_transactions')
            ->selectRaw('COALESCE(SUM(grand_total), 0) as total_spent')
            ->selectRaw("SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_transactions")
            ->selectRaw("SUM(CASE WHEN status = 'debt' THEN 1 ELSE 0 END) as debt_transactions")
            ->selectRaw("SUM(CASE WHEN type = 'offer' THEN 1 ELSE 0 END) as offer_transactions")
            ->selectRaw("COALESCE(SUM(CASE WHEN status = 'debt' THEN grand_total ELSE 0 END), 0) as debt_amount")
            ->selectRaw("COALESCE(SUM(CASE WHEN status = 'paid' THEN grand_total ELSE 0 END), 0) as paid_amount")
            ->selectRaw('MAX(transaction_date) as last_order_date')
            ->first();

        if (! $aggregates) {
            $aggregates = (object) [
                'total_transactions' => 0,
                'total_spent' => 0,
                'paid_transactions' => 0,
                'debt_transactions' => 0,
                'offer_transactions' => 0,
                'debt_amount' => 0,
                'paid_amount' => 0,
                'last_order_date' => null,
            ];
        }

        $stats = [
            'total_transactions' => (int) ($aggregates->total_transactions ?? 0),
            'total_spent' => (float) ($aggregates->total_spent ?? 0),
            'paid_transactions' => (int) ($aggregates->paid_transactions ?? 0),
            'debt_transactions' => (int) ($aggregates->debt_transactions ?? 0),
            'offer_transactions' => (int) ($aggregates->offer_transactions ?? 0),
            'debt_amount' => (float) ($aggregates->debt_amount ?? 0),
            'paid_amount' => (float) ($aggregates->paid_amount ?? 0),
            'last_order_date' => $aggregates->last_order_date
                ? Carbon::parse($aggregates->last_order_date)->toDateTimeString()
                : null,
        ];

        return Inertia::render('customer/dashboard', [
            'customer' => $customer->only(['id', 'name', 'email', 'phone', 'created_at']),
            'stats' => $stats,
        ]);
    }

    /**
     * Get customer's transactions via API.
     */
    public function getTransactions(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = (string) $request->get('search', '');

        $customer = $request->user();

        if (! $customer || ! $customer->isCustomer()) {
            $requestedId = (int) $request->get('customer_id', 0);

            if ($requestedId > 0) {
                $customer = User::where('role', 'customer')
                    ->whereKey($requestedId)
                    ->first();
            }

            if (! $customer) {
                $customer = User::where('role', 'customer')
                    ->orderBy('id')
                    ->first();
            }
        }

        if (! $customer) {
            $empty = Transaction::query()
                ->whereRaw('1 = 0')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'transactions' => $empty,
            ]);
        }

        $query = Transaction::with(['customer:id,name,email,phone', 'cashier:id,name,email'])
            ->where('customer_id', $customer->id);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('offer_status', 'like', "%{$search}%")
                  ->orWhere('items', 'like', "%{$search}%");
            });
        }

        $transactions = $query->orderBy('transaction_date', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Generate a unique username based on name and email.
     */
    private function generateUsername($name, $email)
    {
        // Create base username from name (lowercase, replace spaces with dots)
        $baseUsername = strtolower(str_replace(' ', '.', trim($name)));
        
        // Remove special characters except dots and underscores
        $baseUsername = preg_replace('/[^a-z0-9._]/', '', $baseUsername);
        
        // If base username is empty, use email prefix
        if (empty($baseUsername)) {
            $baseUsername = strtolower(explode('@', $email)[0]);
            $baseUsername = preg_replace('/[^a-z0-9._]/', '', $baseUsername);
        }
        
        // Ensure username is not empty
        if (empty($baseUsername)) {
            $baseUsername = 'customer';
        }
        
        $username = $baseUsername;
        $counter = 1;
        
        // Check if username exists and append number if needed
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }
        
        return $username;
    }

    /**
     * Get recent transactions for notification system
     */
    public function getRecentTransactions(Request $request, $customerId)
    {
        try {
            $targetCustomerId = (int) $customerId;

            if ($targetCustomerId <= 0) {
                $customer = $request->user();

                if ($customer && $customer->isCustomer()) {
                    $targetCustomerId = $customer->id;
                }
            }

            if ($targetCustomerId <= 0) {
                $targetCustomerId = (int) User::where('role', 'customer')
                    ->orderBy('id')
                    ->value('id');
            }

            if ($targetCustomerId <= 0) {
                return response()->json([
                    'success' => true,
                    'transactions' => [],
                ]);
            }

            $recentTransactions = Transaction::where('customer_id', $targetCustomerId)
                ->where('created_at', '>=', now()->subDay())
                ->with('cashier:id,name')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'transactions' => $recentTransactions->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'order_id' => $transaction->order_id,
                        'status' => $transaction->status,
                        'type' => $transaction->type,
                        'offer_status' => $transaction->offer_status,
                        'grand_total' => $transaction->grand_total,
                        'transaction_date' => $transaction->transaction_date,
                        'items' => collect($transaction->items ?? [])->map(function ($item) {
                            return [
                                'id' => $item['id'] ?? null,
                                'name' => $item['name'] ?? null,
                                'quantity' => $item['quantity'] ?? null,
                                'unit_price' => $item['unit_price'] ?? null,
                                'total' => $item['total'] ?? null,
                                'type' => $item['type'] ?? null,
                                'dimensions' => $item['dimensions'] ?? null,
                                'weight' => $item['weight'] ?? null,
                            ];
                        })->values()->all(),
                        'cashier' => $transaction->cashier ? [
                            'id' => $transaction->cashier->id,
                            'name' => $transaction->cashier->name,
                        ] : null,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching recent transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get invoice settings for customer dashboard
     */
    public function getInvoiceSettings(Request $request)
    {
        try {
            // No authentication required
            // Get invoice settings
            $settings = InvoiceSettings::getSettings();
            
            return response()->json([
                'success' => true,
                'settings' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load invoice settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}