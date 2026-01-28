<?php

namespace App\Http\Controllers;

use App\Models\InvoiceSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InvoiceSettingsController extends Controller
{
    public function get()
    {
        return response()->json([
            'settings' => InvoiceSettings::getSettings()
        ]);
    }
    
    public function update(Request $request)
    {
        // Extract settings from nested structure
        $settingsData = $request->input('settings', $request->all());
        
        $validated = $request->validate([
            'settings.header_color' => 'string|max:7',
            'settings.footer_color' => 'string|max:7',
            'settings.table_header_color' => 'string|max:7',
            'settings.primary_font' => 'string|max:50',
            'settings.font_size_base' => 'integer|min:8|max:20',
            'settings.font_weight' => 'nullable|string|in:300,400,500,600,700,800',
            'settings.logo_url' => 'nullable|string|max:2048',
            'settings.logo_width' => 'integer|min:50|max:200',
            'settings.logo_height' => 'integer|min:50|max:200',
            'settings.company_title' => 'string|max:100',
            'settings.company_name' => 'string|max:100',
            'settings.company_address' => 'string|max:500',
            'settings.company_phone_1' => 'string|max:50',
            'settings.company_phone_2' => 'nullable|string|max:50',
            'settings.company_email' => 'email|max:100',
            'settings.company_website' => 'nullable|string|max:100',
            'settings.header_height' => 'integer|min:40|max:100',
            'settings.footer_height' => 'integer|min:30|max:80',
            'settings.show_logo' => 'boolean',
            'settings.show_company_info' => 'boolean',
            'settings.show_date_time' => 'boolean',
        ]);
        
        $settings = InvoiceSettings::getSettings();
        $settings->update($settingsData);
        
        // Clear any cached settings
        \Cache::forget('invoice_settings');
        
        return response()->json([
            'success' => true,
            'settings' => $settings->fresh()
        ]);
    }
    
    public function uploadLogo(Request $request)
    {
        try {
            $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120' // 5MB max
            ]);
            
            // Delete old logo if exists
            $settings = InvoiceSettings::getSettings();
            if ($settings->logo_url) {
                $oldLogoPath = str_replace(['/storage/', url('/storage/')], '', $settings->logo_url);
                $oldLogoPath = ltrim($oldLogoPath, '/');
                if (Storage::disk('public')->exists($oldLogoPath)) {
                    Storage::disk('public')->delete($oldLogoPath);
                }
            }
            
            // Ensure logos directory exists with proper permissions
            $logosPath = 'logos';
            if (!Storage::disk('public')->directoryExists($logosPath)) {
                Storage::disk('public')->makeDirectory($logosPath, 0755, true);
            }
            
            // Set directory permissions explicitly (for Unix-like systems)
            $fullDirPath = Storage::disk('public')->path($logosPath);
            if (file_exists($fullDirPath) && is_dir($fullDirPath)) {
                @chmod($fullDirPath, 0755);
                // Ensure parent directories are writable
                $parentPath = dirname($fullDirPath);
                if (file_exists($parentPath) && is_dir($parentPath)) {
                    @chmod($parentPath, 0755);
                }
            }
            
            // Upload new logo
            $file = $request->file('logo');
            $filename = 'logo-' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');
            
            // Verify file was created
            if (!Storage::disk('public')->exists($path)) {
                throw new \Exception('Failed to save logo file. Please check directory permissions.');
            }
            
            // Set file permissions (for Unix-like systems, has no effect on Windows)
            $fullPath = Storage::disk('public')->path($path);
            if (file_exists($fullPath)) {
                @chmod($fullPath, 0644);
            }
            
            // Generate the public URL for the logo
            // Use Storage::url() for reliable URL generation that works with symlinks
            $logoUrl = Storage::disk('public')->url($path);
            
            // Update settings with new logo URL
            $settings->update(['logo_url' => $logoUrl]);
            
            return response()->json([
                'success' => true,
                'logo_url' => $logoUrl
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Check if it's a file size error
            $errorMessage = $e->getMessage();
            if (str_contains($errorMessage, '413') || str_contains($errorMessage, 'too large') || str_contains($errorMessage, 'Request Entity Too Large')) {
                return response()->json([
                    'success' => false,
                    'message' => 'File is too large. Maximum size is 5MB. Please reduce the image size and try again.'
                ], 413);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $errorMessage
            ], 500);
        }
    }
    
    public function reset()
    {
        try {
            $settings = InvoiceSettings::getSettings();
            
            // Reset to default values from seeder
            $defaultSettings = [
                'header_color' => '#f97316',
                'footer_color' => '#f97316',
                'table_header_color' => '#f97316',
                'primary_font' => 'Arial',
                'font_size_base' => 12,
                'font_weight' => '400',
                'logo_width' => 90,
                'logo_height' => 90,
                'logo_url' => null,
                'company_title' => 'INVOICE',
                'company_name' => 'Haji Printing',
                'company_address' => 'Erbil-Ehsa Street, Near Sarhad Stationery',
                'company_phone_1' => '0751 446 39 59',
                'company_phone_2' => '0751 447 39 59',
                'company_email' => 'info@hajiprinting.com',
                'company_website' => 'www.hajiprinting.com',
                'header_height' => 60,
                'footer_height' => 40,
                'show_logo' => true,
                'show_company_info' => true,
                'show_date_time' => true
            ];
            
            // Delete old logo if exists
            if ($settings->logo_url) {
                $oldLogoPath = str_replace('/storage/', '', $settings->logo_url);
                if (Storage::disk('public')->exists($oldLogoPath)) {
                    Storage::disk('public')->delete($oldLogoPath);
                }
            }
            
            $settings->update($defaultSettings);
            
            // Clear any cached settings
            \Cache::forget('invoice_settings');
            
            return response()->json([
                'success' => true,
                'message' => 'Settings reset to default values',
                'settings' => $settings->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reset failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
