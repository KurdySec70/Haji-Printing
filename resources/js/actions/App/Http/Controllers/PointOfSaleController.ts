import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
export const cashierPos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cashierPos.url(options),
    method: 'get',
})

cashierPos.definition = {
    methods: ["get","head"],
    url: '/cashier/pos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
cashierPos.url = (options?: RouteQueryOptions) => {
    return cashierPos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
cashierPos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cashierPos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
cashierPos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cashierPos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
    const cashierPosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cashierPos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
        cashierPosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cashierPos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PointOfSaleController::cashierPos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
        cashierPosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cashierPos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cashierPos.form = cashierPosForm
const PointOfSaleController = { cashierPos }

export default PointOfSaleController