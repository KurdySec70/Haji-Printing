import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import products from './products'
import customers from './customers'
/**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
export const pos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pos.url(options),
    method: 'get',
})

pos.definition = {
    methods: ["get","head"],
    url: '/cashier/pos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
pos.url = (options?: RouteQueryOptions) => {
    return pos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
pos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
pos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
    const posForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
        posForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PointOfSaleController::pos
 * @see app/Http/Controllers/PointOfSaleController.php:26
 * @route '/cashier/pos'
 */
        posForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pos.form = posForm
/**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/cashier/profile',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
 * @see routes/cashier.php:19
 * @route '/cashier/profile'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
const cashier = {
    pos,
products,
customers,
profile,
}

export default cashier