<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebtController extends Controller
{
    /**
     * Display customers with debt.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search', '');

        // Get customers with debt transactions
        $query = User::where('role', 'customer')
            ->whereHas('transactions', function ($q) {
                $q->where('status', 'debt')
                  ->where('type', 'transaction'); // Only actual transactions, not offers
            })
            ->select('users.id', 'users.name', 'users.email', 'users.phone', 'users.username', 'users.role', 'users.created_at', 'users.updated_at')
            ->withCount(['transactions as debt_count' => function ($q) {
                $q->where('status', 'debt')
                  ->where('type', 'transaction');
            }])
            ->withSum(['transactions as total_debt' => function ($q) {
                $q->where('status', 'debt')
                  ->where('type', 'transaction');
            }], 'grand_total');

        // Apply search filter
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderByDesc('total_debt')
            ->paginate($perPage)
            ->withQueryString();

        // Calculate total debt amount across all customers
        $totalDebtAmount = Transaction::where('status', 'debt')
            ->where('type', 'transaction')
            ->sum('grand_total');

        // Count total customers with debt
        $totalCustomersWithDebt = User::where('role', 'customer')
            ->whereHas('transactions', function ($q) {
                $q->where('status', 'debt')
                  ->where('type', 'transaction');
            })
            ->count();

        return Inertia::render('admin/debts', [
            'customers' => $customers,
            'stats' => [
                'total_debt_amount' => (float) $totalDebtAmount,
                'total_customers_with_debt' => $totalCustomersWithDebt,
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Get debt transactions for a specific customer.
     */
    public function customerDebts(Request $request, $customerId)
    {
        $customer = User::where('role', 'customer')->findOrFail($customerId);

        $transactions = Transaction::where('customer_id', $customerId)
            ->where('status', 'debt')
            ->where('type', 'transaction')
            ->with(['cashier:id,name'])
            ->orderBy('transaction_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'customer' => $customer->only(['id', 'name', 'email', 'phone']),
            'transactions' => $transactions,
            'total_debt' => $transactions->sum('grand_total'),
        ]);
    }

    /**
     * Mark a transaction as paid.
     */
    public function markAsPaid(Request $request, $transactionId)
    {
        $transaction = Transaction::findOrFail($transactionId);

        if ($transaction->status !== 'debt') {
            return response()->json([
                'success' => false,
                'message' => 'Transaction is not a debt',
            ], 400);
        }

        $transaction->update(['status' => 'paid']);

        return response()->json([
            'success' => true,
            'message' => 'Transaction marked as paid',
            'transaction' => $transaction->fresh(),
        ]);
    }
}
