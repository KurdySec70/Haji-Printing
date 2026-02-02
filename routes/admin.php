<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PointOfSaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\InvoiceSettingsController;
use App\Http\Controllers\DebtController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    Route::get('products/search', [ProductController::class, 'search'])->name('products.search');
    Route::resource('products', ProductController::class);
    
    Route::resource('users', UserController::class);
    
    Route::get('customers/search', [CustomerController::class, 'search'])->name('customers.search');
    Route::resource('customers', CustomerController::class);
    
    Route::resource('transactions', TransactionController::class);
    
    Route::resource('posts', PostController::class);
    
    Route::get('point-of-sale', [PointOfSaleController::class, 'index'])->name('point-of-sale');

    // Debts routes
    Route::get('debts', [DebtController::class, 'index'])->name('debts.index');
    Route::get('debts/customer/{customerId}', [DebtController::class, 'customerDebts'])->name('debts.customer');
    Route::post('debts/mark-paid/{transactionId}', [DebtController::class, 'markAsPaid'])->name('debts.mark-paid');

    // Invoice Settings API routes
    Route::get('api/invoice-settings', [InvoiceSettingsController::class, 'get'])->name('api.invoice-settings.get');
    Route::post('api/invoice-settings', [InvoiceSettingsController::class, 'update'])->name('api.invoice-settings.update');
    Route::post('api/upload-logo', [InvoiceSettingsController::class, 'uploadLogo'])->name('api.upload-logo');
    Route::post('api/invoice-settings/reset', [InvoiceSettingsController::class, 'reset'])->name('api.invoice-settings.reset');
});

require __DIR__.'/admin/settings.php';
