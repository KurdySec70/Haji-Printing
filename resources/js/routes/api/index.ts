import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import testRoute from './test'
import quote from './quote'
import tempInvoice from './temp-invoice'
import communication from './communication'
import transactions from './transactions'
import businessSettings from './business-settings'
import backup from './backup'
/**
 * @see routes/api.php:22
 * @route '/api/test'
 */
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testRoute.pdf.url(options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/api/test',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/api.php:22
 * @route '/api/test'
 */
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:22
 * @route '/api/test'
 */
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testRoute.pdf.url(options),
    method: 'post',
})

    /**
 * @see routes/api.php:22
 * @route '/api/test'
 */
    const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: test.url(options),
        method: 'post',
    })

            /**
 * @see routes/api.php:22
 * @route '/api/test'
 */
        testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: test.url(options),
            method: 'post',
        })
    
    test.form = testForm
/**
 * @see routes/api.php:134
 * @route '/api/user'
 */
export const user = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/api/user',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:134
 * @route '/api/user'
 */
user.url = (options?: RouteQueryOptions) => {
    return user.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:134
 * @route '/api/user'
 */
user.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:134
 * @route '/api/user'
 */
user.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:134
 * @route '/api/user'
 */
    const userForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: user.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:134
 * @route '/api/user'
 */
        userForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:134
 * @route '/api/user'
 */
        userForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    user.form = userForm
const api = {
    test,
quote,
tempInvoice,
communication,
transactions,
businessSettings,
backup,
user,
}

export default api