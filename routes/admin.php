<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\InvoiceSettingsController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    Route::get('products/search', [ProductController::class, 'search'])->name('products.search');
    Route::resource('products', ProductController::class);
    
    Route::resource('users', UserController::class);
    
    Route::get('customers/search', [CustomerController::class, 'search'])->name('customers.search');
    Route::resource('customers', CustomerController::class);
    
    Route::resource('transactions', TransactionController::class);
    
    Route::resource('posts', PostController::class);
    
    Route::get('point-of-sale', function () {
        return Inertia::render('admin/point-of-sale');
    })->name('point-of-sale');
    
    // Invoice Settings API routes
    Route::get('api/invoice-settings', [InvoiceSettingsController::class, 'get'])->name('api.invoice-settings.get');
    Route::post('api/invoice-settings', [InvoiceSettingsController::class, 'update'])->name('api.invoice-settings.update');
    Route::post('api/upload-logo', [InvoiceSettingsController::class, 'uploadLogo'])->name('api.upload-logo');
    Route::post('api/invoice-settings/reset', [InvoiceSettingsController::class, 'reset'])->name('api.invoice-settings.reset');
});

require __DIR__.'/admin/settings.php';
