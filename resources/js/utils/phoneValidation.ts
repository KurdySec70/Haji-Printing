/**
 * Iraqi Phone Number Validation Utility
 * 
 * Validates and formats Iraqi phone numbers for WhatsApp communication
 * Supports various Iraqi mobile number formats
 */

/**
 * Valid Iraqi mobile number prefixes
 * These are the main mobile operators in Iraq
 */
const IRAQI_MOBILE_PREFIXES = [
    '750', '751', '752', '753', '754', '755', '756', '757', '758', '759', // Zain
    '770', '771', '772', '773', '774', '775', '776', '777', '778', '779', // Asiacell
    '780', '781', '782', '783', '784', '785', '786', '787', '788', '789', // Korek
];

/**
 * Validate if a phone number is a valid Iraqi mobile number
 * @param phone - The phone number to validate
 * @returns Object with validation result and formatted number
 */
export function validateIraqiPhoneNumber(phone: string): {
    isValid: boolean;
    formattedNumber: string;
    error?: string;
} {
    if (!phone || typeof phone !== 'string') {
        return {
            isValid: false,
            formattedNumber: '',
            error: 'Phone number is required'
        };
    }

    // Remove all non-digit characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');

    // Remove leading + if present
    if (cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.substring(1);
    }

    // Check if it starts with 964 (Iraq country code)
    if (cleanPhone.startsWith('964')) {
        cleanPhone = cleanPhone.substring(3);
    }

    // Check if it starts with 0 (local format)
    if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
    }

    // Validate length (should be 10 digits after cleaning)
    if (cleanPhone.length !== 10) {
        return {
            isValid: false,
            formattedNumber: '',
            error: 'Iraqi mobile number must be 10 digits'
        };
    }

    // Check if it starts with a valid Iraqi mobile prefix
    const prefix = cleanPhone.substring(0, 3);
    if (!IRAQI_MOBILE_PREFIXES.includes(prefix)) {
        return {
            isValid: false,
            formattedNumber: '',
            error: `Invalid Iraqi mobile prefix: ${prefix}. Valid prefixes: 750-759, 770-779, 780-789`
        };
    }

    // Return the clean 10-digit number (without country code)
    const formattedNumber = cleanPhone;

    return {
        isValid: true,
        formattedNumber,
        error: undefined
    };
}

/**
 * Format a phone number for display
 * @param phone - The phone number to format
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
    const validation = validateIraqiPhoneNumber(phone);
    
    if (!validation.isValid) {
        return phone; // Return original if invalid
    }

    // Use the clean 10-digit number directly
    const cleanNumber = validation.formattedNumber;
    
    // Format as XXX XXX XXXX
    return `${cleanNumber.substring(0, 3)} ${cleanNumber.substring(3, 6)} ${cleanNumber.substring(6)}`;
}

/**
 * Get placeholder text for Iraqi phone number input
 */
export function getIraqiPhonePlaceholder(): string {
    return '7501234567';
}

/**
 * Get help text for Iraqi phone number format
 */
export function getIraqiPhoneHelpText(): string {
    return 'Enter Iraqi mobile number (e.g., 07501234567 or 7501234567)';
}

/**
 * Validate phone number in real-time as user types
 * @param phone - The phone number being typed
 * @returns Validation result with suggestions
 */
export function validatePhoneInput(phone: string): {
    isValid: boolean;
    isComplete: boolean;
    suggestion?: string;
    error?: string;
} {
    if (!phone) {
        return {
            isValid: false,
            isComplete: false
        };
    }

    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Check if it starts with 0 (local format)
    if (cleanPhone.startsWith('0')) {
        if (cleanPhone.length < 11) { // 0XXXXXXXXXX
            return {
                isValid: false,
                isComplete: false,
                suggestion: 'Complete the number (e.g., 07501234567)'
            };
        }
    } else {
        if (cleanPhone.length < 10) { // XXXXXXXXXX
            return {
                isValid: false,
                isComplete: false,
                suggestion: 'Complete the number (e.g., 7501234567)'
            };
        }
    }

    // If we get here, the number seems complete, validate it
    const validation = validateIraqiPhoneNumber(phone);
    
    return {
        isValid: validation.isValid,
        isComplete: true,
        error: validation.error
    };
}
