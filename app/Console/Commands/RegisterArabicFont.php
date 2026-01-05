<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RegisterArabicFont extends Command
{
    protected $signature = 'pdf:register-arabic-font';
    protected $description = 'Download and register Noto Sans Arabic font for PDF generation';

    public function handle()
    {
        $this->info('Registering Noto Sans Arabic font for DomPDF...');

        $fontDir = storage_path('fonts');
        
        // Ensure font directory exists
        if (!File::exists($fontDir)) {
            File::makeDirectory($fontDir, 0755, true);
            $this->info("Created font directory: {$fontDir}");
        }

        // Font file paths
        $fontFile = $fontDir . '/NotoSansArabic-Regular.ttf';
        $fontBoldFile = $fontDir . '/NotoSansArabic-Bold.ttf';

        // Check if fonts already exist
        if (File::exists($fontFile) && File::exists($fontBoldFile)) {
            $this->info('Font files already exist. Registering with DomPDF...');
        } else {
            $this->warn('Font files not found. Please download Noto Sans Arabic fonts:');
            $this->line('1. Download from: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic');
            $this->line('2. Extract the TTF files');
            $this->line('3. Copy NotoSansArabic-Regular.ttf and NotoSansArabic-Bold.ttf to: ' . $fontDir);
            $this->line('');
            $this->line('Or use this direct link:');
            $this->line('https://github.com/google/fonts/raw/main/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf');
            $this->line('');
            
            if (!$this->confirm('Do you want to continue with font registration? (You can download fonts later)', true)) {
                return 1;
            }
        }

        // DomPDF auto-detects fonts in the font_dir
        // We just need to verify the fonts are there
        if (File::exists($fontFile)) {
            $this->info('✓ NotoSansArabic-Regular.ttf found');
        } else {
            $this->error('✗ NotoSansArabic-Regular.ttf not found');
            $this->warn('Run: php artisan pdf:download-arabic-font');
            return 1;
        }

        if (File::exists($fontBoldFile)) {
            $this->info('✓ NotoSansArabic-Bold.ttf found');
        } else {
            $this->warn('⚠ NotoSansArabic-Bold.ttf not found (optional, but recommended)');
        }

        $this->info('');
        $this->info('Font files are ready!');
        $this->info('DomPDF will automatically detect fonts in: ' . $fontDir);
        $this->info('');
            $this->info('The font is already configured in PDF generation code.');
            $this->info('Font name used: "NotoSansArabic-Regular"');
            $this->info('You can now generate PDFs with Kurdish Sorani and Arabic text support.');
            $this->info('');
            $this->info('Note: If fonts still don\'t work, you may need to clear DomPDF font cache:');
            $this->line('Delete: storage/fonts/.dompdf_cache/ (if exists)');
            $this->line('Or clear Laravel cache: php artisan cache:clear');

        return 0;
    }
}
