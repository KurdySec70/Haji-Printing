<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PointOfSaleController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ContactController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (no authentication required)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/posts', function () {
    $posts = Post::orderBy('created_at', 'desc')->get();
    return Inertia::render('posts', [
        'posts' => $posts
    ]);
})->name('posts');

// Contact form routes
Route::post('/contact', [ContactController::class, 'sendContactForm'])->name('contact.send');
Route::post('/contact/initiate', [ContactController::class, 'initiateContact'])->name('contact.initiate');
Route::post('/contact/verify', [ContactController::class, 'verifyAndSend'])->name('contact.verify');

// Temporary invoice page (public - accessible with temporary link)
Route::get('/invoice-temp/{tempId}', [App\Http\Controllers\InvoiceController::class, 'showTempInvoice'])
    ->name('invoice.temp');

// Temporary offer page (public - accessible with temporary link)
Route::get('/offer-temp/{tempId}', [App\Http\Controllers\InvoiceController::class, 'showTempOffer'])
    ->name('offer.temp');

// Dynamic image serving routes (robust fallback for storage issues)
Route::get('/serve/{path}', [App\Http\Controllers\ImageController::class, 'serve'])
    ->where('path', '.*')
    ->name('storage.serve');

// CSRF token endpoint removed - no tokens required

// Auth routes (login/logout - public)
require __DIR__.'/auth.php';

Route::get('admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
Route::get('admin/users', [AdminController::class, 'users'])->name('admin.users');
Route::get('admin/point-of-sale', [PointOfSaleController::class, 'index'])->name('admin.point-of-sale');

// Role-based route groups - require appropriate role
require __DIR__.'/admin.php';
require __DIR__.'/cashier.php';
require __DIR__.'/customer.php';

// Fallback route for undefined routes
Route::fallback(function () {
    return Inertia::render('errors/404', [
        'message' => 'The page you are looking for could not be found.'
    ])->toResponse(request())->setStatusCode(404);
});
