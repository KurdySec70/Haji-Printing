<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Product;
use App\Models\BusinessSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function dashboard(Request $request): Response
    {
        // Get date range for statistics (default to last 30 days)
        $dateFrom = $request->get('date_from', now()->subDays(30)->startOfDay()->format('Y-m-d H:i:s'));
        $dateTo = $request->get('date_to', now()->endOfDay()->format('Y-m-d H:i:s'));

        // Get dashboard statistics
        $stats = $this->getDashboardStats($dateFrom, $dateTo);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'dateRange' => [
                'from' => $request->get('date_from', now()->subDays(30)->format('Y-m-d')),
                'to' => $request->get('date_to', now()->format('Y-m-d'))
            ]
        ]);
    }

    /**
     * Get dashboard statistics with optimized queries
     */
    private function getDashboardStats(string $dateFrom, string $dateTo): array
    {
        // Use single query with subqueries for better performance
        $stats = DB::select("
            SELECT 
                (SELECT COUNT(*) FROM transactions WHERE transaction_date BETWEEN ? AND ?) as total_transactions,
                (SELECT COALESCE(SUM(grand_total), 0) FROM transactions WHERE transaction_date BETWEEN ? AND ?) as total_revenue,
                (SELECT COALESCE(SUM(grand_total), 0) FROM transactions WHERE transaction_date BETWEEN ? AND ? AND status = 'paid') as paid_revenue,
                (SELECT COALESCE(SUM(grand_total), 0) FROM transactions WHERE transaction_date BETWEEN ? AND ? AND status = 'debt') as debt_revenue,
                (SELECT COUNT(*) FROM transactions WHERE transaction_date BETWEEN ? AND ? AND type = 'offer' AND offer_status = 'pending') as pending_offers,
                (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
                (SELECT COUNT(*) FROM products) as total_products
        ", [
            $dateFrom, $dateTo, $dateFrom, $dateTo, $dateFrom, $dateTo, $dateFrom, $dateTo,
            $dateFrom, $dateTo
        ]);

        $transactionStats = $stats[0];

        // Optimize recent transactions query (including offers)
        $recentTransactions = Transaction::select(['id', 'order_id', 'customer_id', 'cashier_id', 'grand_total', 'status', 'type', 'offer_status', 'transaction_date'])
            ->with(['customer:id,name', 'cashier:id,name'])
            ->orderBy('transaction_date', 'desc')
            ->limit(5)
            ->get();

        // Optimize top customers query
        $topCustomers = Transaction::select(['customer_id', DB::raw('SUM(grand_total) as total_spent'), DB::raw('COUNT(*) as transaction_count')])
            ->with('customer:id,name')
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->groupBy('customer_id')
            ->orderBy('total_spent', 'desc')
            ->limit(5)
            ->get();

        // Optimize daily revenue query
        $dailyRevenue = Transaction::selectRaw('DATE(transaction_date) as date, SUM(grand_total) as revenue')
            ->whereBetween('transaction_date', [now()->subDays(7), now()])
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'overview' => [
                'total_revenue' => (float) ($transactionStats->total_revenue ?? 0),
                'total_transactions' => (int) ($transactionStats->total_transactions ?? 0),
                'total_customers' => (int) ($transactionStats->total_customers ?? 0),
                'total_products' => (int) ($transactionStats->total_products ?? 0),
            ],
            'revenue' => [
                'paid_revenue' => (float) ($transactionStats->paid_revenue ?? 0),
                'debt_revenue' => (float) ($transactionStats->debt_revenue ?? 0),
            ],
            'offers' => [
                'pending_offers' => (int) ($transactionStats->pending_offers ?? 0),
            ],
            'recent_transactions' => $recentTransactions,
            'top_customers' => $topCustomers,
            'daily_revenue' => $dailyRevenue,
        ];
    }

    /**
     * Show the products page.
     */
    public function products(): Response
    {
        return Inertia::render('admin/products');
    }

    /**
     * Show the users page.
     */
    public function users(): Response
    {
        return Inertia::render('admin/users');
    }

    /**
     * Show the point of sale page.
     */
    public function pointOfSale(): Response
    {
        return Inertia::render('admin/point-of-sale');
    }

    /**
     * Update business settings.
     */
    public function updateBusinessSettings(Request $request)
    {
        $validatedData = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_slogan' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'primary_phone' => 'required|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
        ]);

        try {
            BusinessSettings::updateSettings($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Business information updated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update business information.'
            ], 500);
        }
    }

    /**
     * Get business settings for settings page.
     */
    public function getBusinessSettings()
    {
        $settings = BusinessSettings::getSettings();

        return response()->json([
            'settings' => $settings
        ]);
    }

    /**
     * Create a database backup.
     */
    public function createBackup(Request $request)
    {
        try {
            $filename = 'haji_backup_' . date('Y_m_d_H_i_s') . '.sql';
            $backupPath = storage_path('app/backups');

            // Create backups directory if it doesn't exist
            if (!file_exists($backupPath)) {
                mkdir($backupPath, 0755, true);
            }

            $fullPath = $backupPath . DIRECTORY_SEPARATOR . $filename;

            // Use Laravel's DB facade to create a simple backup
            $this->createSimpleBackup($fullPath);

            if (file_exists($fullPath) && filesize($fullPath) > 0) {
                // Store backup info in session for download
                session(['latest_backup' => $filename]);

                // Return success response for Inertia
                return back()->with('success', 'Database backup created successfully.');
            } else {
                return back()->withErrors(['backup' => 'Failed to create database backup.']);
            }

        } catch (\Exception $e) {
            \Log::error('Backup failed: ' . $e->getMessage());
            return back()->withErrors(['backup' => 'Backup failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Create a simple database backup using Laravel's DB facade.
     */
    private function createSimpleBackup($filePath)
    {
        $database = config('database.connections.mysql.database');

        // Get all table names
        $tables = \DB::select('SHOW TABLES');
        $tableKey = 'Tables_in_' . $database;

        $sql = "-- Database backup created on " . now()->toDateTimeString() . "\n";
        $sql .= "-- Database: {$database}\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $table) {
            $tableName = $table->$tableKey;

            // Get table structure
            $createTable = \DB::select("SHOW CREATE TABLE `{$tableName}`");
            $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
            $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

            // Get table data
            $rows = \DB::table($tableName)->get();

            if ($rows->count() > 0) {
                $sql .= "INSERT INTO `{$tableName}` VALUES\n";
                $values = [];

                foreach ($rows as $row) {
                    $rowArray = (array) $row;
                    $escapedValues = array_map(function($value) {
                        return $value === null ? 'NULL' : "'" . addslashes($value) . "'";
                    }, $rowArray);
                    $values[] = '(' . implode(',', $escapedValues) . ')';
                }

                $sql .= implode(",\n", $values) . ";\n\n";
            }
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

        // Write to file
        file_put_contents($filePath, $sql);
    }

    /**
     * Download the latest database backup.
     */
    public function downloadBackup()
    {
        try {
            $latestBackup = session('latest_backup');
            $backupPath = storage_path('app/backups');

            if (!$latestBackup) {
                // Get the most recent backup file
                $files = glob($backupPath . DIRECTORY_SEPARATOR . 'haji_backup_*.sql');
                if (empty($files)) {
                    abort(404, 'No backup files found. Please create a backup first.');
                }

                // Get the latest file
                usort($files, function($a, $b) {
                    return filemtime($b) - filemtime($a);
                });

                $latestBackup = basename($files[0]);
            }

            $filePath = $backupPath . DIRECTORY_SEPARATOR . $latestBackup;

            if (!file_exists($filePath)) {
                abort(404, 'Backup file not found.');
            }

            return response()->download($filePath, $latestBackup, [
                'Content-Type' => 'application/sql',
                'Content-Disposition' => 'attachment; filename="' . $latestBackup . '"'
            ]);

        } catch (\Exception $e) {
            \Log::error('Download failed: ' . $e->getMessage());
            abort(500, 'Download failed: ' . $e->getMessage());
        }
    }
}