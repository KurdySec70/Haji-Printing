<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::prefix('customer')->name('customer.')->group(function () {
    Route::get('dashboard', [CustomerController::class, 'dashboard'])->name('dashboard');
});

Route::prefix('customer')->name('customer.')->group(function () {
    Route::get('api/transactions', [CustomerController::class, 'getTransactions'])
        ->name('api.transactions')
        ;

    Route::get('api/{customerId}/recent-transactions', [CustomerController::class, 'getRecentTransactions'])
        ->name('api.recent-transactions')
        ;

    Route::get('api/invoice-settings', [CustomerController::class, 'getInvoiceSettings'])
        ->name('api.invoice-settings')
        ;
});
