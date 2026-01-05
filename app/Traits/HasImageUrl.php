<?php

namespace App\Traits;

trait HasImageUrl
{
    /**
     * Get the image URL for a given image path
     * 
     * @param string|null $imagePath
     * @return string|null
     */
    public function getImageUrl(?string $imagePath): ?string
    {
        if (!$imagePath) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($imagePath, 'http')) {
            return $imagePath;
        }

        // Check if file exists in storage
        $fullPath = storage_path('app/public/' . $imagePath);
        if (!file_exists($fullPath)) {
            return null;
        }

        // Use the dynamic route for reliable image serving
        return route('storage.serve', ['path' => $imagePath]);
    }

    /**
     * Get the image URL attribute for Eloquent models
     * 
     * @return string|null
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->getImageUrl($this->image_path ?? null);
    }
}
