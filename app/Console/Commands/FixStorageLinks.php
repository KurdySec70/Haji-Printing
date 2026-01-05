<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixStorageLinks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:fix-links {--force : Force recreate even if link exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix storage symbolic links and ensure images are accessible';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Fixing storage links...');

        $publicStoragePath = public_path('storage');
        $storagePath = storage_path('app/public');

        // Check if storage directory exists
        if (!File::exists($storagePath)) {
            $this->error('❌ Storage directory does not exist: ' . $storagePath);
            return 1;
        }

        // Remove existing link if it exists and force option is used
        if (File::exists($publicStoragePath) && $this->option('force')) {
            if (is_link($publicStoragePath)) {
                $this->info('🗑️  Removing existing symbolic link...');
                File::delete($publicStoragePath);
            } else {
                $this->info('🗑️  Removing existing directory...');
                File::deleteDirectory($publicStoragePath);
            }
        }

        // Create symbolic link
        if (!File::exists($publicStoragePath)) {
            $this->info('🔗 Creating symbolic link...');
            
            try {
                if (PHP_OS_FAMILY === 'Windows') {
                    // Windows command
                    $command = "mklink /D \"$publicStoragePath\" \"$storagePath\"";
                    exec($command, $output, $returnCode);
                    
                    if ($returnCode !== 0) {
                        throw new \Exception('Windows mklink command failed');
                    }
                } else {
                    // Unix/Linux command
                    symlink($storagePath, $publicStoragePath);
                }
                
                $this->info('✅ Symbolic link created successfully!');
            } catch (\Exception $e) {
                $this->error('❌ Failed to create symbolic link: ' . $e->getMessage());
                $this->warn('💡 You may need to run this command as administrator on Windows');
                return 1;
            }
        } else {
            $this->info('✅ Symbolic link already exists');
        }

        // Verify the link is working
        $this->info('🔍 Verifying link...');
        
        if (is_link($publicStoragePath)) {
            $this->info('✅ Link is properly created');
        } else {
            $this->warn('⚠️  Link exists but may not be working properly');
        }

        // Check for images in storage
        $this->info('📁 Checking for images in storage...');
        $imageCount = 0;
        
        if (File::exists($storagePath . '/posts')) {
            $postImages = File::files($storagePath . '/posts');
            $imageCount += count($postImages);
            $this->info("📸 Found {$imageCount} post images");
        }

        // Test image accessibility
        if ($imageCount > 0) {
            $this->info('🧪 Testing image accessibility...');
            $testImage = File::files($storagePath . '/posts')[0] ?? null;
            
            if ($testImage) {
                $relativePath = 'posts/' . $testImage->getFilename();
                $publicPath = $publicStoragePath . '/' . $relativePath;
                
                if (File::exists($publicPath)) {
                    $this->info('✅ Images are accessible via symbolic link');
                } else {
                    $this->warn('⚠️  Images may not be accessible via symbolic link');
                    $this->info('💡 Using dynamic route fallback: /storage/' . $relativePath);
                }
            }
        }

        $this->info('🎉 Storage links fix completed!');
        $this->newLine();
        $this->info('📋 Summary:');
        $this->info('   • Symbolic link: ' . ($publicStoragePath));
        $this->info('   • Storage path: ' . ($storagePath));
        $this->info('   • Images found: ' . $imageCount);
        $this->info('   • Fallback route: /storage/{path}');
        
        return 0;
    }
}