import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
export const get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(options),
    method: 'get',
})

get.definition = {
    methods: ["get","head"],
    url: '/api/business-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
get.url = (options?: RouteQueryOptions) => {
    return get.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
get.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
get.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: get.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
    const getForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: get.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
        getForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::get
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
        getForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    get.form = getForm
/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/business-settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const businessSettings = {
    get,
update,
}

export default businessSettings