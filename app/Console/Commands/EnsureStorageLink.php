<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class EnsureStorageLink extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:ensure-link {--force : Force recreate the link even if it exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure the storage symlink exists and is working properly';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $publicStoragePath = public_path('storage');
        $storagePath = storage_path('app/public');

        // Check if storage/app/public exists
        if (!File::exists($storagePath)) {
            $this->error('Storage directory does not exist: ' . $storagePath);
            return 1;
        }

        // Check if public/storage exists
        if (File::exists($publicStoragePath)) {
            if ($this->option('force')) {
                $this->info('Removing existing storage link...');
                File::deleteDirectory($publicStoragePath);
            } else {
                $this->info('Storage link already exists.');
                
                // Test if the link is working
                if ($this->testStorageLink()) {
                    $this->info('Storage link is working correctly.');
                    return 0;
                } else {
                    $this->warn('Storage link exists but is not working properly.');
                    if ($this->confirm('Do you want to recreate the link?')) {
                        File::deleteDirectory($publicStoragePath);
                    } else {
                        return 1;
                    }
                }
            }
        }

        // Create the symlink
        try {
            if (PHP_OS_FAMILY === 'Windows') {
                // On Windows, create a junction instead of a symlink
                $this->info('Creating storage junction (Windows)...');
                $this->createWindowsJunction($storagePath, $publicStoragePath);
            } else {
                // On Unix-like systems, create a symlink
                $this->info('Creating storage symlink...');
                symlink($storagePath, $publicStoragePath);
            }

            $this->info('Storage link created successfully.');

            // Test the link
            if ($this->testStorageLink()) {
                $this->info('Storage link is working correctly.');
                return 0;
            } else {
                $this->error('Storage link was created but is not working properly.');
                return 1;
            }

        } catch (\Exception $e) {
            $this->error('Failed to create storage link: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Create a Windows junction
     */
    private function createWindowsJunction(string $target, string $link): void
    {
        $command = sprintf('mklink /J "%s" "%s"', $link, $target);
        $output = [];
        $returnCode = 0;
        
        exec($command, $output, $returnCode);
        
        if ($returnCode !== 0) {
            throw new \Exception('Failed to create Windows junction: ' . implode(' ', $output));
        }
    }

    /**
     * Test if the storage link is working
     */
    private function testStorageLink(): bool
    {
        $testFile = 'test-' . time() . '.txt';
        $testContent = 'Storage link test';
        
        try {
            // Create a test file in storage
            Storage::disk('public')->put($testFile, $testContent);
            
            // Check if the file is accessible via the public link
            $publicPath = public_path('storage/' . $testFile);
            $isAccessible = File::exists($publicPath) && File::get($publicPath) === $testContent;
            
            // Clean up the test file
            Storage::disk('public')->delete($testFile);
            
            return $isAccessible;
        } catch (\Exception $e) {
            return false;
        }
    }
}