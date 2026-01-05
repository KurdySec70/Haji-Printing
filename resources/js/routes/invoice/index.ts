import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
export const temp = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: temp.url(args, options),
    method: 'get',
})

temp.definition = {
    methods: ["get","head"],
    url: '/invoice-temp/{tempId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
temp.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return temp.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
temp.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: temp.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
temp.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: temp.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
    const tempForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: temp.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
        tempForm.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: temp.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::temp
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
        tempForm.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: temp.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    temp.form = tempForm
const invoice = {
    temp,
}

export default invoice