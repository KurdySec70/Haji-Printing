<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PointOfSaleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\TransactionController;

Route::prefix('cashier')->name('cashier.')->group(function () {
    Route::get('pos', [PointOfSaleController::class, 'cashierPos'])->name('pos');

    // POS route alias for consistency
    Route::get('point-of-sale', [PointOfSaleController::class, 'cashierPos'])->name('point-of-sale');

    // Product routes for cashiers (full access like admin)
    Route::get('products/search', [ProductController::class, 'search'])->name('products.search');
    Route::resource('products', ProductController::class);

    // Customer routes for cashiers (full access like admin)
    Route::get('customers/search', [CustomerController::class, 'search'])->name('customers.search');
    Route::resource('customers', CustomerController::class);

    // Transaction routes for cashiers (full access like admin)
    Route::resource('transactions', TransactionController::class);

    Route::get('profile', function () {
        return Inertia::render('cashier/profile');
    })->name('profile');
});
