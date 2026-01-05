import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
const search142a04e71fd46f9e3ea189c313fd079f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search142a04e71fd46f9e3ea189c313fd079f.url(options),
    method: 'get',
})

search142a04e71fd46f9e3ea189c313fd079f.definition = {
    methods: ["get","head"],
    url: '/admin/customers/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
search142a04e71fd46f9e3ea189c313fd079f.url = (options?: RouteQueryOptions) => {
    return search142a04e71fd46f9e3ea189c313fd079f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
search142a04e71fd46f9e3ea189c313fd079f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search142a04e71fd46f9e3ea189c313fd079f.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
search142a04e71fd46f9e3ea189c313fd079f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search142a04e71fd46f9e3ea189c313fd079f.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
    const search142a04e71fd46f9e3ea189c313fd079fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search142a04e71fd46f9e3ea189c313fd079f.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
        search142a04e71fd46f9e3ea189c313fd079fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search142a04e71fd46f9e3ea189c313fd079f.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/admin/customers/search'
 */
        search142a04e71fd46f9e3ea189c313fd079fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search142a04e71fd46f9e3ea189c313fd079f.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search142a04e71fd46f9e3ea189c313fd079f.form = search142a04e71fd46f9e3ea189c313fd079fForm
    /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
const searchcc400810a367d88b8ad2406c6bffae2a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchcc400810a367d88b8ad2406c6bffae2a.url(options),
    method: 'get',
})

searchcc400810a367d88b8ad2406c6bffae2a.definition = {
    methods: ["get","head"],
    url: '/cashier/customers/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
searchcc400810a367d88b8ad2406c6bffae2a.url = (options?: RouteQueryOptions) => {
    return searchcc400810a367d88b8ad2406c6bffae2a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
searchcc400810a367d88b8ad2406c6bffae2a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchcc400810a367d88b8ad2406c6bffae2a.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
searchcc400810a367d88b8ad2406c6bffae2a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchcc400810a367d88b8ad2406c6bffae2a.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
    const searchcc400810a367d88b8ad2406c6bffae2aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchcc400810a367d88b8ad2406c6bffae2a.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
        searchcc400810a367d88b8ad2406c6bffae2aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchcc400810a367d88b8ad2406c6bffae2a.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::search
 * @see app/Http/Controllers/CustomerController.php:30
 * @route '/cashier/customers/search'
 */
        searchcc400810a367d88b8ad2406c6bffae2aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchcc400810a367d88b8ad2406c6bffae2a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchcc400810a367d88b8ad2406c6bffae2a.form = searchcc400810a367d88b8ad2406c6bffae2aForm

export const search = {
    '/admin/customers/search': search142a04e71fd46f9e3ea189c313fd079f,
    '/cashier/customers/search': searchcc400810a367d88b8ad2406c6bffae2a,
}

/**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::index
 * @see app/Http/Controllers/CustomerController.php:15
 * @route '/admin/customers'
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
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/customers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::create
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/create'
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
* @see \App\Http\Controllers\CustomerController::store
 * @see app/Http/Controllers/CustomerController.php:59
 * @route '/admin/customers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/customers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerController::store
 * @see app/Http/Controllers/CustomerController.php:59
 * @route '/admin/customers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::store
 * @see app/Http/Controllers/CustomerController.php:59
 * @route '/admin/customers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CustomerController::store
 * @see app/Http/Controllers/CustomerController.php:59
 * @route '/admin/customers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CustomerController::store
 * @see app/Http/Controllers/CustomerController.php:59
 * @route '/admin/customers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
export const show = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
show.url = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: args.customer,
                }

    return show.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
show.get = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
show.head = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
    const showForm = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
        showForm.get = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::show
 * @see app/Http/Controllers/CustomerController.php:90
 * @route '/admin/customers/{customer}'
 */
        showForm.head = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
export const edit = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/customers/{customer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
edit.url = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: args.customer,
                }

    return edit.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
edit.get = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
edit.head = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
    const editForm = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
        editForm.get = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::edit
 * @see app/Http/Controllers/CustomerController.php:0
 * @route '/admin/customers/{customer}/edit'
 */
        editForm.head = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
export const update = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
update.url = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: args.customer,
                }

    return update.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
update.put = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
update.patch = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
    const updateForm = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
        updateForm.put = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CustomerController::update
 * @see app/Http/Controllers/CustomerController.php:103
 * @route '/admin/customers/{customer}'
 */
        updateForm.patch = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CustomerController::destroy
 * @see app/Http/Controllers/CustomerController.php:138
 * @route '/admin/customers/{customer}'
 */
export const destroy = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CustomerController::destroy
 * @see app/Http/Controllers/CustomerController.php:138
 * @route '/admin/customers/{customer}'
 */
destroy.url = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: args.customer,
                }

    return destroy.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::destroy
 * @see app/Http/Controllers/CustomerController.php:138
 * @route '/admin/customers/{customer}'
 */
destroy.delete = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CustomerController::destroy
 * @see app/Http/Controllers/CustomerController.php:138
 * @route '/admin/customers/{customer}'
 */
    const destroyForm = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CustomerController::destroy
 * @see app/Http/Controllers/CustomerController.php:138
 * @route '/admin/customers/{customer}'
 */
        destroyForm.delete = (args: { customer: string | number } | [customer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/customer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::dashboard
 * @see app/Http/Controllers/CustomerController.php:148
 * @route '/customer/dashboard'
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
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
export const getTransactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTransactions.url(options),
    method: 'get',
})

getTransactions.definition = {
    methods: ["get","head"],
    url: '/customer/api/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
getTransactions.url = (options?: RouteQueryOptions) => {
    return getTransactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
getTransactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTransactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
getTransactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTransactions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
    const getTransactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTransactions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
        getTransactionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTransactions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CustomerController::getTransactions
 * @see app/Http/Controllers/CustomerController.php:199
 * @route '/customer/api/transactions'
 */
        getTransactionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTransactions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTransactions.form = getTransactionsForm
const CustomerController = { search, index, create, store, show, edit, update, destroy, dashboard, getTransactions }

export default CustomerController