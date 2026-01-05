import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/api/backup/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
        createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/backup/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
    const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
        downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::download
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
        downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const backup = {
    create,
download,
}

export default backup