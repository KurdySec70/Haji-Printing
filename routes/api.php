<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BatchController;
use App\Http\Controllers\Api\TempInvoiceController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Test endpoint
Route::post('/test', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'API is working',
        'data' => $request->all()
    ]);
})->name('api.test');

// Public API routes (no authentication or security required)
Route::post('/quote-request', [CommunicationController::class, 'sendQuoteRequest'])
    ->name('api.quote.request');

// Temporary invoice page (public - accessible with temporary link)
Route::get('/temp-invoice/{tempId}', [App\Http\Controllers\InvoiceController::class, 'showTempInvoice'])
    ->name('api.invoice.temp');

// Public PDF download for temporary invoices
Route::post('/generate-pdf-download', [CommunicationController::class, 'generatePdfDownload'])
    ->name('api.communication.generate-pdf-download');

// Communication API routes (no authentication required)
Route::post('/send-whatsapp-message', [CommunicationController::class, 'sendWhatsAppMessage'])
    ->name('api.communication.send-whatsapp-message');

// Invoice template API routes
Route::post('/send-order-email-with-invoice', [CommunicationController::class, 'sendOrderEmailWithInvoice'])
    ->name('api.communication.send-order-email-with-invoice');

Route::post('/send-whatsapp-message-with-invoice', [CommunicationController::class, 'sendWhatsAppMessageWithInvoice'])
    ->name('api.communication.send-whatsapp-message-with-invoice');

Route::post('/send-offer-email', [CommunicationController::class, 'sendOfferEmail'])
    ->name('api.communication.send-offer-email');

// Test routes (for development)
Route::get('/test-pdf', [CommunicationController::class, 'testPdfGeneration'])
    ->name('api.test.pdf');

Route::get('/test-email-pdf', [CommunicationController::class, 'testEmailWithPdf'])
    ->name('api.test.email-pdf');

// Transaction API routes (no authentication required)
Route::post('/transactions', [TransactionController::class, 'store'])
    ->name('api.transactions.store');

Route::get('/transactions', [TransactionController::class, 'index'])
    ->name('api.transactions.index');

Route::post('/batch', [BatchController::class, 'handle'])
    ->name('api.batch.handle');

Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])
    ->name('api.transactions.show');

Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])
    ->name('api.transactions.update');

Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])
    ->name('api.transactions.destroy');

Route::get('/transactions-statistics', [TransactionController::class, 'statistics'])
    ->name('api.transactions.statistics');

Route::get('/transactions-export', [TransactionController::class, 'export'])
    ->name('api.transactions.export');

// Offer management routes
Route::get('/offers/pending', [TransactionController::class, 'pendingOffers'])
    ->name('api.offers.pending');

Route::put('/offers/{transaction}/accept-paid', [TransactionController::class, 'acceptOfferAsPaid'])
    ->name('api.offers.accept-paid');

Route::put('/offers/{transaction}/accept-debt', [TransactionController::class, 'acceptOfferAsDebt'])
    ->name('api.offers.accept-debt');

Route::put('/offers/{transaction}/reject', [TransactionController::class, 'rejectOffer'])
    ->name('api.offers.reject');

Route::delete('/offers/{transaction}/delete-rejected', [TransactionController::class, 'deleteRejectedOffer'])
    ->name('api.offers.delete-rejected');

// Business settings API routes
Route::get('/business-settings', [AdminController::class, 'getBusinessSettings'])
    ->name('api.business-settings.get');

Route::post('/business-settings', [AdminController::class, 'updateBusinessSettings'])
    ->name('api.business-settings.update');

// Backup API routes
Route::post('/backup/create', [AdminController::class, 'createBackup'])
    ->name('api.backup.create');

Route::get('/backup/download', [AdminController::class, 'downloadBackup'])
    ->name('api.backup.download');

// Temporary Invoice Link API routes
Route::post('/create-temp-invoice-link', [TempInvoiceController::class, 'createTempLink'])
    ->name('api.temp-invoice.create');

Route::get('/temp-invoice/{tempId}', [TempInvoiceController::class, 'getTempInvoiceData'])
    ->name('api.temp-invoice.get');

Route::post('/temp-invoice/{tempId}/mark-used', [TempInvoiceController::class, 'markAsUsed'])
    ->name('api.temp-invoice.mark-used');

Route::post('/temp-invoice/cleanup-expired', [TempInvoiceController::class, 'cleanupExpired'])
    ->name('api.temp-invoice.cleanup');

// User API routes (no authentication required)
Route::get('/user', function (Request $request) {
    return $request->user();
})->name('api.user');
