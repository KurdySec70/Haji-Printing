import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CommunicationController::sendQuoteRequest
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
export const sendQuoteRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendQuoteRequest.url(options),
    method: 'post',
})

sendQuoteRequest.definition = {
    methods: ["post"],
    url: '/api/quote-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::sendQuoteRequest
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
sendQuoteRequest.url = (options?: RouteQueryOptions) => {
    return sendQuoteRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::sendQuoteRequest
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
sendQuoteRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendQuoteRequest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::sendQuoteRequest
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
    const sendQuoteRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendQuoteRequest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::sendQuoteRequest
 * @see app/Http/Controllers/CommunicationController.php:310
 * @route '/api/quote-request'
 */
        sendQuoteRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendQuoteRequest.url(options),
            method: 'post',
        })
    
    sendQuoteRequest.form = sendQuoteRequestForm
/**
* @see \App\Http\Controllers\CommunicationController::generatePdfDownload
 * @see app/Http/Controllers/CommunicationController.php:385
 * @route '/api/generate-pdf-download'
 */
export const generatePdfDownload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generatePdfDownload.url(options),
    method: 'post',
})

generatePdfDownload.definition = {
    methods: ["post"],
    url: '/api/generate-pdf-download',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::generatePdfDownload
 * @see app/Http/Controllers/CommunicationController.php:385
 * @route '/api/generate-pdf-download'
 */
generatePdfDownload.url = (options?: RouteQueryOptions) => {
    return generatePdfDownload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::generatePdfDownload
 * @see app/Http/Controllers/CommunicationController.php:385
 * @route '/api/generate-pdf-download'
 */
generatePdfDownload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generatePdfDownload.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::generatePdfDownload
 * @see app/Http/Controllers/CommunicationController.php:385
 * @route '/api/generate-pdf-download'
 */
    const generatePdfDownloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generatePdfDownload.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::generatePdfDownload
 * @see app/Http/Controllers/CommunicationController.php:385
 * @route '/api/generate-pdf-download'
 */
        generatePdfDownloadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generatePdfDownload.url(options),
            method: 'post',
        })
    
    generatePdfDownload.form = generatePdfDownloadForm
/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
export const sendWhatsAppMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsAppMessage.url(options),
    method: 'post',
})

sendWhatsAppMessage.definition = {
    methods: ["post"],
    url: '/api/send-whatsapp-message',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
sendWhatsAppMessage.url = (options?: RouteQueryOptions) => {
    return sendWhatsAppMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
sendWhatsAppMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsAppMessage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
    const sendWhatsAppMessageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendWhatsAppMessage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
        sendWhatsAppMessageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendWhatsAppMessage.url(options),
            method: 'post',
        })
    
    sendWhatsAppMessage.form = sendWhatsAppMessageForm
/**
* @see \App\Http\Controllers\CommunicationController::sendOrderEmailWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:142
 * @route '/api/send-order-email-with-invoice'
 */
export const sendOrderEmailWithInvoice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOrderEmailWithInvoice.url(options),
    method: 'post',
})

sendOrderEmailWithInvoice.definition = {
    methods: ["post"],
    url: '/api/send-order-email-with-invoice',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::sendOrderEmailWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:142
 * @route '/api/send-order-email-with-invoice'
 */
sendOrderEmailWithInvoice.url = (options?: RouteQueryOptions) => {
    return sendOrderEmailWithInvoice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::sendOrderEmailWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:142
 * @route '/api/send-order-email-with-invoice'
 */
sendOrderEmailWithInvoice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOrderEmailWithInvoice.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::sendOrderEmailWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:142
 * @route '/api/send-order-email-with-invoice'
 */
    const sendOrderEmailWithInvoiceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendOrderEmailWithInvoice.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::sendOrderEmailWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:142
 * @route '/api/send-order-email-with-invoice'
 */
        sendOrderEmailWithInvoiceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendOrderEmailWithInvoice.url(options),
            method: 'post',
        })
    
    sendOrderEmailWithInvoice.form = sendOrderEmailWithInvoiceForm
/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
export const sendWhatsAppMessageWithInvoice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsAppMessageWithInvoice.url(options),
    method: 'post',
})

sendWhatsAppMessageWithInvoice.definition = {
    methods: ["post"],
    url: '/api/send-whatsapp-message-with-invoice',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
sendWhatsAppMessageWithInvoice.url = (options?: RouteQueryOptions) => {
    return sendWhatsAppMessageWithInvoice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
sendWhatsAppMessageWithInvoice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsAppMessageWithInvoice.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
    const sendWhatsAppMessageWithInvoiceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendWhatsAppMessageWithInvoice.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsAppMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
        sendWhatsAppMessageWithInvoiceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendWhatsAppMessageWithInvoice.url(options),
            method: 'post',
        })
    
    sendWhatsAppMessageWithInvoice.form = sendWhatsAppMessageWithInvoiceForm
/**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
export const testPdfGeneration = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testPdfGeneration.url(options),
    method: 'get',
})

testPdfGeneration.definition = {
    methods: ["get","head"],
    url: '/api/test-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
testPdfGeneration.url = (options?: RouteQueryOptions) => {
    return testPdfGeneration.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
testPdfGeneration.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testPdfGeneration.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
testPdfGeneration.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testPdfGeneration.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
    const testPdfGenerationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: testPdfGeneration.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
        testPdfGenerationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testPdfGeneration.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CommunicationController::testPdfGeneration
 * @see app/Http/Controllers/CommunicationController.php:473
 * @route '/api/test-pdf'
 */
        testPdfGenerationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testPdfGeneration.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    testPdfGeneration.form = testPdfGenerationForm
/**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
export const testEmailWithPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testEmailWithPdf.url(options),
    method: 'get',
})

testEmailWithPdf.definition = {
    methods: ["get","head"],
    url: '/api/test-email-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
testEmailWithPdf.url = (options?: RouteQueryOptions) => {
    return testEmailWithPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
testEmailWithPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: testEmailWithPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
testEmailWithPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: testEmailWithPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
    const testEmailWithPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: testEmailWithPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
        testEmailWithPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testEmailWithPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CommunicationController::testEmailWithPdf
 * @see app/Http/Controllers/CommunicationController.php:527
 * @route '/api/test-email-pdf'
 */
        testEmailWithPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: testEmailWithPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    testEmailWithPdf.form = testEmailWithPdfForm
const CommunicationController = { sendQuoteRequest, generatePdfDownload, sendWhatsAppMessage, sendOrderEmailWithInvoice, sendWhatsAppMessageWithInvoice, testPdfGeneration, testEmailWithPdf }

export default CommunicationController