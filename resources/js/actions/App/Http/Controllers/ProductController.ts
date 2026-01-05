import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
const search28829a0e25f267aa020f44754535b43c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search28829a0e25f267aa020f44754535b43c.url(options),
    method: 'get',
})

search28829a0e25f267aa020f44754535b43c.definition = {
    methods: ["get","head"],
    url: '/admin/products/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
search28829a0e25f267aa020f44754535b43c.url = (options?: RouteQueryOptions) => {
    return search28829a0e25f267aa020f44754535b43c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
search28829a0e25f267aa020f44754535b43c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search28829a0e25f267aa020f44754535b43c.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
search28829a0e25f267aa020f44754535b43c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search28829a0e25f267aa020f44754535b43c.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
    const search28829a0e25f267aa020f44754535b43cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search28829a0e25f267aa020f44754535b43c.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
        search28829a0e25f267aa020f44754535b43cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search28829a0e25f267aa020f44754535b43c.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/admin/products/search'
 */
        search28829a0e25f267aa020f44754535b43cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search28829a0e25f267aa020f44754535b43c.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search28829a0e25f267aa020f44754535b43c.form = search28829a0e25f267aa020f44754535b43cForm
    /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
const searche07b8c164ebcad1040dcdab995efc8b2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searche07b8c164ebcad1040dcdab995efc8b2.url(options),
    method: 'get',
})

searche07b8c164ebcad1040dcdab995efc8b2.definition = {
    methods: ["get","head"],
    url: '/cashier/products/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
searche07b8c164ebcad1040dcdab995efc8b2.url = (options?: RouteQueryOptions) => {
    return searche07b8c164ebcad1040dcdab995efc8b2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
searche07b8c164ebcad1040dcdab995efc8b2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searche07b8c164ebcad1040dcdab995efc8b2.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
searche07b8c164ebcad1040dcdab995efc8b2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searche07b8c164ebcad1040dcdab995efc8b2.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
    const searche07b8c164ebcad1040dcdab995efc8b2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searche07b8c164ebcad1040dcdab995efc8b2.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
        searche07b8c164ebcad1040dcdab995efc8b2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searche07b8c164ebcad1040dcdab995efc8b2.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductController::search
 * @see app/Http/Controllers/ProductController.php:131
 * @route '/cashier/products/search'
 */
        searche07b8c164ebcad1040dcdab995efc8b2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searche07b8c164ebcad1040dcdab995efc8b2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searche07b8c164ebcad1040dcdab995efc8b2.form = searche07b8c164ebcad1040dcdab995efc8b2Form

export const search = {
    '/admin/products/search': search28829a0e25f267aa020f44754535b43c,
    '/cashier/products/search': searche07b8c164ebcad1040dcdab995efc8b2,
}

/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:15
 * @route '/admin/products'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/products/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductController::create
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ProductController::store
 * @see app/Http/Controllers/ProductController.php:69
 * @route '/admin/products'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductController::store
 * @see app/Http/Controllers/ProductController.php:69
 * @route '/admin/products'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::store
 * @see app/Http/Controllers/ProductController.php:69
 * @route '/admin/products'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductController::store
 * @see app/Http/Controllers/ProductController.php:69
 * @route '/admin/products'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductController::store
 * @see app/Http/Controllers/ProductController.php:69
 * @route '/admin/products'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
export const show = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
show.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return show.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
show.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
show.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
    const showForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
        showForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductController::show
 * @see app/Http/Controllers/ProductController.php:88
 * @route '/admin/products/{product}'
 */
        showForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
export const edit = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
edit.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: args.product,
                }

    return edit.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
edit.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
edit.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
    const editForm = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
        editForm.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductController::edit
 * @see app/Http/Controllers/ProductController.php:0
 * @route '/admin/products/{product}/edit'
 */
        editForm.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
export const update = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
update.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
update.put = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
update.patch = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
    const updateForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
        updateForm.put = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ProductController::update
 * @see app/Http/Controllers/ProductController.php:98
 * @route '/admin/products/{product}'
 */
        updateForm.patch = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProductController::destroy
 * @see app/Http/Controllers/ProductController.php:116
 * @route '/admin/products/{product}'
 */
export const destroy = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductController::destroy
 * @see app/Http/Controllers/ProductController.php:116
 * @route '/admin/products/{product}'
 */
destroy.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::destroy
 * @see app/Http/Controllers/ProductController.php:116
 * @route '/admin/products/{product}'
 */
destroy.delete = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductController::destroy
 * @see app/Http/Controllers/ProductController.php:116
 * @route '/admin/products/{product}'
 */
    const destroyForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductController::destroy
 * @see app/Http/Controllers/ProductController.php:116
 * @route '/admin/products/{product}'
 */
        destroyForm.delete = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProductController = { search, index, create, store, show, edit, update, destroy }

export default ProductController