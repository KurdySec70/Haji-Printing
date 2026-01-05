import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CommunicationController::request
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
export const request = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(options),
    method: 'post',
})

request.definition = {
    methods: ["post"],
    url: '/api/quote-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::request
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
request.url = (options?: RouteQueryOptions) => {
    return request.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::request
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
request.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::request
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
    const requestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: request.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::request
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
        requestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: request.url(options),
            method: 'post',
        })
    
    request.form = requestForm
const quote = {
    request,
}

export default quote