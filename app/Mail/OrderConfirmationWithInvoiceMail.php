<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderConfirmationWithInvoiceMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $orderData;

    /**
     * Create a new message instance.
     */
    public function __construct($orderData)
    {
        $this->orderData = $orderData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Confirmation with Invoice - Haji Printing',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Generate base64 logo for email
        $logoBase64 = '';
        $logoPath = public_path('images/hajiNoBackground.png');
        if (file_exists($logoPath)) {
            $logoData = base64_encode(file_get_contents($logoPath));
            $logoBase64 = 'data:image/png;base64,' . $logoData;
        }

        return new Content(
            view: 'emails.order-confirmation-with-invoice',
            with: [
                'orderData' => $this->orderData,
                'logoBase64' => $logoBase64,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        try {
            
            // Set execution time limit for PDF generation
            set_time_limit(180);

            // Log PDF generation start
            \Illuminate\Support\Facades\Log::info('Starting PDF generation for email attachment', [
                'order_id' => $this->orderData['order_id'] ?? 'unknown',
                'customer_name' => $this->orderData['customer_name'] ?? 'unknown'
            ]);

            // Validate that we have invoice HTML
            if (empty($this->orderData['invoice_html'])) {
                throw new \Exception('Invoice HTML is empty or missing');
            }

            // Use the exact same invoice template from the print functionality
            $invoiceHtml = $this->orderData['invoice_html'];

            // Log HTML length before cleaning
            \Illuminate\Support\Facades\Log::info('Invoice HTML received for PDF', [
                'html_length' => strlen($invoiceHtml),
                'contains_logo' => strpos($invoiceHtml, 'hajiNoBackground.png') !== false
            ]);

            // Clean the HTML for PDF generation (remove any problematic elements)
            $cleanHtml = $this->cleanHtmlForPdf($invoiceHtml);
            
            // Ensure UTF-8 encoding is preserved - add proper meta tag if missing
            if (strpos($cleanHtml, '<meta charset="UTF-8">') === false && strpos($cleanHtml, '<meta charset=utf-8') === false) {
                $cleanHtml = str_replace('<head>', '<head><meta charset="UTF-8">', $cleanHtml);
            }
            
            // Ensure HTML has proper UTF-8 declaration
            if (strpos($cleanHtml, '<?xml') === false) {
                $cleanHtml = '<?xml encoding="UTF-8">' . $cleanHtml;
            }

            // Log HTML length after cleaning
            \Illuminate\Support\Facades\Log::info('Invoice HTML after cleaning', [
                'clean_html_length' => strlen($cleanHtml),
                'logo_converted_to_base64' => strpos($cleanHtml, 'data:image') !== false,
                'contains_logo_reference' => strpos($cleanHtml, 'hajiNoBackground.png') !== false || strpos($cleanHtml, 'logo') !== false,
                'has_utf8_meta' => strpos($cleanHtml, 'charset="UTF-8"') !== false || strpos($cleanHtml, 'charset=utf-8') !== false,
                'has_xml_encoding' => strpos($cleanHtml, '<?xml encoding="UTF-8"') !== false
            ]);

            // Check if font file exists and use proper font name for DomPDF
            // DomPDF uses the filename (without extension) as the font family name
            $fontFile = storage_path('fonts/NotoSansArabic-Regular.ttf');
            $fontName = 'NotoSansArabic-Regular'; // Must match filename without .ttf extension
            
            if (!file_exists($fontFile)) {
                \Illuminate\Support\Facades\Log::warning('NotoSansArabic-Regular font not found, using DejaVu Sans fallback', [
                    'font_path' => $fontFile,
                    'note' => 'Run: php artisan pdf:download-arabic-font'
                ]);
                // DejaVu Sans has better Unicode support than Arial/Helvetica but still limited for Arabic/Kurdish
                $fontName = 'dejavusans';
            } else {
                \Illuminate\Support\Facades\Log::info('NotoSansArabic-Regular font found, using for PDF generation', [
                    'font_path' => $fontFile,
                    'font_size' => filesize($fontFile),
                    'font_name' => $fontName
                ]);
            }
            
            // Log sample of HTML content to verify UTF-8 characters are preserved
            $sampleText = substr($cleanHtml, 0, 500);
            $hasArabicKurdish = preg_match('/[\x{0600}-\x{06FF}]/u', $cleanHtml) === 1;
            \Illuminate\Support\Facades\Log::info('HTML encoding check', [
                'sample_length' => strlen($sampleText),
                'contains_arabic_kurdish' => $hasArabicKurdish,
                'has_xml_encoding_declaration' => strpos($cleanHtml, '<?xml encoding="UTF-8"') !== false,
                'has_meta_charset' => strpos($cleanHtml, 'charset="UTF-8"') !== false || strpos($cleanHtml, 'charset=utf-8') !== false
            ]);
            
            if ($hasArabicKurdish) {
                \Illuminate\Support\Facades\Log::info('Arabic/Kurdish text detected in HTML - font must support Unicode');
            }

            // Force font to be used by adding inline style if font file exists
            if (file_exists($fontFile) && $fontName === 'NotoSansArabic-Regular') {
                // Inject font-family and fix bidirectional text handling
                $cleanHtml = preg_replace(
                    '/(<body[^>]*>)/i',
                    '$1<style>
                        body, body *, td, th, div, p, span, strong, small { 
                            font-family: "NotoSansArabic-Regular", "DejaVu Sans", sans-serif !important; 
                        }
                        /* Fix reversed Arabic/Kurdish text - use embed (NOT bidi-override) to let bidirectional algorithm work */
                        [dir="rtl"] {
                            direction: rtl !important;
                            unicode-bidi: embed !important;
                            text-align: right !important;
                        }
                        span[dir="rtl"] {
                            display: inline-block !important;
                            direction: rtl !important;
                            unicode-bidi: embed !important;
                        }
                        span[dir="ltr"] {
                            display: inline-block !important;
                            direction: ltr !important;
                            unicode-bidi: embed !important;
                        }
                        /* Force RTL for table cells containing Arabic/Kurdish text */
                        td[dir="rtl"] {
                            direction: rtl !important;
                            unicode-bidi: embed !important;
                        }
                    </style>',
                    $cleanHtml,
                    1
                );
                \Illuminate\Support\Facades\Log::info('Injected inline font style and RTL direction fix');
            }
            
            // Fix reversed Arabic/Kurdish text by wrapping text content in RTL spans
            // DomPDF needs explicit direction: rtl with embed for proper bidirectional text handling
            // Process text nodes only (not HTML tags) to avoid breaking structure
            
            // Fix text inside <strong> tags - handle both plain text and nested HTML (spans from frontend)
            // First, process <strong> tags that contain nested spans (from frontend) - replace bidi-override with embed
            $cleanHtml = preg_replace_callback(
                '/<strong>((?:[^<]|<(?!\/strong>))*)<\/strong>/u',
                function ($matches) {
                    $content = $matches[1];
                    
                    // Check if content contains Arabic/Kurdish characters
                    if (preg_match('/[\x{0600}-\x{06FF}]/u', strip_tags($content))) {
                        // Replace bidi-override with embed in RTL spans to prevent character reversal
                        $content = preg_replace_callback(
                            '/<span\s+dir="rtl"[^>]*style="([^"]*)"[^>]*>/u',
                            function ($spanMatches) {
                                $style = $spanMatches[1];
                                // Replace bidi-override with embed to let bidirectional algorithm work naturally
                                $style = preg_replace('/unicode-bidi:\s*bidi-override/i', 'unicode-bidi: embed', $style);
                                return '<span dir="rtl" style="' . $style . '">';
                            },
                            $content
                        );
                    }
                    
                    return '<strong>' . $content . '</strong>';
                },
                $cleanHtml
            );
            
            // Then, process <strong> tags with plain text (no nested HTML)
            $cleanHtml = preg_replace_callback(
                '/<strong>([^<]+)<\/strong>/u',
                function ($matches) {
                    $text = $matches[1];
                    
                    // Check if text contains Arabic/Kurdish characters
                    if (preg_match('/[\x{0600}-\x{06FF}]/u', $text)) {
                        // Split text into parts and wrap Arabic/Kurdish parts
                        $parts = preg_split('/([\x{0600}-\x{06FF}]+)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
                        $result = '';
                        foreach ($parts as $part) {
                            if (preg_match('/[\x{0600}-\x{06FF}]/u', $part)) {
                                // Arabic/Kurdish: use embed (NOT bidi-override) to let bidirectional algorithm work
                                $result .= '<span dir="rtl" style="direction: rtl; unicode-bidi: embed; display: inline-block;">' . 
                                          htmlspecialchars($part, ENT_QUOTES, 'UTF-8') . 
                                          '</span>';
                            } else {
                                // LTR text: wrap in LTR span to isolate direction
                                $result .= '<span dir="ltr" style="direction: ltr; unicode-bidi: embed; display: inline-block;">' . 
                                          htmlspecialchars($part, ENT_QUOTES, 'UTF-8') . 
                                          '</span>';
                            }
                        }
                        return '<strong>' . $result . '</strong>';
                    }
                    
                    return $matches[0];
                },
                $cleanHtml
            );
            
            // Fix text inside <small> tags
            $cleanHtml = preg_replace_callback(
                '/<small>([^<]+)<\/small>/u',
                function ($matches) {
                    $text = $matches[1];
                    
                    if (preg_match('/[\x{0600}-\x{06FF}]/u', $text)) {
                        $parts = preg_split('/([\x{0600}-\x{06FF}]+)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
                        $result = '';
                        foreach ($parts as $part) {
                            if (preg_match('/[\x{0600}-\x{06FF}]/u', $part)) {
                                $result .= '<span dir="rtl" style="direction: rtl; unicode-bidi: embed; display: inline-block;">' . 
                                          htmlspecialchars($part, ENT_QUOTES, 'UTF-8') . 
                                          '</span>';
                            } else {
                                $result .= htmlspecialchars($part, ENT_QUOTES, 'UTF-8');
                            }
                        }
                        return '<small>' . $result . '</small>';
                    }
                    
                    return $matches[0];
                },
                $cleanHtml
            );
            
            // Fix text inside <td> cells - set entire cell to RTL if it contains Arabic/Kurdish
            // Handle both plain text and nested HTML (spans inside strong tags)
            $cleanHtml = preg_replace_callback(
                '/<td([^>]*)>((?:[^<]|<(?!\/td>))*)<\/td>/u',
                function ($matches) {
                    $attrs = $matches[1];
                    $content = $matches[2];
                    
                    // Check if content contains Arabic/Kurdish characters
                    if (preg_match('/[\x{0600}-\x{06FF}]/u', strip_tags($content))) {
                        // Replace bidi-override with embed in cell attributes
                        $attrs = preg_replace('/unicode-bidi:\s*bidi-override/i', 'unicode-bidi: embed', $attrs);
                        
                        // Set entire cell to RTL direction with embed if not already set
                        if (strpos($attrs, 'dir=') === false) {
                            $attrs .= ' dir="rtl" style="direction: rtl; unicode-bidi: embed; text-align: right;"';
                        } else if (strpos($attrs, 'unicode-bidi') === false) {
                            // If dir is set but unicode-bidi is missing, add it
                            $attrs = preg_replace('/(dir="rtl"[^>]*style="[^"]*)"/', '$1; unicode-bidi: embed"', $attrs);
                        }
                    }
                    
                    return '<td' . $attrs . '>' . $content . '</td>';
                },
                $cleanHtml
            );
            
            \Illuminate\Support\Facades\Log::info('Applied comprehensive RTL text wrapping with embed');

            // Create PDF with settings optimized for base64 images and Arabic/Kurdish support
            $pdf = Pdf::loadHTML($cleanHtml)
                ->setPaper('A4', 'portrait')
                ->setOptions([
                    'defaultFont' => $fontName,
                    'isRemoteEnabled' => false, // Not needed since we use base64
                    'isJavascriptEnabled' => false,
                    'isPhpEnabled' => false,
                    'isFontSubsettingEnabled' => true, // Enable font subsetting to reduce file size
                    'debugKeepTemp' => false,
                    'dpi' => 72,
                    'enable_html5_parser' => false,
                    'chroot' => public_path(), // Allow access to public directory for fallback
                ]);

            // Create filename
            $filename = 'Invoice-' . ($this->orderData['order_id'] ?? time()) . '.pdf';

            // Create the attachment using fromData with a closure (callback function)
            $attachment = Attachment::fromData(function () use ($pdf) {
                return $pdf->output();
            }, $filename)
                ->withMime('application/pdf');

            // Validate PDF generation worked by testing the closure
            $testContent = $pdf->output();
            if (empty($testContent)) {
                throw new \Exception('PDF content generation returned empty result');
            }

            \Illuminate\Support\Facades\Log::info('PDF attachment created successfully', [
                'order_id' => $this->orderData['order_id'] ?? 'unknown',
                'filename' => $filename,
                'pdf_size_bytes' => strlen($testContent)
            ]);

            return [$attachment];

        } catch (\Exception $e) {
            // Log detailed error information to Laravel logs
            \Illuminate\Support\Facades\Log::error('PDF generation failed for email attachment', [
                'order_id' => $this->orderData['order_id'] ?? 'unknown',
                'customer_name' => $this->orderData['customer_name'] ?? 'unknown',
                'error_message' => $e->getMessage(),
                'error_line' => $e->getLine(),
                'error_file' => $e->getFile(),
                'has_invoice_html' => !empty($this->orderData['invoice_html']),
                'invoice_html_length' => isset($this->orderData['invoice_html']) ? strlen($this->orderData['invoice_html']) : 0,
                'trace' => $e->getTraceAsString()
            ]);

            // Return empty array to send email without attachment (don't fail the entire email)
            return [];
        }
    }

    /**
     * Clean HTML for PDF generation and convert images to base64
     */
    private function cleanHtmlForPdf($html)
    {
        // Remove any onerror and complex elements that might break PDF (do this first)
        $html = preg_replace('/onerror="[^"]*"/i', '', $html);
        $html = preg_replace('/<span[^>]*style="display:\s*none[^"]*"[^>]*>.*?<\/span>/i', '', $html);

        // Convert logo images to base64 data URIs - handle all img tag variations
        // Pattern matches: <img src="...">, <img src='...'>, <img ... src="...">, <img ... src='...' ...>
        $html = preg_replace_callback(
            '/<img\s+([^>]*?)src\s*=\s*["\']([^"\']+)["\']([^>]*?)>/i',
            function ($matches) {
                $fullMatch = $matches[0];
                $beforeSrc = $matches[1] ?? '';
                $srcUrl = $matches[2] ?? '';
                $afterSrc = $matches[3] ?? '';
                
                // Skip if already base64
                if (strpos($srcUrl, 'data:image') !== false) {
                    return $fullMatch;
                }
                
                // Get logo path and convert to base64
                $logoBase64 = $this->convertImageToBase64($srcUrl);
                
                if ($logoBase64) {
                    // Reconstruct img tag with proper spacing
                    $beforePart = trim($beforeSrc);
                    $afterPart = trim($afterSrc);
                    $spaceBefore = !empty($beforePart) ? ' ' : '';
                    $spaceAfter = !empty($afterPart) ? ' ' : '';
                    
                    return '<img' . $spaceBefore . $beforePart . ' src="' . $logoBase64 . '"' . $spaceAfter . $afterPart . '>';
                }
                
                // If conversion fails, remove the image tag
                return '';
            },
            $html
        );

        // Simplify gradients for PDF compatibility
        $html = str_replace('background: linear-gradient(', 'background: #f97316; /* linear-gradient(', $html);
        $html = str_replace('background:linear-gradient(', 'background: #f97316; /* linear-gradient(', $html);

        return $html;
    }

    /**
     * Convert image URL to base64 data URI
     * Maximum file size: 5MB to prevent memory issues
     */
    private function convertImageToBase64($imageUrl)
    {
        try {
            // Maximum file size: 5MB (5242880 bytes)
            $maxFileSize = 5242880;
            
            // Decode URL encoding
            $imageUrl = urldecode($imageUrl);
            
            // Remove query parameters
            $imageUrl = strtok($imageUrl, '?');
            
            // Handle absolute URLs (http/https) with security checks
            $imagePath = null;
            
            if (strpos($imageUrl, 'http://') === 0 || strpos($imageUrl, 'https://') === 0) {
                // Security: Only allow specific domains or validate URL
                $parsedUrl = parse_url($imageUrl);
                if (!$parsedUrl || !isset($parsedUrl['host'])) {
                    \Illuminate\Support\Facades\Log::warning('Invalid remote URL for PDF logo', [
                        'url' => $imageUrl
                    ]);
                    return null;
                }
                
                // Handle localhost URLs - convert to file path instead of downloading
                $isLocalhost = in_array($parsedUrl['host'], ['localhost', '127.0.0.1', '::1']) || 
                               strpos($parsedUrl['host'], 'localhost') !== false;
                
                if ($isLocalhost && isset($parsedUrl['path'])) {
                    // Convert localhost URL to file path
                    $localPath = ltrim($parsedUrl['path'], '/');
                    
                    // Try public path first
                    $imagePath = public_path($localPath);
                    if (!file_exists($imagePath) || !is_file($imagePath)) {
                        \Illuminate\Support\Facades\Log::warning('Localhost URL path not found', [
                            'url' => $imageUrl,
                            'tried_path' => $imagePath
                        ]);
                        return null;
                    }
                    
                    \Illuminate\Support\Facades\Log::info('Converted localhost URL to file path', [
                        'original_url' => $imageUrl,
                        'file_path' => $imagePath
                    ]);
                    // Continue to file handling below
                } else {
                    // Remote URL - download with context
                    $context = stream_context_create([
                        'http' => [
                            'timeout' => 10, // 10 second timeout
                            'max_redirects' => 3,
                            'user_agent' => 'Laravel PDF Generator'
                        ]
                    ]);
                    
                    // Download with size limit
                    $imageContent = @file_get_contents($imageUrl, false, $context);
                    
                    if ($imageContent === false) {
                        \Illuminate\Support\Facades\Log::warning('Failed to download remote image', [
                            'url' => $imageUrl
                        ]);
                        return null;
                    }
                    
                    // Check file size
                    if (strlen($imageContent) > $maxFileSize) {
                        \Illuminate\Support\Facades\Log::warning('Remote image too large for PDF', [
                            'url' => $imageUrl,
                            'size' => strlen($imageContent)
                        ]);
                        return null;
                    }
                    
                    // Validate it's actually an image
                    $imageInfo = @getimagesizefromstring($imageContent);
                    if ($imageInfo === false) {
                        \Illuminate\Support\Facades\Log::warning('Downloaded content is not a valid image', [
                            'url' => $imageUrl
                        ]);
                        return null;
                    }
                    
                    $mimeType = $imageInfo['mime'];
                    
                    // Warn about SVG (DomPDF has limited SVG support)
                    if ($mimeType === 'image/svg+xml') {
                        \Illuminate\Support\Facades\Log::warning('SVG image may not render correctly in PDF', [
                            'url' => $imageUrl
                        ]);
                    }
                    
                    $base64 = base64_encode($imageContent);
                    return 'data:' . $mimeType . ';base64,' . $base64;
                }
            }

            // Handle relative paths (or continue from localhost URL conversion above)
            // Only process if $imagePath wasn't already set from localhost URL conversion
            if ($imagePath === null) {
                // Remove leading slash if present
                $cleanUrl = ltrim($imageUrl, '/');
                
                // Security: Prevent path traversal
                if (strpos($cleanUrl, '..') !== false) {
                    \Illuminate\Support\Facades\Log::warning('Path traversal detected in image URL', [
                        'url' => $imageUrl
                    ]);
                    return null;
                }
                
                // Check if it's a public path (images/...)
                if (strpos($cleanUrl, 'images/') === 0) {
                    $imagePath = public_path($cleanUrl);
                } 
                // Check if it's a storage path (handle both /storage/... and storage/...)
                elseif (strpos($cleanUrl, 'storage/') === 0 || strpos($imageUrl, '/storage/') === 0) {
                    $storagePath = str_replace(['storage/', '/storage/'], '', $cleanUrl);
                    $imagePath = storage_path('app/public/' . $storagePath);
                }
                // Check if it's already a full file path (from settings logo_url)
                elseif (file_exists($imageUrl) && is_file($imageUrl)) {
                    // Security: Ensure path is within allowed directories
                    $realPath = realpath($imageUrl);
                    $publicPath = realpath(public_path());
                    $storagePath = realpath(storage_path('app/public'));
                    
                    if ($realPath && (
                        ($publicPath && strpos($realPath, $publicPath) === 0) ||
                        ($storagePath && strpos($realPath, $storagePath) === 0)
                    )) {
                        $imagePath = $realPath;
                    } else {
                        \Illuminate\Support\Facades\Log::warning('Image path outside allowed directories', [
                            'url' => $imageUrl,
                            'real_path' => $realPath
                        ]);
                        return null;
                    }
                }
                // Try as direct public path
                else {
                    $imagePath = public_path($cleanUrl);
                }
            }

            // Check if file exists and is readable
            if ($imagePath && file_exists($imagePath) && is_file($imagePath) && is_readable($imagePath)) {
                // Check file size before reading
                $fileSize = filesize($imagePath);
                if ($fileSize > $maxFileSize) {
                    \Illuminate\Support\Facades\Log::warning('Image file too large for PDF', [
                        'path' => $imagePath,
                        'size' => $fileSize
                    ]);
                    return null;
                }
                
                $imageContent = file_get_contents($imagePath);
                if ($imageContent === false) {
                    \Illuminate\Support\Facades\Log::warning('Failed to read image file', [
                        'path' => $imagePath
                    ]);
                    return null;
                }
                
                // Validate it's actually an image
                $imageInfo = @getimagesizefromstring($imageContent);
                if ($imageInfo === false) {
                    \Illuminate\Support\Facades\Log::warning('File content is not a valid image', [
                        'path' => $imagePath
                    ]);
                    return null;
                }
                
                // Detect MIME type with proper error handling
                $mimeType = null;
                if (function_exists('finfo_open')) {
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    if ($finfo !== false) {
                        $mimeType = finfo_file($finfo, $imagePath);
                        finfo_close($finfo);
                    }
                }
                
                // Fallback MIME type detection
                if (!$mimeType) {
                    // Use detected MIME from image info if available
                    if (isset($imageInfo['mime'])) {
                        $mimeType = $imageInfo['mime'];
                    } else {
                        // Fallback to extension-based detection
                        $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
                        $mimeTypes = [
                            'png' => 'image/png',
                            'jpg' => 'image/jpeg',
                            'jpeg' => 'image/jpeg',
                            'gif' => 'image/gif',
                            'svg' => 'image/svg+xml',
                            'webp' => 'image/webp',
                        ];
                        $mimeType = $mimeTypes[$extension] ?? 'image/png';
                    }
                }
                
                // Warn about SVG
                if ($mimeType === 'image/svg+xml') {
                    \Illuminate\Support\Facades\Log::warning('SVG image may not render correctly in PDF', [
                        'path' => $imagePath
                    ]);
                }
                
                $base64 = base64_encode($imageContent);
                return 'data:' . $mimeType . ';base64,' . $base64;
            }

            // Log if image not found
            \Illuminate\Support\Facades\Log::warning('Logo image not found for PDF', [
                'original_url' => $imageUrl,
                'checked_path' => $imagePath ?? 'none'
            ]);

            return null;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to convert image to base64', [
                'image_url' => $imageUrl,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }
}