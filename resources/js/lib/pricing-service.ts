/**
 * Clean, centralized pricing calculation service
 * Handles all price calculations with proper validation and error handling
 * No business logic, just pure mathematical calculations
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ProductDimensions {
    width?: string | number;
    height?: string | number;
    manualWidth?: string | number;
    manualHeight?: string | number;
    manualWeight?: string | number;
}

export interface ProductPricing {
    id?: number;
    name?: string;
    type: 'pcs' | 'kg' | 'width*height';
    price: number;
    quantity?: number;
    discount?: number;
}

export interface PricingResult {
    unitPrice: number;
    totalPrice: number;
    discountAmount: number;
    finalPrice: number;
    calculation: {
        basePrice: number;
        areaRatio?: number;
        weightMultiplier?: number;
        isExactMatch?: boolean;
    };
}

export interface OrderCalculation {
    subtotal: number;
    totalDiscount: number;
    grandTotal: number;
    itemCount: number;
    items: Array<{
        productId: number;
        name: string;
        unitPrice: number;
        quantity: number;
        totalPrice: number;
        discount: number;
        finalPrice: number;
    }>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse numeric values from strings or numbers
 */
function parseNumeric(value: string | number | undefined, defaultValue: number = 0): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
}

/**
 * Round to 2 decimal places for currency precision
 */
function roundCurrency(amount: number): number {
    return Math.round(amount * 100) / 100;
}

/**
 * Round to integer for width*height products
 */
function roundToInteger(amount: number): number {
    return Math.round(amount);
}

/**
 * Validate that a number is positive
 */
function validatePositive(value: number, fallback: number = 0): number {
    return value > 0 ? value : fallback;
}

// ============================================================================
// CORE PRICING CALCULATIONS
// ============================================================================

/**
 * Get the original base price for a product
 * This is the price the product was originally set for
 */
export function getBasePrice(product: ProductPricing): number {
    return Math.round(product.price);
}

/**
 * Get the original base dimensions for a product
 * These are the dimensions the product was originally priced for
 */
export function getBaseDimensions(product: ProductPricing & ProductDimensions): { width: number; height: number } | null {
    const baseWidth = parseNumeric(product.width, 0);
    const baseHeight = parseNumeric(product.height, 0);
    
    if (!validatePositive(baseWidth) || !validatePositive(baseHeight)) {
        return null;
    }
    
    return { width: baseWidth, height: baseHeight };
}

/**
 * Get the current dimensions that user has entered
 * Returns null if no manual dimensions are set
 */
export function getCurrentDimensions(product: ProductPricing & ProductDimensions): { width: number; height: number } | null {
    const currentWidth = parseNumeric(product.manualWidth, 0);
    const currentHeight = parseNumeric(product.manualHeight, 0);
    
    if (!currentWidth || !currentHeight) {
        return null;
    }
    
    return { width: currentWidth, height: currentHeight };
}

/**
 * Check if product has custom dimensions set by user
 */
export function hasCustomDimensions(product: ProductPricing & ProductDimensions): boolean {
    const currentWidth = parseNumeric(product.manualWidth, 0);
    const currentHeight = parseNumeric(product.manualHeight, 0);
    
    return !!(currentWidth && currentHeight);
}

/**
 * Calculate unit price for a single product
 * Pure function with no side effects
 */
export function calculateUnitPrice(product: ProductPricing & ProductDimensions & { dimensionsAccepted?: boolean }): number {
    // Validate input
    if (!product || typeof product.price !== 'number' || product.price < 0) {
        return 0;
    }

    const basePrice = product.price;

    // Handle piece-based products (no calculation needed)
    if (product.type === 'pcs') {
        return basePrice;
    }

    // Handle kilogram products - only apply custom weight if dimensions are accepted
    if (product.type === 'kg') {
        // Treat undefined as false (not accepted)
        const isAccepted = product.dimensionsAccepted === true;
        if (isAccepted && product.manualWeight) {
            const weight = validatePositive(parseNumeric(product.manualWeight, 1));
            const calculatedPrice = roundCurrency(basePrice * weight);
            return calculatedPrice;
        }
        return basePrice;
    }

    // Handle width*height products - only apply custom dimensions if accepted
    if (product.type === 'width*height') {
        // Treat undefined as false (not accepted)
        const isAccepted = product.dimensionsAccepted === true;
        if (isAccepted) {
            const calculatedPrice = calculateAreaBasedPrice(product, basePrice);
            return calculatedPrice;
        }
        return basePrice;
    }

    // Fallback for unknown types - return integer for consistency
    return Math.round(basePrice);
}

/**
 * Calculate area-based pricing for width*height products
 * Returns integer prices for better pricing accuracy
 * Always compares with original product dimensions
 */
function calculateAreaBasedPrice(product: ProductPricing & ProductDimensions, basePrice: number): number {
    // Get current dimensions (what user has entered)
    const currentWidth = parseNumeric(product.manualWidth, 0);
    const currentHeight = parseNumeric(product.manualHeight, 0);

    // Get base dimensions (the original dimensions the product was priced for)
    // These should ALWAYS be the original product dimensions, never the manual ones
    const baseWidth = parseNumeric(product.width, 0);
    const baseHeight = parseNumeric(product.height, 0);


    // If no manual dimensions are set, use base dimensions (no price change)
    if (!currentWidth || !currentHeight) {
        return Math.round(basePrice);
    }

    // Validate base dimensions (must exist for comparison)
    if (!validatePositive(baseWidth) || !validatePositive(baseHeight)) {
        return Math.round(basePrice);
    }

    // Check for exact match (within tolerance)
    const tolerance = 0.1; // 0.1cm tolerance for exact match
    const isExactMatch = 
        Math.abs(currentWidth - baseWidth) < tolerance && 
        Math.abs(currentHeight - baseHeight) < tolerance;


    if (isExactMatch) {
        return Math.round(basePrice); // Return integer base price
    }

    // Calculate area-based pricing
    const currentArea = currentWidth * currentHeight;
    const baseArea = baseWidth * baseHeight;
    
    
    // Ensure we don't divide by zero
    if (baseArea === 0) {
        return Math.round(basePrice);
    }
    
    const areaRatio = currentArea / baseArea;
    const calculatedPrice = basePrice * areaRatio;


    // Ensure minimum price is 1 (never return 0)
    const finalPrice = Math.max(1, calculatedPrice);


    // For width*height products, always return integer prices
    const roundedPrice = roundToInteger(finalPrice);
    
    return roundedPrice;
}

/**
 * Calculate total price for a product with quantity and discount
 */
export function calculateProductTotal(product: ProductPricing & ProductDimensions): PricingResult {
    const unitPrice = calculateUnitPrice(product);
    const quantity = validatePositive(product.quantity || 1);
    const discount = validatePositive(product.discount || 0);
    
    const totalPrice = roundCurrency(unitPrice * quantity);
    const discountAmount = roundCurrency(Math.min(discount, totalPrice));
    const finalPrice = roundCurrency(totalPrice - discountAmount);

    return {
        unitPrice,
        totalPrice,
        discountAmount,
        finalPrice,
        calculation: {
            basePrice: product.price,
            areaRatio: product.type === 'width*height' ? 
                calculateAreaRatio(product) : undefined,
            weightMultiplier: product.type === 'kg' ? 
                parseNumeric(product.manualWeight, 1) : undefined,
            isExactMatch: product.type === 'width*height' ? 
                isExactDimensionMatch(product) : undefined
        }
    };
}

/**
 * Calculate area ratio for width*height products
 * Always compares with original product dimensions
 */
function calculateAreaRatio(product: ProductPricing & ProductDimensions): number {
    // Get current dimensions (what user has entered)
    const currentWidth = parseNumeric(product.manualWidth, 0);
    const currentHeight = parseNumeric(product.manualHeight, 0);
    
    // Get base dimensions (the original dimensions the product was priced for)
    const baseWidth = parseNumeric(product.width, 0);
    const baseHeight = parseNumeric(product.height, 0);

    // If no manual dimensions are set, ratio is 1 (no change)
    if (!currentWidth || !currentHeight) {
        return 1;
    }

    if (!validatePositive(baseWidth) || !validatePositive(baseHeight)) {
        return 1;
    }

    const currentArea = currentWidth * currentHeight;
    const baseArea = baseWidth * baseHeight;
    
    // Ensure we don't divide by zero
    if (baseArea === 0) {
        return 1;
    }
    
    return roundCurrency(currentArea / baseArea);
}

/**
 * Check if dimensions are exact match
 * Always compares with original product dimensions
 */
function isExactDimensionMatch(product: ProductPricing & ProductDimensions): boolean {
    // Get current dimensions (what user has entered)
    const currentWidth = parseNumeric(product.manualWidth, 0);
    const currentHeight = parseNumeric(product.manualHeight, 0);
    
    // Get base dimensions (the original dimensions the product was priced for)
    const baseWidth = parseNumeric(product.width, 0);
    const baseHeight = parseNumeric(product.height, 0);

    // If no manual dimensions are set, it's an exact match
    if (!currentWidth || !currentHeight) {
        return true;
    }

    const tolerance = 0.1; // 0.1cm tolerance for exact match
    return Math.abs(currentWidth - baseWidth) < tolerance && 
           Math.abs(currentHeight - baseHeight) < tolerance;
}

// ============================================================================
// ORDER-LEVEL CALCULATIONS
// ============================================================================

/**
 * Calculate complete order totals
 */
export function calculateOrderTotal(products: Array<ProductPricing & ProductDimensions>): OrderCalculation {
    if (!Array.isArray(products) || products.length === 0) {
        return {
            subtotal: 0,
            totalDiscount: 0,
            grandTotal: 0,
            itemCount: 0,
            items: []
        };
    }

    const items = products.map(product => {
        const pricing = calculateProductTotal(product);
        return {
            productId: product.id || 0,
            name: product.name || 'Unknown Product',
            unitPrice: pricing.unitPrice,
            quantity: product.quantity || 1,
            totalPrice: pricing.totalPrice,
            discount: pricing.discountAmount,
            finalPrice: pricing.finalPrice
        };
    });

    const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.totalPrice, 0));
    const totalDiscount = roundCurrency(items.reduce((sum, item) => sum + item.discount, 0));
    const grandTotal = roundCurrency(subtotal - totalDiscount);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
        subtotal,
        totalDiscount,
        grandTotal,
        itemCount,
        items
    };
}

/**
 * Apply order-level discount to order total
 */
export function applyOrderDiscount(orderTotal: number, discountAmount: number): number {
    const validDiscount = validatePositive(discountAmount);
    const maxDiscount = Math.min(validDiscount, orderTotal);
    return roundCurrency(orderTotal - maxDiscount);
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Legacy function for backward compatibility
 * @deprecated Use calculateUnitPrice instead
 */
export function calculateDynamicPrice(product: ProductPricing & ProductDimensions): number {
    return calculateUnitPrice(product);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use calculateProductTotal instead
 */
export function calculateTotalPrice(product: ProductPricing & ProductDimensions): number {
    return calculateProductTotal(product).finalPrice;
}

/**
 * Get detailed pricing calculation information
 * @deprecated Use calculateProductTotal instead
 */
export function getPricingCalculation(product: ProductPricing & ProductDimensions) {
    const pricing = calculateProductTotal(product);
    
    if (product.type !== 'width*height' && product.type !== 'kg') {
        return null;
    }

    // Get current dimensions (what user has entered)
    const currentWidth = parseNumeric(product.manualWidth, 0);
    const currentHeight = parseNumeric(product.manualHeight, 0);
    
    // Get base dimensions (the original dimensions the product was priced for)
    const baseWidth = parseNumeric(product.width, 0);
    const baseHeight = parseNumeric(product.height, 0);

    return {
        currentPrice: pricing.unitPrice,
        basePrice: pricing.calculation.basePrice,
        areaRatio: pricing.calculation.areaRatio,
        currentArea: product.type === 'width*height' ? 
            (currentWidth && currentHeight ? currentWidth * currentHeight : 0) : 0,
        baseArea: product.type === 'width*height' ? 
            (baseWidth && baseHeight ? baseWidth * baseHeight : 0) : 0,
        isExactMatch: pricing.calculation.isExactMatch
    };
}
