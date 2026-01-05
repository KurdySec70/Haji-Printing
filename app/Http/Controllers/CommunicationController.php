<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmationWithInvoiceMail;
use App\Mail\OfferConfirmationMail;
use App\Mail\QuoteRequestMail;
use App\Services\SimpleWhatsAppService;

class CommunicationController extends Controller
{
    /**
     * Generate WhatsApp URL for order confirmation
     */
    public function sendWhatsAppMessage(Request $request)
    {
        try {
            // Log request data for debugging
            Log::info('WhatsApp message request data:', $request->all());

            $request->validate([
                'customer_phone' => 'required|string',
                'customer_name' => 'required|string',
                'customer_email' => 'nullable|email',
                'order_items' => 'nullable|array',
                'order_items.*.name' => 'required_with:order_items|string',
                'order_items.*.quantity' => 'required_with:order_items|integer|min:1',
                'order_items.*.unit_price' => 'required_with:order_items|numeric|min:0',
                'order_items.*.total' => 'required_with:order_items|numeric|min:0',
                'order_items.*.dimensions' => 'nullable|string',
                'order_items.*.weight' => 'nullable|string',
                'offer_items' => 'nullable|array',
                'offer_items.*.name' => 'required_with:offer_items|string',
                'offer_items.*.quantity' => 'required_with:offer_items|integer|min:1',
                'offer_items.*.unit_price' => 'required_with:offer_items|numeric|min:0',
                'offer_items.*.total' => 'required_with:offer_items|numeric|min:0',
                'offer_items.*.dimensions' => 'nullable|string',
                'offer_items.*.weight' => 'nullable|string',
                'grand_total' => 'required|numeric|min:0',
                'type' => 'nullable|string|in:order,offer',
            ]);

            // Determine if this is an order or offer based on available data
            $isOffer = $request->has('offer_items') || $request->get('type') === 'offer';
            $items = $request->order_items ?? []; // Always use order_items as that's what frontend sends

            // Ensure items is always an array
            if (!is_array($items)) {
                $items = [];
            }


            // Prepare order/offer data
            $orderData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email ?? '',
                'customer_phone' => $request->customer_phone,
                'order_items' => $items, // Use the appropriate items array
                'grand_total' => $request->grand_total,
                'subtotal' => $request->get('subtotal', $request->grand_total),
                'discount_amount' => $request->get('discount_amount', 0),
                'order_date' => $request->get('order_date', now()->format('Y-m-d H:i:s')),
                'order_id' => $request->get('order_id', $request->get('offer_id')),
                'type' => $isOffer ? 'offer' : 'order',
                'offer_id' => $request->get('offer_id'),
                'notes' => $request->get('notes'),
            ];

            // Use simple WhatsApp service
            $whatsappService = new SimpleWhatsAppService();
            
            if ($isOffer) {
                $result = $whatsappService->generateOfferConfirmationUrl($orderData);
            } else {
                $result = $whatsappService->generateOrderConfirmationUrl($orderData);
            }
            
            // Format result to match expected response
            $result = [
                'success' => true,
                'whatsapp_url' => $result
            ];

            if ($result['success']) {
                Log::info('WhatsApp URL generated successfully', [
                    'to' => $orderData['customer_phone'],
                    'customer_name' => $orderData['customer_name']
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'WhatsApp message prepared successfully',
                    'whatsapp_url' => $result['whatsapp_url']
                ]);
            } else {
                Log::error('Failed to generate WhatsApp URL', [
                    'error' => $result['error']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Failed to prepare WhatsApp message: ' . $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Failed to prepare WhatsApp message: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to prepare WhatsApp message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send order confirmation email with invoice template
     */
    public function sendOrderEmailWithInvoice(Request $request)
    {
        try {
            $request->validate([
                'customer_email' => 'required|email',
                'customer_name' => 'required|string',
                'customer_phone' => 'nullable|string',
                'order_id' => 'required|string',
                'order_items' => 'required|array',
                'order_items.*.name' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.unit_price' => 'required|numeric|min:0',
                'order_items.*.total' => 'required|numeric|min:0',
                'order_items.*.type' => 'nullable|string',
                'order_items.*.dimensions' => 'nullable|string',
                'order_items.*.weight' => 'nullable|string',
                'grand_total' => 'required|numeric|min:0',
                'subtotal' => 'required|numeric|min:0',
                'discount_amount' => 'nullable|numeric|min:0',
                'payment_status' => 'required|string|in:paid,debt',
                'invoice_html' => 'required|string',
            ]);

            $orderData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'order_id' => $request->order_id,
                'order_items' => $request->order_items,
                'grand_total' => $request->grand_total,
                'subtotal' => $request->subtotal,
                'discount_amount' => $request->discount_amount ?? 0,
                'payment_status' => $request->payment_status,
                'invoice_html' => $request->invoice_html,
                'order_date' => now()->format('Y-m-d H:i:s'),
            ];

            // Send email with invoice template using Laravel Mail (queued for async processing)
            try {
                // #region agent log
                Log::info('Email queued - before queue call', [
                    'customer_email' => $request->customer_email,
                    'order_id' => $request->order_id,
                    'queue_connection' => config('queue.default'),
                    'timestamp' => microtime(true)
                ]);
                // #endregion
                
                $startTime = microtime(true);
                Mail::to($request->customer_email)
                    ->queue(new OrderConfirmationWithInvoiceMail($orderData));
                $queueTime = microtime(true) - $startTime;
                
                // #region agent log
                Log::info('Email queued - after queue call', [
                    'customer_email' => $request->customer_email,
                    'order_id' => $request->order_id,
                    'queue_time_ms' => round($queueTime * 1000, 2),
                    'timestamp' => microtime(true)
                ]);
                // #endregion

                // Log the email attempt for debugging
                Log::info('Email with invoice queued successfully', [
                    'to' => $request->customer_email,
                    'customer_name' => $request->customer_name,
                    'order_id' => $request->order_id,
                    'order_items_count' => count($request->order_items),
                    'queue_time_ms' => round($queueTime * 1000, 2)
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Order confirmation email with invoice sent successfully'
                ]);

            } catch (\Exception $mailException) {
                Log::error('Mail sending failed specifically', [
                    'error' => $mailException->getMessage(),
                    'error_line' => $mailException->getLine(),
                    'error_file' => $mailException->getFile(),
                    'to' => $request->customer_email,
                    'order_id' => $request->order_id,
                    'trace' => $mailException->getTraceAsString()
                ]);

                throw $mailException; // Re-throw to be caught by outer catch
            }

        } catch (\Exception $e) {
            Log::error('Failed to send order email with invoice', [
                'error' => $e->getMessage(),
                'error_line' => $e->getLine(),
                'error_file' => $e->getFile(),
                'customer_email' => $request->customer_email ?? 'N/A',
                'order_id' => $request->order_id ?? 'N/A',
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to queue email. Please check logs for details.'
            ], 500);
        }
    }

    /**
     * Generate WhatsApp URL for order confirmation with invoice template
     */
    public function sendWhatsAppMessageWithInvoice(Request $request)
    {
        try {
            $request->validate([
                'customer_phone' => 'required|string',
                'customer_name' => 'required|string',
                'customer_email' => 'nullable|email',
                'order_id' => 'required|string',
                'order_items' => 'required|array',
                'order_items.*.name' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.unit_price' => 'required|numeric|min:0',
                'order_items.*.total' => 'required|numeric|min:0',
                'order_items.*.type' => 'nullable|string',
                'order_items.*.dimensions' => 'nullable|string',
                'order_items.*.weight' => 'nullable|string',
                'grand_total' => 'required|numeric|min:0',
                'subtotal' => 'required|numeric|min:0',
                'discount_amount' => 'nullable|numeric|min:0',
                'payment_status' => 'required|string|in:paid,debt',
                'invoice_html' => 'required|string',
            ]);

            // Prepare order data with invoice
            $orderData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email ?? '',
                'customer_phone' => $request->customer_phone,
                'order_id' => $request->order_id,
                'order_items' => $request->order_items,
                'grand_total' => $request->grand_total,
                'subtotal' => $request->subtotal,
                'discount_amount' => $request->discount_amount ?? 0,
                'payment_status' => $request->payment_status,
                'invoice_html' => $request->invoice_html,
                'order_date' => now()->format('Y-m-d H:i:s'),
            ];

            // Use enhanced WhatsApp service with invoice support
            try {
                $whatsappService = new SimpleWhatsAppService();
                $result = $whatsappService->sendOrderConfirmationWithInvoice($orderData);

                if ($result['success']) {
                    Log::info('WhatsApp URL with invoice generated successfully', [
                        'to' => $orderData['customer_phone'],
                        'customer_name' => $orderData['customer_name'],
                        'order_id' => $orderData['order_id']
                    ]);

                    return response()->json([
                        'success' => true,
                        'message' => 'WhatsApp message with invoice prepared successfully',
                        'whatsapp_url' => $result['whatsapp_url']
                    ]);
                } else {
                    Log::error('WhatsApp service returned error', [
                        'error' => $result['error'] ?? 'Unknown error',
                        'customer_phone' => $orderData['customer_phone']
                    ]);

                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to prepare WhatsApp message with invoice: ' . ($result['error'] ?? 'Unknown error')
                    ], 500);
                }

            } catch (\Exception $whatsappException) {
                Log::error('WhatsApp service failed specifically: ' . $whatsappException->getMessage(), [
                    'to' => $orderData['customer_phone'],
                    'order_id' => $orderData['order_id'],
                    'trace' => $whatsappException->getTraceAsString()
                ]);

                throw $whatsappException; // Re-throw to be caught by outer catch
            }

        } catch (\Exception $e) {
            Log::error('Failed to prepare WhatsApp message with invoice: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to prepare WhatsApp message with invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send quote request email to business owner
     */
    public function sendQuoteRequest(Request $request)
    {
        try {
            // Check honeypot field (if filled, it's likely a bot)
            if (!empty($request->input('website'))) {
                Log::warning('Bot detected via honeypot field', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'honeypot_value' => $request->input('website')
                ]);
                
                return back()->with('error', 'Invalid request. Please try again.');
            }

            $request->validate([
                'name' => 'required|string|max:255|min:2|regex:/^[a-zA-Z\s\-\'\.]+$/',
                'email' => 'required|email|max:255|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
                'phone' => 'nullable|string|max:20|regex:/^[\+]?[0-9\s\-\(\)]+$/',
                'message' => 'required|string|min:10|max:2000|regex:/^[a-zA-Z0-9\s\.,!?\-\(\)\@\#\$\%\&\*\+\=\[\]\{\}\|\:\;\"\'\<\>\/\\\n\r\t]+$/',
                'website' => 'nullable|string|max:0', // Honeypot field should be empty
            ], [
                'name.regex' => 'Name can only contain letters, spaces, hyphens, apostrophes, and periods.',
                'email.regex' => 'Please enter a valid email address.',
                'phone.regex' => 'Please enter a valid phone number.',
                'message.regex' => 'Message contains invalid characters.',
                'website.max' => 'Invalid request detected.',
            ]);

            $quoteData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => $request->message,
                'submitted_at' => now()->format('M d, Y \a\t H:i'),
            ];

            // Get the business email from config (MAIL_FROM_ADDRESS)
            $businessEmail = config('mail.from.address');
            
            if (empty($businessEmail) || $businessEmail === 'your-email@gmail.com') {
                throw new \Exception('Business email not configured. Please set MAIL_FROM_ADDRESS in your .env file.');
            }

            // Send email to business owner
            Mail::to($businessEmail)
                ->send(new QuoteRequestMail($quoteData));

            // Log the quote request
            Log::info('Quote request submitted successfully', [
                'customer_name' => $request->name,
                'customer_email' => $request->email,
                'customer_phone' => $request->phone,
                'business_email' => $businessEmail,
                'message_length' => strlen($request->message)
            ]);

            return back()->with('success', 'Quote request submitted successfully! We will contact you within 24 hours.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to send quote request: ' . $e->getMessage(), [
                'customer_name' => $request->name ?? 'unknown',
                'customer_email' => $request->email ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Failed to submit quote request. Please try again later or contact us directly.');
        }
    }

    /**
     * Generate and store PDF for download, return download link
     */
    public function generatePdfDownload(Request $request)
    {
        try {
            // Log the request data for debugging
            \Log::info('generatePdfDownload - Request data:', $request->all());
            
            $validator = \Validator::make($request->all(), [
                'transaction_id' => 'nullable',
                'order_id' => 'required|string',
                'customer' => 'required|array',
                'customer.name' => 'required|string',
                'customer.email' => 'nullable|string',
                'customer.phone' => 'required|string',
                'items' => 'required|array|min:1',
                'items.*.name' => 'required|string',
                'items.*.quantity' => 'required|numeric|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
                'items.*.total' => 'required|numeric|min:0',
                'items.*.type' => 'required|string',
                'items.*.dimensions' => 'nullable|string',
                'items.*.weight' => 'nullable|string',
                'subtotal' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'grand_total' => 'required|numeric|min:0',
                'transaction_date' => 'required',
                'status' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                \Log::error('generatePdfDownload - Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                    'request_data' => $request->all()
                ], 422);
            }

            // Set execution time limit for PDF generation
            set_time_limit(180);

            // Generate invoice HTML from the transaction data
            $invoiceHtml = $this->generateInvoiceHtmlFromData($request->all());

            // Create PDF with optimized settings
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($invoiceHtml)
                ->setPaper('A4', 'portrait')
                ->setOptions([
                    'defaultFont' => 'Arial',
                    'isPhpEnabled' => false,
                    'isRemoteEnabled' => true,
                    'isJavascriptEnabled' => false,
                    'isFontSubsettingEnabled' => true,
                    'debugKeepTemp' => false,
                    'dpi' => 96,
                    'enable_php' => false,
                    'enable_javascript' => false,
                    'enable_remote' => true,
                    'chroot' => public_path(),
                ]);

            // Generate filename
            $filename = 'Invoice-' . $request->order_id . '.pdf';

            // Log the PDF generation
            Log::info('PDF generated for download', [
                'customer_name' => $request->customer['name'],
                'order_id' => $request->order_id,
                'filename' => $filename
            ]);

            // Return PDF directly as download
            return $pdf->download($filename);

        } catch (\Exception $e) {
            Log::error('Failed to generate PDF for download: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test PDF generation for debugging
     */
    public function testPdfGeneration(Request $request)
    {
        try {
            // Simple test HTML
            $testHtml = '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Test Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>TEST INVOICE</h1>
                </div>
                <div class="content">
                    <p><strong>Test Order ID:</strong> TEST-123</p>
                    <p><strong>Customer:</strong> Test Customer</p>
                    <p><strong>Date:</strong> ' . date('Y-m-d H:i:s') . '</p>
                    <p>This is a test PDF generation for debugging email attachments.</p>
                </div>
            </body>
            </html>';

            // Create PDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($testHtml)
                ->setPaper('A4', 'portrait')
                ->setOptions([
                    'defaultFont' => 'DejaVu Sans',
                    'isRemoteEnabled' => false,
                    'isJavascriptEnabled' => false,
                    'isPhpEnabled' => false,
                ]);

            // Return PDF as download to test
            return $pdf->download('test-invoice-' . time() . '.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'PDF test failed: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Test email with PDF attachment
     */
    public function testEmailWithPdf(Request $request)
    {
        try {
            // Create test order data
            $testOrderData = [
                'customer_name' => 'Test Customer',
                'customer_email' => 'test@example.com',
                'customer_phone' => '+9647512345678',
                'order_id' => 'TEST-' . time(),
                'order_items' => [
                    [
                        'name' => 'Test Product',
                        'quantity' => 2,
                        'unit_price' => 50000,
                        'total' => 100000,
                        'type' => 'Test Type',
                        'dimensions' => '10x20cm'
                    ]
                ],
                'grand_total' => 100000,
                'subtotal' => 100000,
                'discount_amount' => 0,
                'payment_status' => 'paid',
                'invoice_html' => $this->generateTestInvoiceHtml(),
                'order_date' => now()->format('Y-m-d H:i:s'),
            ];

            // Override email for testing
            if ($request->has('test_email')) {
                $testOrderData['customer_email'] = $request->test_email;
            }

            // Send test email (queued for async processing)
            Mail::to($testOrderData['customer_email'])
                ->queue(new OrderConfirmationWithInvoiceMail($testOrderData));

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully to ' . $testOrderData['customer_email'],
                'order_data' => $testOrderData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test email failed: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Generate test invoice HTML
     */
    private function generateTestInvoiceHtml()
    {
        return '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Invoice</title>
            <style>
                @page { size: A4; margin: 0; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; background: white; color: #000; font-size: 12px; line-height: 1.4; }
                .invoice-container { width: 210mm; min-height: 297mm; background: white; margin: 0; padding: 0; }
                .header { background: ' . $settings->header_color . '; padding: 0; margin: 0; height: 25mm; display: flex; align-items: center; justify-content: center; }
                .main-content { padding: 15mm 20mm 0 20mm; }
                .top-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                .company-info { flex: 1; }
                .invoice-title { font-size: 24px; font-weight: bold; color: #000; margin-bottom: 5px; text-transform: uppercase; }
                .company-name { font-size: 16px; font-weight: bold; color: #000; margin-bottom: 8px; }
                .address-info { font-size: 11px; line-height: 1.4; color: #000; }
                .logo-section { flex: 0 0 120px; text-align: center; }
                .logo-container { margin-bottom: 10px; width: 80px; height: 80px; background: #f0f0f0; border: 2px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666; }
                .invoice-details { font-size: 11px; text-align: center; }
                .customer-section { margin-bottom: 15px; }
                .customer-label { font-size: 11px; font-weight: bold; color: #000; margin-bottom: 3px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
                .items-table th { background: ' . $settings->table_header_color . '; color: white; border: 1px solid #000; padding: 8px 6px; text-align: center; font-weight: bold; font-size: 10px; }
                .items-table td { border: 1px solid #000; padding: 6px; vertical-align: top; font-size: 10px; line-height: 1.3; }
                .totals-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; margin-bottom: 15px; }
                .totals-container { width: 150px; }
                .totals-row { display: flex; justify-content: space-between; padding: 4px 8px; border: 1px solid #000; border-bottom: none; font-size: 10px; background: white; }
                .totals-row:last-child { border-bottom: 1px solid #000; background: ' . $settings->table_header_color . '; color: white; font-weight: bold; font-size: 11px; }
                .footer { background: ' . $settings->footer_color . '; padding: 0; margin: 0; height: 15mm; margin-top: auto; position: absolute; bottom: 0; width: 100%; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header"></div>
                <div class="main-content">
                    <div class="top-section">
                        <div class="company-info">
                            <div class="invoice-title">INVOICE</div>
                            <div class="company-name">Haji Printing</div>
                            <div class="address-info">
                                <div>Erbil-Ehsa Street, Near Sarhad Stationery</div>
                                <div>0751 446 39 59</div>
                                <div>0751 447 39 59</div>
                                <div>Email: info@hajiprinting.com</div>
                                <div>www.hajiprinting.com</div>
                            </div>
                        </div>
                        <div class="logo-section">
                            <div class="logo-container">LOGO</div>
                            <div class="invoice-details">
                                <div>' . date('F j, Y') . '</div>
                                <div>Invoice TEST-' . time() . '</div>
                            </div>
                        </div>
                    </div>
                    <div class="customer-section">
                        <div class="customer-label">Customer Name: Test Customer</div>
                        <div style="font-size: 10px; margin-top: 2px;">Email: test@example.com | Phone: +9647512345678</div>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 50%;">Description</th>
                                <th style="width: 15%;">Quantity</th>
                                <th style="width: 15%;">Price</th>
                                <th style="width: 20%;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Test Product</strong><br><small>Type: Test Type | Dimensions: 10x20cm</small></td>
                                <td style="text-align: center;">2</td>
                                <td style="text-align: right;">50,000 IQD</td>
                                <td style="text-align: right;">100,000 IQD</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="totals-section">
                        <div style="flex: 1; margin-right: 20px;">
                            <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px;">Remarks / Payment Instructions:</div>
                            <div style="font-size: 10px; line-height: 1.4; min-height: 40px;">Test order for PDF attachment debugging.</div>
                        </div>
                        <div class="totals-container">
                            <div class="totals-row">
                                <div>Debt :</div>
                                <div>0</div>
                            </div>
                            <div class="totals-row">
                                <div>Discount :</div>
                                <div>0</div>
                            </div>
                            <div class="totals-row">
                                <div>Subtotal :</div>
                                <div>100,000 IQD</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer"></div>
            </div>
        </body>
        </html>';
    }



    /**
     * Generate invoice HTML from transaction data
     */
    private function generateInvoiceHtmlFromData($data)
    {
        // Load invoice settings from database
        $settings = \App\Models\InvoiceSettings::getSettings();
        
        $customer = $data['customer'];
        $items = $data['items'];
        $orderId = $data['order_id'];
        $subtotal = $data['subtotal'];
        $discountAmount = $data['discount_amount'];
        $grandTotal = $data['grand_total'];
        $transactionDate = $data['transaction_date'];
        $status = $data['status'];
        $notes = $data['notes'] ?? '';

        // Format currency
        $formatCurrency = function($amount) {
            return number_format($amount, 0) . ' IQD';
        };

        // Format date
        $formatDate = function($date) {
            return date('Y-m-d H:i:s', strtotime($date));
        };

        // Generate items HTML
        $itemsHtml = '';
        foreach ($items as $item) {
            $itemDetails = $item['type'];
            if (!empty($item['dimensions'])) {
                $itemDetails .= ' | Size: ' . $item['dimensions'];
            }
            if (!empty($item['weight'])) {
                $itemDetails .= ' | Weight: ' . $item['weight'];
            }
            
            $itemsHtml .= '
                        <tr>
                            <td>
                                <strong>' . htmlspecialchars($item['name']) . '</strong><br>
                                <small>' . htmlspecialchars($itemDetails) . '</small>
                            </td>
                            <td class="text-center">' . $item['quantity'] . '</td>
                            <td class="text-center">' . $formatCurrency($item['unit_price']) . '</td>
                            <td class="text-right">' . $formatCurrency($item['total']) . '</td>
                        </tr>';
        }

        return '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice ' . $orderId . '</title>
            <style>
                @page {
                    size: A4;
                    margin: 0;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: ' . $settings->primary_font . ', sans-serif;
                    background: white;
                    color: #000;
                    font-size: ' . $settings->font_size_base . 'px;
                    font-weight: ' . ($settings->font_weight ?? '400') . ';
                    line-height: 1.2;
                    position: relative;
                }

                .invoice-container {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    margin: 0;
                    padding: 0;
                }

                .header {
                    background: ' . $settings->header_color . ';
                    height: ' . $settings->header_height . 'px;
                    width: 100%;
                    position: relative;
                }

                .footer {
                    background: ' . $settings->footer_color . ';
                    height: ' . $settings->footer_height . 'px;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                }

                .content {
                    padding: 20px 40px;
                    min-height: calc(297mm - 100px);
                }

                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                    position: relative;
                }

                .company-info {
                    flex: 1;
                    max-width: 70%;
                }

                .logo-section {
                    position: absolute;
                    top: 0;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .company-title {
                    font-size: ' . ($settings->font_size_base * 2) . 'px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .company-name {
                    font-size: ' . ($settings->font_size_base * 1.33) . 'px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .company-details {
                    font-size: ' . ($settings->font_size_base * 0.92) . 'px;
                    line-height: 1.4;
                    color: #333;
                }

                .logo {
                    width: ' . $settings->logo_width . 'px;
                    height: ' . $settings->logo_height . 'px;
                    background: transparent;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15px;
                }

                .logo img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    background: transparent;
                    border: none;
                }

                .invoice-meta {
                    text-align: left;
                    font-size: ' . ($settings->font_size_base * 0.83) . 'px;
                    line-height: 1.4;
                    max-width: 140px;
                    margin-top: 15px;
                }

                .invoice-meta div {
                    margin-bottom: 3px;
                    word-wrap: break-word;
                }

                .invoice-meta div:first-child {
                    font-size: ' . ($settings->font_size_base * 0.75) . 'px;
                    line-height: 1.2;
                }

                .customer-section {
                    margin-bottom: 25px;
                }

                .customer-label {
                    font-size: ' . $settings->font_size_base . 'px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .customer-info {
                    font-size: ' . ($settings->font_size_base * 0.92) . 'px;
                }

                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                .items-table th {
                    background: ' . $settings->table_header_color . ';
                    color: white;
                    padding: 8px 6px;
                    text-align: left;
                    font-size: ' . ($settings->font_size_base * 0.92) . 'px;
                    font-weight: bold;
                }

                .items-table td {
                    padding: 6px;
                    border-bottom: 1px solid #e0e0e0;
                    font-size: ' . ($settings->font_size_base * 0.92) . 'px;
                    vertical-align: top;
                }

                .items-table tbody tr:nth-child(even) {
                    background-color: #f8f9ff;
                }

                .text-center {
                    text-align: center;
                }

                .text-right {
                    text-align: right;
                }

                .totals-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-top: 20px;
                }

                .remarks-left {
                    flex: 1;
                    margin-right: 40px;
                }

                .totals-right {
                    flex: 0 0 auto;
                }

                .totals-table {
                    border: 1px solid #ddd;
                    min-width: 200px;
                    margin-left: auto;
                }

                .totals-table tr td {
                    padding: 5px 8px;
                    font-size: ' . ($settings->font_size_base * 0.92) . 'px;
                    border-bottom: 1px solid #eee;
                }

                .totals-table tr:last-child td {
                    border-bottom: none;
                    background: ' . $settings->table_header_color . ';
                    color: white;
                    font-weight: bold;
                }

                .remarks-section {
                    margin-top: 20px;
                }

                .remarks-title {
                    font-weight: bold;
                    font-size: ' . ($settings->font_size_base * 0.92) . 'px;
                    margin-bottom: 5px;
                }

                .remarks-content {
                    font-size: ' . ($settings->font_size_base * 0.83) . 'px;
                    color: #666;
                }

                /* Print styles */
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header"></div>

                <div class="content">
                    <div class="invoice-header">
                        <div class="company-info">
                            <div class="company-title">' . htmlspecialchars($settings->company_title) . '</div>
                            <div class="company-name">' . htmlspecialchars($settings->company_name) . '</div>
                            <div class="company-details">
                                ' . ($settings->company_address ? htmlspecialchars($settings->company_address) . '<br>' : '') . '
                                ' . ($settings->company_phone_1 ? htmlspecialchars($settings->company_phone_1) . '<br>' : '') . '
                                ' . ($settings->company_phone_2 ? htmlspecialchars($settings->company_phone_2) . '<br>' : '') . '
                                ' . ($settings->company_email ? 'Email: ' . htmlspecialchars($settings->company_email) . '<br>' : '') . '
                                ' . ($settings->company_website ? htmlspecialchars($settings->company_website) : '') . '
                            </div>
                            <div class="invoice-meta">
                                ' . ($settings->show_date_time ? '<div>' . $formatDate($transactionDate) . '</div>' : '') . '
                                <div><strong>Invoice ID#:</strong></div>
                                <div>' . htmlspecialchars($orderId) . '</div>
                            </div>
                        </div>

                        <div class="logo-section">
                            <div class="logo">
                                ' . ($settings->show_logo && $settings->logo_url ? '<img src="' . $settings->logo_url . '" alt="Company Logo" style="width: ' . $settings->logo_width . 'px; height: ' . $settings->logo_height . 'px;">' : '') . '
                            </div>
                        </div>
                    </div>

                    <div class="customer-section">
                        <div class="customer-label">Customer Name: ' . $customer['name'] . '</div>
                        <div class="customer-info">
                            ' . ($customer['email'] ? 'Email: ' . $customer['email'] : '') . ($customer['email'] && $customer['phone'] ? ' | ' : '') . ($customer['phone'] ? 'Phone: ' . $customer['phone'] : '') . '
                        </div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="text-center" style="width: 80px;">Quantity</th>
                                <th class="text-center" style="width: 80px;">Price</th>
                                <th class="text-right" style="width: 80px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ' . $itemsHtml . '
                        </tbody>
                    </table>

                    <div class="totals-section">
                        <div class="remarks-left">
                            <div class="remarks-title">Remarks / Payment Instructions:</div>
                            <div class="remarks-content">
                                ' . (!empty($notes) ? htmlspecialchars($notes) : 'Order completed via POS - ' . count($items) . ' items') . '<br>
                                Processed by: ' . $customer['name'] . '
                            </div>
                        </div>

                        <div class="totals-right">
                            <table class="totals-table">
                                <tr>
                                    <td>Debt :</td>
                                    <td class="text-right">' . ($status === 'debt' ? $formatCurrency($grandTotal) : '0') . '</td>
                                </tr>
                                <tr>
                                    <td>Discount :</td>
                                    <td class="text-right">' . ($discountAmount > 0 ? $formatCurrency($discountAmount) : '0') . '</td>
                                </tr>
                                <tr>
                                    <td><strong>Subtotal :</strong></td>
                                    <td class="text-right"><strong>' . $formatCurrency($grandTotal) . '</strong></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="footer"></div>
            </div>
        </body>
        </html>';
    }

    /**
     * Send offer confirmation email with PDF attachment
     */
    public function sendOfferEmail(Request $request)
    {
        try {
            $request->validate([
                'customer_email' => 'required|email',
                'customer_name' => 'required|string',
                'customer_phone' => 'nullable|string',
                'order_id' => 'required|string',
                'order_items' => 'required|array',
                'order_items.*.name' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.unit_price' => 'required|numeric|min:0',
                'order_items.*.total' => 'required|numeric|min:0',
                'grand_total' => 'required|numeric|min:0',
                'subtotal' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'payment_status' => 'required|string|in:offer',
                'invoice_html' => 'required|string',
            ]);

            $orderData = [
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'order_id' => $request->order_id,
                'order_items' => $request->order_items,
                'grand_total' => $request->grand_total,
                'subtotal' => $request->subtotal,
                'discount_amount' => $request->discount_amount,
                'payment_status' => $request->payment_status,
                'invoice_html' => $request->invoice_html,
                'order_date' => now()->format('Y-m-d H:i:s'),
            ];

            // Send email using Laravel Mail (queued for async processing)
            // #region agent log
            Log::info('Offer email queued - before queue call', [
                'customer_email' => $request->customer_email,
                'order_id' => $request->order_id,
                'queue_connection' => config('queue.default'),
                'timestamp' => microtime(true)
            ]);
            // #endregion
            
            $startTime = microtime(true);
            Mail::to($request->customer_email)
                ->queue(new OfferConfirmationMail($orderData));
            $queueTime = microtime(true) - $startTime;
            
            // #region agent log
            Log::info('Offer email queued - after queue call', [
                'customer_email' => $request->customer_email,
                'order_id' => $request->order_id,
                'queue_time_ms' => round($queueTime * 1000, 2),
                'timestamp' => microtime(true)
            ]);
            // #endregion

            // Log the email attempt for debugging
            Log::info('Offer email queued successfully', [
                'to' => $request->customer_email,
                'order_id' => $request->order_id,
                'customer_name' => $request->customer_name,
                'grand_total' => $request->grand_total,
                'has_pdf_attachment' => !empty($request->invoice_html),
                'queue_time_ms' => round($queueTime * 1000, 2)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Offer email sent successfully',
                'recipient' => $request->customer_email,
                'order_id' => $request->order_id
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Offer email validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Failed to send offer email', [
                'error' => $e->getMessage(),
                'error_line' => $e->getLine(),
                'error_file' => $e->getFile(),
                'customer_email' => $request->customer_email ?? 'N/A',
                'order_id' => $request->order_id ?? 'N/A',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to queue email. Please check logs for details.'
            ], 500);
        }
    }
}
