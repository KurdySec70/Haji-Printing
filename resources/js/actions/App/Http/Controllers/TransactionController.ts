import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/api/transactions'
 */
const store9fa68b3ceb04d1df189c74d7fe68cd33 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9fa68b3ceb04d1df189c74d7fe68cd33.url(options),
    method: 'post',
})

store9fa68b3ceb04d1df189c74d7fe68cd33.definition = {
    methods: ["post"],
    url: '/api/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/api/transactions'
 */
store9fa68b3ceb04d1df189c74d7fe68cd33.url = (options?: RouteQueryOptions) => {
    return store9fa68b3ceb04d1df189c74d7fe68cd33.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/api/transactions'
 */
store9fa68b3ceb04d1df189c74d7fe68cd33.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9fa68b3ceb04d1df189c74d7fe68cd33.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/api/transactions'
 */
    const store9fa68b3ceb04d1df189c74d7fe68cd33Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store9fa68b3ceb04d1df189c74d7fe68cd33.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/api/transactions'
 */
        store9fa68b3ceb04d1df189c74d7fe68cd33Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store9fa68b3ceb04d1df189c74d7fe68cd33.url(options),
            method: 'post',
        })
    
    store9fa68b3ceb04d1df189c74d7fe68cd33.form = store9fa68b3ceb04d1df189c74d7fe68cd33Form
    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/admin/transactions'
 */
const storef0de97d5edc04a9e2864aa5d0136f8c3 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storef0de97d5edc04a9e2864aa5d0136f8c3.url(options),
    method: 'post',
})

storef0de97d5edc04a9e2864aa5d0136f8c3.definition = {
    methods: ["post"],
    url: '/admin/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/admin/transactions'
 */
storef0de97d5edc04a9e2864aa5d0136f8c3.url = (options?: RouteQueryOptions) => {
    return storef0de97d5edc04a9e2864aa5d0136f8c3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/admin/transactions'
 */
storef0de97d5edc04a9e2864aa5d0136f8c3.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storef0de97d5edc04a9e2864aa5d0136f8c3.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/admin/transactions'
 */
    const storef0de97d5edc04a9e2864aa5d0136f8c3Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storef0de97d5edc04a9e2864aa5d0136f8c3.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/admin/transactions'
 */
        storef0de97d5edc04a9e2864aa5d0136f8c3Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storef0de97d5edc04a9e2864aa5d0136f8c3.url(options),
            method: 'post',
        })
    
    storef0de97d5edc04a9e2864aa5d0136f8c3.form = storef0de97d5edc04a9e2864aa5d0136f8c3Form
    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/cashier/api/transactions'
 */
const store69eb590ae9090d080e1c37c9871a097d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store69eb590ae9090d080e1c37c9871a097d.url(options),
    method: 'post',
})

store69eb590ae9090d080e1c37c9871a097d.definition = {
    methods: ["post"],
    url: '/cashier/api/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/cashier/api/transactions'
 */
store69eb590ae9090d080e1c37c9871a097d.url = (options?: RouteQueryOptions) => {
    return store69eb590ae9090d080e1c37c9871a097d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/cashier/api/transactions'
 */
store69eb590ae9090d080e1c37c9871a097d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store69eb590ae9090d080e1c37c9871a097d.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/cashier/api/transactions'
 */
    const store69eb590ae9090d080e1c37c9871a097dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store69eb590ae9090d080e1c37c9871a097d.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:100
 * @route '/cashier/api/transactions'
 */
        store69eb590ae9090d080e1c37c9871a097dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store69eb590ae9090d080e1c37c9871a097d.url(options),
            method: 'post',
        })
    
    store69eb590ae9090d080e1c37c9871a097d.form = store69eb590ae9090d080e1c37c9871a097dForm

export const store = {
    '/api/transactions': store9fa68b3ceb04d1df189c74d7fe68cd33,
    '/admin/transactions': storef0de97d5edc04a9e2864aa5d0136f8c3,
    '/cashier/api/transactions': store69eb590ae9090d080e1c37c9871a097d,
}

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
const showced43d88aacbce7eeb29263904881ea5 = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'get',
})

showced43d88aacbce7eeb29263904881ea5.definition = {
    methods: ["get","head"],
    url: '/api/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
showced43d88aacbce7eeb29263904881ea5.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return showced43d88aacbce7eeb29263904881ea5.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
showced43d88aacbce7eeb29263904881ea5.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
showced43d88aacbce7eeb29263904881ea5.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
    const showced43d88aacbce7eeb29263904881ea5Form = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showced43d88aacbce7eeb29263904881ea5.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
        showced43d88aacbce7eeb29263904881ea5Form.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showced43d88aacbce7eeb29263904881ea5.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/api/transactions/{transaction}'
 */
        showced43d88aacbce7eeb29263904881ea5Form.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showced43d88aacbce7eeb29263904881ea5.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showced43d88aacbce7eeb29263904881ea5.form = showced43d88aacbce7eeb29263904881ea5Form
    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
const show18aaf9312188993ead8e87eca5700250 = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'get',
})

show18aaf9312188993ead8e87eca5700250.definition = {
    methods: ["get","head"],
    url: '/admin/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
show18aaf9312188993ead8e87eca5700250.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return show18aaf9312188993ead8e87eca5700250.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
show18aaf9312188993ead8e87eca5700250.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
show18aaf9312188993ead8e87eca5700250.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
    const show18aaf9312188993ead8e87eca5700250Form = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show18aaf9312188993ead8e87eca5700250.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
        show18aaf9312188993ead8e87eca5700250Form.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show18aaf9312188993ead8e87eca5700250.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/admin/transactions/{transaction}'
 */
        show18aaf9312188993ead8e87eca5700250Form.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show18aaf9312188993ead8e87eca5700250.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show18aaf9312188993ead8e87eca5700250.form = show18aaf9312188993ead8e87eca5700250Form
    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
const showdd2af86f4dc00714bb0a7ba907328daf = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showdd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'get',
})

showdd2af86f4dc00714bb0a7ba907328daf.definition = {
    methods: ["get","head"],
    url: '/cashier/api/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
showdd2af86f4dc00714bb0a7ba907328daf.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return showdd2af86f4dc00714bb0a7ba907328daf.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
showdd2af86f4dc00714bb0a7ba907328daf.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showdd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
showdd2af86f4dc00714bb0a7ba907328daf.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showdd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
    const showdd2af86f4dc00714bb0a7ba907328dafForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showdd2af86f4dc00714bb0a7ba907328daf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
        showdd2af86f4dc00714bb0a7ba907328dafForm.get = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showdd2af86f4dc00714bb0a7ba907328daf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::show
 * @see app/Http/Controllers/TransactionController.php:164
 * @route '/cashier/api/transactions/{transaction}'
 */
        showdd2af86f4dc00714bb0a7ba907328dafForm.head = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showdd2af86f4dc00714bb0a7ba907328daf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showdd2af86f4dc00714bb0a7ba907328daf.form = showdd2af86f4dc00714bb0a7ba907328dafForm

export const show = {
    '/api/transactions/{transaction}': showced43d88aacbce7eeb29263904881ea5,
    '/admin/transactions/{transaction}': show18aaf9312188993ead8e87eca5700250,
    '/cashier/api/transactions/{transaction}': showdd2af86f4dc00714bb0a7ba907328daf,
}

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/api/transactions/{transaction}'
 */
const updateced43d88aacbce7eeb29263904881ea5 = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'put',
})

updateced43d88aacbce7eeb29263904881ea5.definition = {
    methods: ["put"],
    url: '/api/transactions/{transaction}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/api/transactions/{transaction}'
 */
updateced43d88aacbce7eeb29263904881ea5.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return updateced43d88aacbce7eeb29263904881ea5.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/api/transactions/{transaction}'
 */
updateced43d88aacbce7eeb29263904881ea5.put = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/api/transactions/{transaction}'
 */
    const updateced43d88aacbce7eeb29263904881ea5Form = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateced43d88aacbce7eeb29263904881ea5.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/api/transactions/{transaction}'
 */
        updateced43d88aacbce7eeb29263904881ea5Form.put = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateced43d88aacbce7eeb29263904881ea5.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateced43d88aacbce7eeb29263904881ea5.form = updateced43d88aacbce7eeb29263904881ea5Form
    /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
const update18aaf9312188993ead8e87eca5700250 = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'put',
})

update18aaf9312188993ead8e87eca5700250.definition = {
    methods: ["put","patch"],
    url: '/admin/transactions/{transaction}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
update18aaf9312188993ead8e87eca5700250.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return update18aaf9312188993ead8e87eca5700250.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
update18aaf9312188993ead8e87eca5700250.put = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
update18aaf9312188993ead8e87eca5700250.patch = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
    const update18aaf9312188993ead8e87eca5700250Form = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update18aaf9312188993ead8e87eca5700250.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
        update18aaf9312188993ead8e87eca5700250Form.put = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update18aaf9312188993ead8e87eca5700250.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/admin/transactions/{transaction}'
 */
        update18aaf9312188993ead8e87eca5700250Form.patch = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update18aaf9312188993ead8e87eca5700250.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update18aaf9312188993ead8e87eca5700250.form = update18aaf9312188993ead8e87eca5700250Form
    /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/cashier/api/transactions/{transaction}'
 */
const updatedd2af86f4dc00714bb0a7ba907328daf = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatedd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'put',
})

updatedd2af86f4dc00714bb0a7ba907328daf.definition = {
    methods: ["put"],
    url: '/cashier/api/transactions/{transaction}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/cashier/api/transactions/{transaction}'
 */
updatedd2af86f4dc00714bb0a7ba907328daf.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return updatedd2af86f4dc00714bb0a7ba907328daf.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/cashier/api/transactions/{transaction}'
 */
updatedd2af86f4dc00714bb0a7ba907328daf.put = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatedd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/cashier/api/transactions/{transaction}'
 */
    const updatedd2af86f4dc00714bb0a7ba907328dafForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatedd2af86f4dc00714bb0a7ba907328daf.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:177
 * @route '/cashier/api/transactions/{transaction}'
 */
        updatedd2af86f4dc00714bb0a7ba907328dafForm.put = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatedd2af86f4dc00714bb0a7ba907328daf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatedd2af86f4dc00714bb0a7ba907328daf.form = updatedd2af86f4dc00714bb0a7ba907328dafForm

export const update = {
    '/api/transactions/{transaction}': updateced43d88aacbce7eeb29263904881ea5,
    '/admin/transactions/{transaction}': update18aaf9312188993ead8e87eca5700250,
    '/cashier/api/transactions/{transaction}': updatedd2af86f4dc00714bb0a7ba907328daf,
}

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/api/transactions/{transaction}'
 */
const destroyced43d88aacbce7eeb29263904881ea5 = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'delete',
})

destroyced43d88aacbce7eeb29263904881ea5.definition = {
    methods: ["delete"],
    url: '/api/transactions/{transaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/api/transactions/{transaction}'
 */
destroyced43d88aacbce7eeb29263904881ea5.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return destroyced43d88aacbce7eeb29263904881ea5.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/api/transactions/{transaction}'
 */
destroyced43d88aacbce7eeb29263904881ea5.delete = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyced43d88aacbce7eeb29263904881ea5.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/api/transactions/{transaction}'
 */
    const destroyced43d88aacbce7eeb29263904881ea5Form = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyced43d88aacbce7eeb29263904881ea5.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/api/transactions/{transaction}'
 */
        destroyced43d88aacbce7eeb29263904881ea5Form.delete = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyced43d88aacbce7eeb29263904881ea5.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyced43d88aacbce7eeb29263904881ea5.form = destroyced43d88aacbce7eeb29263904881ea5Form
    /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/admin/transactions/{transaction}'
 */
const destroy18aaf9312188993ead8e87eca5700250 = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'delete',
})

destroy18aaf9312188993ead8e87eca5700250.definition = {
    methods: ["delete"],
    url: '/admin/transactions/{transaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/admin/transactions/{transaction}'
 */
destroy18aaf9312188993ead8e87eca5700250.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return destroy18aaf9312188993ead8e87eca5700250.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/admin/transactions/{transaction}'
 */
destroy18aaf9312188993ead8e87eca5700250.delete = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy18aaf9312188993ead8e87eca5700250.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/admin/transactions/{transaction}'
 */
    const destroy18aaf9312188993ead8e87eca5700250Form = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy18aaf9312188993ead8e87eca5700250.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/admin/transactions/{transaction}'
 */
        destroy18aaf9312188993ead8e87eca5700250Form.delete = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy18aaf9312188993ead8e87eca5700250.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy18aaf9312188993ead8e87eca5700250.form = destroy18aaf9312188993ead8e87eca5700250Form
    /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/cashier/api/transactions/{transaction}'
 */
const destroydd2af86f4dc00714bb0a7ba907328daf = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroydd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'delete',
})

destroydd2af86f4dc00714bb0a7ba907328daf.definition = {
    methods: ["delete"],
    url: '/cashier/api/transactions/{transaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/cashier/api/transactions/{transaction}'
 */
destroydd2af86f4dc00714bb0a7ba907328daf.url = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return destroydd2af86f4dc00714bb0a7ba907328daf.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/cashier/api/transactions/{transaction}'
 */
destroydd2af86f4dc00714bb0a7ba907328daf.delete = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroydd2af86f4dc00714bb0a7ba907328daf.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/cashier/api/transactions/{transaction}'
 */
    const destroydd2af86f4dc00714bb0a7ba907328dafForm = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroydd2af86f4dc00714bb0a7ba907328daf.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:224
 * @route '/cashier/api/transactions/{transaction}'
 */
        destroydd2af86f4dc00714bb0a7ba907328dafForm.delete = (args: { transaction: number | { id: number } } | [transaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroydd2af86f4dc00714bb0a7ba907328daf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroydd2af86f4dc00714bb0a7ba907328daf.form = destroydd2af86f4dc00714bb0a7ba907328dafForm

export const destroy = {
    '/api/transactions/{transaction}': destroyced43d88aacbce7eeb29263904881ea5,
    '/admin/transactions/{transaction}': destroy18aaf9312188993ead8e87eca5700250,
    '/cashier/api/transactions/{transaction}': destroydd2af86f4dc00714bb0a7ba907328daf,
}

/**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/transactions-statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
    const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: statistics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
        statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::statistics
 * @see app/Http/Controllers/TransactionController.php:255
 * @route '/api/transactions-statistics'
 */
        statisticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statistics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    statistics.form = statisticsForm
/**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/transactions-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::exportMethod
 * @see app/Http/Controllers/TransactionController.php:287
 * @route '/api/transactions-export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm





/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:20
 * @route '/admin/transactions'
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
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/transactions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/create'
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
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
export const edit = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/transactions/{transaction}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
edit.url = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: args.transaction,
                }

    return edit.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
edit.get = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
edit.head = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
    const editForm = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
        editForm.get = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::edit
 * @see app/Http/Controllers/TransactionController.php:0
 * @route '/admin/transactions/{transaction}/edit'
 */
        editForm.head = (args: { transaction: string | number } | [transaction: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const TransactionController = { store, show, update, destroy, statistics, exportMethod, index, create, edit, export: exportMethod }

export default TransactionController