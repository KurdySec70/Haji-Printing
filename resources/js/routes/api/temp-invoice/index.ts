import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
export const get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})

get.definition = {
    methods: ["get","head"],
    url: '/api/temp-invoice/{tempId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
get.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return get.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
get.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
get.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: get.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
    const getForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: get.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
        getForm.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::get
 * @see app/Http/Controllers/Api/TempInvoiceController.php:93
 * @route '/api/temp-invoice/{tempId}'
 */
        getForm.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    get.form = getForm
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::create
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/api/create-temp-invoice-link',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::create
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::create
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::create
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::create
 * @see app/Http/Controllers/Api/TempInvoiceController.php:17
 * @route '/api/create-temp-invoice-link'
 */
        createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::markUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
export const markUsed = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markUsed.url(args, options),
    method: 'post',
})

markUsed.definition = {
    methods: ["post"],
    url: '/api/temp-invoice/{tempId}/mark-used',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::markUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
markUsed.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return markUsed.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::markUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
markUsed.post = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markUsed.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::markUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
    const markUsedForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markUsed.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::markUsed
 * @see app/Http/Controllers/Api/TempInvoiceController.php:143
 * @route '/api/temp-invoice/{tempId}/mark-used'
 */
        markUsedForm.post = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markUsed.url(args, options),
            method: 'post',
        })
    
    markUsed.form = markUsedForm
/**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanup
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
export const cleanup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanup.url(options),
    method: 'post',
})

cleanup.definition = {
    methods: ["post"],
    url: '/api/temp-invoice/cleanup-expired',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanup
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
cleanup.url = (options?: RouteQueryOptions) => {
    return cleanup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanup
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
cleanup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanup.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanup
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
    const cleanupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cleanup.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TempInvoiceController::cleanup
 * @see app/Http/Controllers/Api/TempInvoiceController.php:251
 * @route '/api/temp-invoice/cleanup-expired'
 */
        cleanupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cleanup.url(options),
            method: 'post',
        })
    
    cleanup.form = cleanupForm
const tempInvoice = {
    get,
create,
markUsed,
cleanup,
}

export default tempInvoice