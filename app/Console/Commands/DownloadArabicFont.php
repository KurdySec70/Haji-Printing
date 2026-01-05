<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class DownloadArabicFont extends Command
{
    protected $signature = 'pdf:download-arabic-font';
    protected $description = 'Download Noto Sans Arabic font for PDF generation';

    public function handle()
    {
        $this->info('Downloading Noto Sans Arabic font for DomPDF...');

        $fontDir = storage_path('fonts');
        
        // Ensure font directory exists
        if (!File::exists($fontDir)) {
            File::makeDirectory($fontDir, 0755, true);
            $this->info("Created font directory: {$fontDir}");
        }

        $regularFont = $fontDir . '/NotoSansArabic-Regular.ttf';
        $boldFont = $fontDir . '/NotoSansArabic-Bold.ttf';

        // Download Regular font
        if (!File::exists($regularFont)) {
            $this->info('Downloading NotoSansArabic-Regular.ttf from CDN...');
            try {
                // Using jsDelivr CDN (reliable and handles SSL properly)
                // jsDelivr serves GitHub files through their CDN with proper SSL
                $url = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf';
                
                $this->line('Downloading from jsDelivr CDN...');
                $response = Http::timeout(60)->get($url);
                
                if ($response->successful() && strlen($response->body()) > 1000) {
                    $content = $response->body();
                    // Verify it's a valid TTF file (TTF files start with specific headers)
                    if (substr($content, 0, 4) === "\x00\x01\x00\x00" || substr($content, 0, 4) === "OTTO" || strpos($content, 'glyf') !== false) {
                        File::put($regularFont, $content);
                        $this->info('✓ NotoSansArabic-Regular.ttf downloaded successfully from CDN');
                    } else {
                        throw new \Exception('Downloaded file does not appear to be a valid TTF font');
                    }
                } else {
                    throw new \Exception('Failed to download font. Status: ' . $response->status());
                }
            } catch (\Exception $e) {
                $this->warn('CDN download failed: ' . $e->getMessage());
                $this->info('Trying alternative method using file_get_contents...');
                
                // Fallback: Use file_get_contents with stream context (handles SSL better on Windows)
                try {
                    $url = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf';
                    
                    $context = stream_context_create([
                        'http' => [
                            'timeout' => 60,
                            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        ],
                        'ssl' => [
                            'verify_peer' => false,
                            'verify_peer_name' => false,
                        ]
                    ]);
                    
                    $content = @file_get_contents($url, false, $context);
                    
                    if ($content !== false && strlen($content) > 1000) {
                        File::put($regularFont, $content);
                        $this->info('✓ NotoSansArabic-Regular.ttf downloaded successfully using file_get_contents');
                    } else {
                        throw new \Exception('Failed to download font using file_get_contents');
                    }
                } catch (\Exception $e2) {
                    $this->error('All download methods failed: ' . $e2->getMessage());
                    $this->warn('');
                    $this->warn('Please download manually:');
                    $this->line('1. Visit: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic');
                    $this->line('2. Click "Download family"');
                    $this->line('3. Extract and copy NotoSansArabic-Regular.ttf to: ' . $fontDir);
                    return 1;
                }
            }
        } else {
            $this->info('✓ NotoSansArabic-Regular.ttf already exists');
        }

        // For Bold font, we'll use a workaround or user can download manually
        if (!File::exists($boldFont)) {
            $this->warn('Bold font not found. Copying Regular font as Bold (you can replace it later)...');
            File::copy($regularFont, $boldFont);
            $this->info('✓ NotoSansArabic-Bold.ttf created (using Regular font)');
            $this->warn('For proper Bold font, download from: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic');
        } else {
            $this->info('✓ NotoSansArabic-Bold.ttf already exists');
        }

        $this->info('');
        $this->info('Font download complete!');
        $this->info('Next step: Register the font with DomPDF');
        $this->info('Run: php artisan pdf:register-arabic-font');
        $this->info('');
        $this->info('Or DomPDF will auto-detect fonts in: ' . $fontDir);

        return 0;
    }
}
