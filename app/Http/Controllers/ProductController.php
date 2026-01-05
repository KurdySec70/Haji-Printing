<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::select(['id', 'name', 'price', 'type', 'width', 'height', 'created_at']);
        
        // Apply search filter
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Apply type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        
        // Apply price range filters
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }
        
        // Apply sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if (in_array($sortBy, ['name', 'price', 'type', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('name', 'asc');
        }
        
        // Add pagination for better performance with large datasets
        $perPage = $request->get('per_page', 10);
        $products = $query->paginate($perPage)->withQueryString();
        
        // Get current filters for the frontend
        $filters = [
            'search' => $request->get('search', ''),
            'type' => $request->get('type', ''),
            'priceMin' => $request->get('price_min', ''),
            'priceMax' => $request->get('price_max', ''),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder
        ];
        
        return Inertia::render('admin/products', [
            'products' => $products,
            'filters' => $filters
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        
        // Clean up width and height if type is not width*height
        if ($validated['type'] !== 'width*height') {
            $validated['width'] = null;
            $validated['height'] = null;
        }
        
        $product = Product::create($validated);

        $responsePayload = [
            'success' => true,
            'message' => 'Product created successfully',
            'product' => $product->only(['id', 'name', 'price', 'type', 'width', 'height', 'created_at', 'updated_at'])
        ];
        
        return response()->json($responsePayload, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('admin/product-show', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductRequest $request, Product $product)
    {
        $validated = $request->validated();
        
        // Clean up width and height if type is not width*height
        if ($validated['type'] !== 'width*height') {
            $validated['width'] = null;
            $validated['height'] = null;
        }
        
        $product->update($validated);

        $responsePayload = [
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product->only(['id', 'name', 'price', 'type', 'width', 'height', 'created_at', 'updated_at'])
        ];

        if ($request->hasHeader('X-Inertia')) {
            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully');
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json($responsePayload);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        $product->delete();

        if ($request->hasHeader('X-Inertia')) {
            return redirect()->route('admin.products.index')
                ->with('success', 'Product deleted successfully');
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully');
    }

    /**
     * Search products by name for POS dropdown
     * 
     * Search Strategy:
     * 1. First try "starts with" search (e.g., "t" finds "Table", "T-shirt")
     * 2. If no results and query > 1 character, fallback to partial match
     * 3. Results are case-insensitive and ordered alphabetically
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('q', '');
            
            if (empty($query)) {
                return response()->json([
                    'success' => true,
                    'products' => []
                ]);
            }

            // Use raw database query to avoid model accessor issues
            // First try to find products that start with the query (case-insensitive)
            $products = \DB::table('products')
                ->whereRaw('LOWER(name) LIKE LOWER(?)', [$query . '%'])
                ->select('id', 'name', 'price', 'type', 'width', 'height')
                ->orderBy('name', 'asc')
                ->limit(10)
                ->get();

            // If no results found with "starts with", try partial match as fallback
            if ($products->isEmpty() && strlen($query) > 1) {
                $products = \DB::table('products')
                    ->whereRaw('LOWER(name) LIKE LOWER(?)', ['%' . $query . '%'])
                    ->select('id', 'name', 'price', 'type', 'width', 'height')
                    ->orderBy('name', 'asc')
                    ->limit(10)
                    ->get();
            }

            $products = $products->map(function ($product) {
                    return [
                        'id' => (int) $product->id,
                        'name' => $product->name,
                        'price' => (float) $product->price,
                        'type' => $product->type,
                        'width' => $product->width ? (string) $product->width . ' cm' : null,
                        'height' => $product->height ? (string) $product->height . ' cm' : null,
                    ];
                });

            return response()->json([
                'success' => true,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            \Log::error('Product search error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'error' => 'Search failed: ' . $e->getMessage(),
                'products' => []
            ], 500);
        }
    }
}
