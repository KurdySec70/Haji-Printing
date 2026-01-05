/**
 * IQD Currency formatting utilities
 */

/**
 * Format a number as IQD currency with proper thousands separators
 * @param amount - The number to format
 * @returns Formatted string with commas (e.g., "1,000,000,983")
 */
export function formatIQD(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        return '0';
    }
    
    // Format with commas as thousands separators
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true
    });
}

/**
 * Parse a formatted IQD string back to a number
 * @param formattedAmount - The formatted string (e.g., "1,000,000,983")
 * @returns The numeric value
 */
export function parseIQD(formattedAmount: string): number {
    if (!formattedAmount) return 0;
    
    // Remove commas and parse
    const cleanAmount = formattedAmount.replace(/,/g, '');
    const num = parseFloat(cleanAmount);
    
    return isNaN(num) ? 0 : num;
}

/**
 * Format IQD for display with currency symbol
 * @param amount - The number to format
 * @returns Formatted string with IQD symbol (e.g., "1,000,000,983 IQD")
 */
export function formatIQDWithSymbol(amount: number | string): string {
    return `${formatIQD(amount)} IQD`;
}
