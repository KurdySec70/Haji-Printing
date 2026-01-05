import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
export const sendWhatsappMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappMessage.url(options),
    method: 'post',
})

sendWhatsappMessage.definition = {
    methods: ["post"],
    url: '/api/send-whatsapp-message',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
sendWhatsappMessage.url = (options?: RouteQueryOptions) => {
    return sendWhatsappMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
sendWhatsappMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappMessage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
    const sendWhatsappMessageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendWhatsappMessage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessage
 * @see app/Http/Controllers/CommunicationController.php:76
 * @route '/api/send-whatsapp-message'
 */
        sendWhatsappMessageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendWhatsappMessage.url(options),
            method: 'post',
        })
    
    sendWhatsappMessage.form = sendWhatsappMessageForm
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
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
export const sendWhatsappMessageWithInvoice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappMessageWithInvoice.url(options),
    method: 'post',
})

sendWhatsappMessageWithInvoice.definition = {
    methods: ["post"],
    url: '/api/send-whatsapp-message-with-invoice',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
sendWhatsappMessageWithInvoice.url = (options?: RouteQueryOptions) => {
    return sendWhatsappMessageWithInvoice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
sendWhatsappMessageWithInvoice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappMessageWithInvoice.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
    const sendWhatsappMessageWithInvoiceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendWhatsappMessageWithInvoice.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CommunicationController::sendWhatsappMessageWithInvoice
 * @see app/Http/Controllers/CommunicationController.php:220
 * @route '/api/send-whatsapp-message-with-invoice'
 */
        sendWhatsappMessageWithInvoiceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendWhatsappMessageWithInvoice.url(options),
            method: 'post',
        })
    
    sendWhatsappMessageWithInvoice.form = sendWhatsappMessageWithInvoiceForm
const communication = {
    generatePdfDownload,
sendWhatsappMessage,
sendOrderEmailWithInvoice,
sendWhatsappMessageWithInvoice,
}

export default communication