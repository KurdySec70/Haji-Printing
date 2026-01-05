<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ImageController extends Controller
{
    /**
     * Serve images from storage with proper headers and caching
     */
    public function serve(Request $request, $path)
    {
        try {
            // Security: Only allow specific file extensions
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            
            if (!in_array($extension, $allowedExtensions)) {
                abort(404, 'File type not allowed');
            }

            // Get the full path to the file
            $fullPath = storage_path('app/public/' . $path);
            
            // Check if file exists
            if (!File::exists($fullPath)) {
                abort(404, 'Image not found');
            }

            // Get file info
            $mimeType = File::mimeType($fullPath);
            $fileSize = File::size($fullPath);
            $lastModified = File::lastModified($fullPath);

            // Check if client has cached version
            $etag = md5($fullPath . $lastModified);
            $ifNoneMatch = $request->header('If-None-Match');
            
            if ($ifNoneMatch && $ifNoneMatch === $etag) {
                return response('', 304, [
                    'ETag' => $etag,
                    'Cache-Control' => 'public, max-age=31536000', // 1 year
                ]);
            }

            // Read and serve the file
            $file = File::get($fullPath);

            return response($file, 200, [
                'Content-Type' => $mimeType,
                'Content-Length' => $fileSize,
                'ETag' => $etag,
                'Last-Modified' => gmdate('D, d M Y H:i:s', $lastModified) . ' GMT',
                'Cache-Control' => 'public, max-age=31536000', // Cache for 1 year
                'Expires' => gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT',
            ]);

        } catch (\Exception $e) {
            \Log::error('Image serving error: ' . $e->getMessage(), [
                'path' => $path,
                'request' => $request->all()
            ]);
            
            abort(404, 'Image not found');
        }
    }

}
