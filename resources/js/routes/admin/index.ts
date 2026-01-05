import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
import products from './products'
import customers from './customers'
import transactions from './transactions'
import posts from './posts'
import settings from './settings'
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
export const pointOfSale = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pointOfSale.url(options),
    method: 'get',
})

pointOfSale.definition = {
    methods: ["get","head"],
    url: '/admin/point-of-sale',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
pointOfSale.url = (options?: RouteQueryOptions) => {
    return pointOfSale.definition.url + queryParams(options)
}

/**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
pointOfSale.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pointOfSale.url(options),
    method: 'get',
})
/**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
pointOfSale.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pointOfSale.url(options),
    method: 'head',
})

    /**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
    const pointOfSaleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pointOfSale.url(options),
        method: 'get',
    })

            /**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
        pointOfSaleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pointOfSale.url(options),
            method: 'get',
        })
            /**
 * @see routes/admin.php:27
 * @route '/admin/point-of-sale'
 */
        pointOfSaleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pointOfSale.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pointOfSale.form = pointOfSaleForm
const admin = {
    dashboard,
users,
pointOfSale,
products,
customers,
transactions,
posts,
settings,
}

export default admin