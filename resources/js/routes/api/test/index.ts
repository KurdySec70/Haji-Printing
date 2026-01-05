import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
export const pdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/api/test-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
pdf.url = (options?: RouteQueryOptions) => {
    return pdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
pdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
pdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
    const pdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
        pdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CommunicationController::pdf
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
        pdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
/**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
export const emailPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: emailPdf.url(options),
    method: 'get',
})

emailPdf.definition = {
    methods: ["get","head"],
    url: '/api/test-email-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
emailPdf.url = (options?: RouteQueryOptions) => {
    return emailPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
emailPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: emailPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
emailPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: emailPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
    const emailPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: emailPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
        emailPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: emailPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CommunicationController::emailPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
        emailPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: emailPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    emailPdf.form = emailPdfForm
const test = {
    pdf,
emailPdf,
}

export default test