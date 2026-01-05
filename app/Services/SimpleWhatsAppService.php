<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Models\TemporaryInvoiceLink;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SimpleWhatsAppService
{
    /**
     * Generate WhatsApp URL for order confirmation
     */
    public function generateOrderConfirmationUrl($orderData)
    {
        $message = $this->generateOrderMessage($orderData);
        return $this->generateWhatsAppUrl($orderData['customer_phone'], $message);
    }

    /**
     * Generate WhatsApp URL for offer/quote
     */
    public function generateOfferConfirmationUrl($offerData)
    {
        $message = $this->generateOfferMessage($offerData);
        return $this->generateWhatsAppUrl($offerData['customer_phone'], $message);
    }

    /**
     * Generate formatted order message in Kurdish (optimized for shorter text)
     */
    private function generateOrderMessage($data)
    {

        // Generate fast temp invoice link
        $invoiceUrl = $this->generateTempInvoiceLink($data);
        
        $message = "سڵاو {$data['customer_name']}\n\n";
        $message .= "✅ *داواکاری - چاپخانەی حاجی*\n\n";
        $message .= "📋 *کورتە:*\n";

        foreach ($data['order_items'] as $item) {
            $message .= "• {$item['name']} ({$item['quantity']}x) - " . number_format($item['total'], 0) . " IQD\n";
            
            if (!empty($item['dimensions'])) {
                $message .= "  📏 {$item['dimensions']}\n";
            }
        }

        $message .= "\n💵 *کۆی:* " . number_format($data['grand_total'], 0) . " IQD\n";
        $message .= "📅 {$data['order_date']}\n\n";

        if ($invoiceUrl) {
            $message .= "📎 *Invoice:*\n";
            $message .= $invoiceUrl . "\n";
            $message .= "⏰ *Link expires in 3 hours*\n\n";
        } else {
            // Add a fallback message to indicate invoice will be sent separately
            $message .= "📧 *Invoice will be sent to your email*\n\n";
        }

        $message .= "سوپاس!";

        return $message;
    }

    /**
     * Generate formatted offer message in Kurdish (same format as order but for offers)
     */
    private function generateOfferMessage($data)
    {
        // Generate fast temp offer link
        $offerUrl = $this->generateTempOfferLink($data);

        $message = "سڵاو {$data['customer_name']}\n\n";
        $message .= "💰 *نرخنامە - چاپخانەی حاجی*\n\n";
        $message .= "📋 *کورتە:*\n";

        foreach ($data['order_items'] as $item) {
            $message .= "• {$item['name']} ({$item['quantity']}x) - " . number_format($item['total'], 0) . " IQD\n";

            if (!empty($item['dimensions'])) {
                $message .= "  📏 {$item['dimensions']}\n";
            }
        }

        $message .= "\n💵 *کۆی:* " . number_format($data['grand_total'], 0) . " IQD\n";
        $message .= "📅 " . (isset($data['order_date']) ? $data['order_date'] : now()->format('Y-m-d H:i')) . "\n\n";

        if ($offerUrl) {
            $message .= "📎 *Offer:*\n";
            $message .= $offerUrl . "\n";
            $message .= "⏰ *Link expires in 3 hours*\n\n";
        } else {
            // Add a fallback message to indicate offer will be sent separately
            $message .= "📧 *Offer will be sent to your email*\n\n";
        }

        $message .= "سوپاس!";

        return $message;
    }

    /**
     * Generate WhatsApp URL with proper Iraqi phone number formatting
     */
    private function generateWhatsAppUrl($phone, $message)
    {
        // Clean phone number (remove any non-digit characters except +)
        $cleanPhone = preg_replace('/[^\d+]/', '', $phone);

        // Format Iraqi phone numbers properly
        $formattedPhone = $this->formatIraqiPhoneNumber($cleanPhone);

        // Create WhatsApp URL using api.whatsapp.com format with optimized encoding
        $whatsappUrl = "https://api.whatsapp.com/send?phone={$formattedPhone}&text=" . rawurlencode($message);

        // Validate the generated URL
        if (!filter_var($whatsappUrl, FILTER_VALIDATE_URL)) {
            Log::error('Invalid WhatsApp URL generated', [
                'original_phone' => $phone,
                'formatted_phone' => $formattedPhone,
                'url' => $whatsappUrl
            ]);
            throw new \InvalidArgumentException('Failed to generate valid WhatsApp URL');
        }


        return $whatsappUrl;
    }

    /**
     * Format Iraqi phone number for WhatsApp
     */
    private function formatIraqiPhoneNumber($phone)
    {
        // Remove any existing country code or plus sign
        $phone = preg_replace('/^\+?964/', '', $phone);
        $phone = preg_replace('/^\+/', '', $phone);

        // Handle different Iraqi number formats - return WITH country code 964
        if (preg_match('/^07\d{8}$/', $phone)) {
            // Iraqi mobile numbers starting with 07 (10 digits total)
            // Convert 07XXXXXXXX to 9647XXXXXXXX (add country code, remove leading 0)
            return '964' . substr($phone, 1);
        } elseif (preg_match('/^7\d{8}$/', $phone)) {
            // Iraqi mobile numbers starting with 7 (9 digits total)
            // Add country code: 7XXXXXXXX -> 9647XXXXXXXX
            return '964' . $phone;
        } elseif (preg_match('/^0\d{9,10}$/', $phone)) {
            // Other Iraqi numbers starting with 0
            // Remove leading 0 and add country code
            return '964' . substr($phone, 1);
        } elseif (preg_match('/^\d{9,10}$/', $phone)) {
            // Numbers without leading 0 or country code
            // Add country code
            return '964' . $phone;
        } else {
            // Unknown format, assume it needs country code
            Log::warning('Unknown phone number format for WhatsApp, adding 964 prefix', [
                'original_phone' => $phone,
                'formatted_phone' => '964' . $phone
            ]);
            return '964' . $phone;
        }
    }


    /**
     * Send order confirmation (returns WhatsApp URL)
     */
    public function sendOrderConfirmation($orderData)
    {
        try {
            $whatsappUrl = $this->generateOrderConfirmationUrl($orderData);

            return [
                'success' => true,
                'whatsapp_url' => $whatsappUrl,
                'message' => 'WhatsApp URL generated successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to generate WhatsApp URL: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Send order confirmation with invoice template (returns WhatsApp URL)
     */
    public function sendOrderConfirmationWithInvoice($orderData)
    {
        try {
            // Validate required data
            if (empty($orderData['customer_phone'])) {
                throw new \InvalidArgumentException('Customer phone number is required');
            }

            if (empty($orderData['customer_name'])) {
                throw new \InvalidArgumentException('Customer name is required');
            }

            if (empty($orderData['order_items']) || !is_array($orderData['order_items'])) {
                throw new \InvalidArgumentException('Order items are required and must be an array');
            }

            $message = $this->generateOrderMessage($orderData);
            $whatsappUrl = $this->generateWhatsAppUrl($orderData['customer_phone'], $message);

            // Validate the generated URL
            if (empty($whatsappUrl) || !filter_var($whatsappUrl, FILTER_VALIDATE_URL)) {
                throw new \RuntimeException('Failed to generate valid WhatsApp URL');
            }

            return [
                'success' => true,
                'whatsapp_url' => $whatsappUrl,
                'message' => 'WhatsApp URL with invoice generated successfully'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to generate WhatsApp URL with invoice: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }


    /**
     * Generate fast temp offer link using existing temp invoice system directly
     */
    private function generateTempOfferLink($data)
    {
        try {
            // Prepare transaction data for temp offer with all required fields
            $orderItems = $data['order_items'] ?? [];
            $processedItems = [];

            foreach ($orderItems as $item) {
                $processedItems[] = [
                    'name' => $item['name'] ?? 'Unknown Item',
                    'quantity' => $item['quantity'] ?? 1,
                    'unit_price' => $item['unit_price'] ?? ($item['total'] ?? 0) / ($item['quantity'] ?? 1),
                    'total' => $item['total'] ?? 0,
                    'type' => $item['type'] ?? 'pcs',
                    'dimensions' => $item['dimensions'] ?? '',
                    'weight' => $item['weight'] ?? ''
                ];
            }

            $transactionData = [
                'transaction_id' => $data['offer_id'] ?? 'whatsapp_offer_' . time(),
                'order_id' => $data['offer_id'] ?? 'whatsapp_offer_' . time(),
                'customer' => [
                    'name' => $data['customer_name'] ?? 'Unknown Customer',
                    'email' => $data['customer_email'] ?? '',
                    'phone' => $data['customer_phone'] ?? '0000000000' // Required field
                ],
                'items' => $processedItems,
                'subtotal' => $data['subtotal'] ?? $data['grand_total'] ?? 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'grand_total' => $data['grand_total'] ?? 0,
                'transaction_date' => $data['order_date'] ?? now()->toISOString(),
                'status' => 'offer', // Mark as offer status
                'notes' => $data['notes'] ?? 'WhatsApp Offer',
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString()
            ];

            // Generate unique temporary ID for offers
            $tempId = 'whatsapp_offer_' . time() . '_' . Str::random(12);

            // Create temporary offer link directly
            $tempLink = TemporaryInvoiceLink::create([
                'temp_id' => $tempId,
                'transaction_data' => $transactionData,
                'expires_at' => Carbon::now()->addHours(3),
            ]);

            // Generate the full URL
            $fullUrl = url("/offer-temp/{$tempId}");

            return $fullUrl;

        } catch (\Exception $e) {
            Log::error('Failed to generate temp offer link for WhatsApp: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate fast temp invoice link using existing temp invoice system directly
     */
    private function generateTempInvoiceLink($data)
    {
        try {
            // Prepare transaction data for temp invoice with all required fields
            $orderItems = $data['order_items'] ?? [];
            $processedItems = [];
            
            foreach ($orderItems as $item) {
                $processedItems[] = [
                    'name' => $item['name'] ?? 'Unknown Item',
                    'quantity' => $item['quantity'] ?? 1,
                    'unit_price' => $item['unit_price'] ?? ($item['total'] ?? 0) / ($item['quantity'] ?? 1),
                    'total' => $item['total'] ?? 0,
                    'type' => $item['type'] ?? 'pcs',
                    'dimensions' => $item['dimensions'] ?? '',
                    'weight' => $item['weight'] ?? ''
                ];
            }

            $transactionData = [
                'transaction_id' => $data['order_id'] ?? 'whatsapp_' . time(),
                'order_id' => $data['order_id'] ?? 'whatsapp_' . time(),
                'customer' => [
                    'name' => $data['customer_name'] ?? 'Unknown Customer',
                    'email' => $data['customer_email'] ?? '',
                    'phone' => $data['customer_phone'] ?? '0000000000' // Required field
                ],
                'items' => $processedItems,
                'subtotal' => $data['subtotal'] ?? $data['grand_total'] ?? 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'grand_total' => $data['grand_total'] ?? 0,
                'transaction_date' => $data['order_date'] ?? now()->toISOString(),
                'status' => 'paid',
                'notes' => 'WhatsApp Invoice',
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString()
            ];

            // Generate unique temporary ID
            $tempId = 'whatsapp_' . time() . '_' . Str::random(12);

            // Create temporary invoice link directly
            $tempLink = TemporaryInvoiceLink::create([
                'temp_id' => $tempId,
                'transaction_data' => $transactionData,
                'expires_at' => Carbon::now()->addHours(3),
            ]);

            // Generate the full URL
            $fullUrl = url("/invoice-temp/{$tempId}");

            return $fullUrl;

        } catch (\Exception $e) {
            Log::error('Failed to generate temp invoice link for WhatsApp: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate PDF download link by calling the PDF generation API
     */
    private function generatePdfDownloadLink($data)
    {
        try {
            $curl = curl_init();

            $postData = json_encode([
                'customer_name' => $data['customer_name'],
                'order_id' => $data['order_id'],
                'invoice_html' => $data['invoice_html']
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => url('api/generate-pdf-download'),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $postData,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Accept: application/json'
                ],
                CURLOPT_TIMEOUT => 30
            ]);

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);

            if ($httpCode === 200 && $response) {
                $responseData = json_decode($response, true);
                if ($responseData && isset($responseData['success']) && $responseData['success']) {
                    return $responseData['download_url'];
                }
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Failed to generate PDF download link for WhatsApp: ' . $e->getMessage());
            return null;
        }
    }




}
