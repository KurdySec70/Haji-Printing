import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
export const showTempInvoice = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTempInvoice.url(args, options),
    method: 'get',
})

showTempInvoice.definition = {
    methods: ["get","head"],
    url: '/invoice-temp/{tempId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
showTempInvoice.url = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showTempInvoice.definition.url
            .replace('{tempId}', parsedArgs.tempId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
showTempInvoice.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTempInvoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
showTempInvoice.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showTempInvoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
    const showTempInvoiceForm = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showTempInvoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
        showTempInvoiceForm.get = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showTempInvoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::showTempInvoice
 * @see app/Http/Controllers/InvoiceController.php:14
 * @route '/invoice-temp/{tempId}'
 */
        showTempInvoiceForm.head = (args: { tempId: string | number } | [tempId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showTempInvoice.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showTempInvoice.form = showTempInvoiceForm
const InvoiceController = { showTempInvoice }

export default InvoiceController