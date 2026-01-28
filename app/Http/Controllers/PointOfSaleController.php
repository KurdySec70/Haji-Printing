<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PointOfSaleController extends Controller
{
    /**
     * Display the Point of Sale page.
     */
    public function index(Request $request): Response
    {
        $products = Product::orderBy('name')->get();
        
        $transactionToEdit = null;
        if ($request->has('edit')) {
            $transactionId = $request->query('edit');
            
            if ($transactionId) {
                $transactionToEdit = Transaction::with(['customer', 'cashier'])
                    ->find($transactionId);
                
                // Ensure items are properly decoded if they exist
                if ($transactionToEdit && $transactionToEdit->items) {
                    // Items should already be decoded by Laravel's array cast, but ensure it's an array
                    if (is_string($transactionToEdit->items)) {
                        $transactionToEdit->items = json_decode($transactionToEdit->items, true);
                    }
                }
            }
        }
        
        return Inertia::render('admin/point-of-sale', [
            'products' => $products,
            'transactionToEdit' => $transactionToEdit
        ]);
    }

    /**
     * Display the Cashier Point of Sale page.
     */
    public function cashierPos(): Response
    {
        $products = Product::orderBy('name')->get();
        
        return Inertia::render('cashier/pos', [
            'products' => $products
        ]);
    }
}
