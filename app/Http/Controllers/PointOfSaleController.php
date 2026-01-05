<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class PointOfSaleController extends Controller
{
    /**
     * Display the Point of Sale page.
     */
    public function index(): Response
    {
        $products = Product::orderBy('name')->get();
        
        return Inertia::render('admin/point-of-sale', [
            'products' => $products
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
