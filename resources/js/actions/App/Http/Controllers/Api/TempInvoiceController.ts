import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
export const getTempInvoiceData = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTempInvoiceData.url(args, options),
    method: 'get',
})

getTempInvoiceData.definition = {
    methods: ["get","head"],
    url: '/api/temp-invoice/{tempId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
getTempInvoiceData.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tempId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tempId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tempId: args.tempId,
                }

    return getTempInvoiceData.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
getTempInvoiceData.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTempInvoiceData.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
getTempInvoiceData.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTempInvoiceData.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
    const getTempInvoiceDataForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTempInvoiceData.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
        getTempInvoiceDataForm.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTempInvoiceData.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::getTempInvoiceData
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
        getTempInvoiceDataForm.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTempInvoiceData.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTempInvoiceData.form = getTempInvoiceDataForm
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::createTempLink
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
export const createTempLink = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTempLink.url(options),
    method: 'post',
})

createTempLink.definition = {
    methods: ["post"],
    url: '/api/create-temp-invoice-link',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::createTempLink
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
createTempLink.url = (options?: RouteQueryOptions) => {
    return createTempLink.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::createTempLink
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
createTempLink.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTempLink.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::createTempLink
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
    const createTempLinkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createTempLink.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::createTempLink
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
        createTempLinkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createTempLink.url(options),
            method: 'post',
        })
    
    createTempLink.form = createTempLinkForm
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::markAsUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
export const markAsUsed = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUsed.url(args, options),
    method: 'post',
})

markAsUsed.definition = {
    methods: ["post"],
    url: '/api/temp-invoice/{tempId}/mark-used',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::markAsUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
markAsUsed.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tempId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tempId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tempId: args.tempId,
                }

    return markAsUsed.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::markAsUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
markAsUsed.post = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUsed.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::markAsUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
    const markAsUsedForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsUsed.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::markAsUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
        markAsUsedForm.post = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsUsed.url(args, options),
            method: 'post',
        })
    
    markAsUsed.form = markAsUsedForm
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanupExpired
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
export const cleanupExpired = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanupExpired.url(options),
    method: 'post',
})

cleanupExpired.definition = {
    methods: ["post"],
    url: '/api/temp-invoice/cleanup-expired',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanupExpired
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
cleanupExpired.url = (options?: RouteQueryOptions) => {
    return cleanupExpired.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanupExpired
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
cleanupExpired.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanupExpired.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanupExpired
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
    const cleanupExpiredForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cleanupExpired.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanupExpired
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
        cleanupExpiredForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cleanupExpired.url(options),
            method: 'post',
        })
    
    cleanupExpired.form = cleanupExpiredForm
const TempInvoiceController = { getTempInvoiceData, createTempLink, markAsUsed, cleanupExpired }

export default TempInvoiceController