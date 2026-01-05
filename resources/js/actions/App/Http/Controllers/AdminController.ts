import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
export const getBusinessSettings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBusinessSettings.url(options),
    method: 'get',
})

getBusinessSettings.definition = {
    methods: ["get","head"],
    url: '/api/business-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
getBusinessSettings.url = (options?: RouteQueryOptions) => {
    return getBusinessSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
getBusinessSettings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBusinessSettings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
getBusinessSettings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getBusinessSettings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
    const getBusinessSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getBusinessSettings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
        getBusinessSettingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getBusinessSettings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::getBusinessSettings
 * @see app/Http/Controllers/AdminController.php:161
 * @route '/api/business-settings'
 */
        getBusinessSettingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getBusinessSettings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getBusinessSettings.form = getBusinessSettingsForm
/**
* @see \App\Http\Controllers\AdminController::updateBusinessSettings
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
export const updateBusinessSettings = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateBusinessSettings.url(options),
    method: 'post',
})

updateBusinessSettings.definition = {
    methods: ["post"],
    url: '/api/business-settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateBusinessSettings
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
updateBusinessSettings.url = (options?: RouteQueryOptions) => {
    return updateBusinessSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateBusinessSettings
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
updateBusinessSettings.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateBusinessSettings.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateBusinessSettings
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
    const updateBusinessSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateBusinessSettings.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateBusinessSettings
 * @see app/Http/Controllers/AdminController.php:129
 * @route '/api/business-settings'
 */
        updateBusinessSettingsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateBusinessSettings.url(options),
            method: 'post',
        })
    
    updateBusinessSettings.form = updateBusinessSettingsForm
/**
* @see \App\Http\Controllers\AdminController::createBackup
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
export const createBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBackup.url(options),
    method: 'post',
})

createBackup.definition = {
    methods: ["post"],
    url: '/api/backup/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::createBackup
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
createBackup.url = (options?: RouteQueryOptions) => {
    return createBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::createBackup
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
createBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBackup.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::createBackup
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
    const createBackupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createBackup.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::createBackup
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/api/backup/create'
 */
        createBackupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createBackup.url(options),
            method: 'post',
        })
    
    createBackup.form = createBackupForm
/**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
export const downloadBackup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(options),
    method: 'get',
})

downloadBackup.definition = {
    methods: ["get","head"],
    url: '/api/backup/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
downloadBackup.url = (options?: RouteQueryOptions) => {
    return downloadBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
downloadBackup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
downloadBackup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBackup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
    const downloadBackupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadBackup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
        downloadBackupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadBackup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::downloadBackup
 * @see app/Http/Controllers/AdminController.php:256
 * @route '/api/backup/download'
 */
        downloadBackupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadBackup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadBackup.form = downloadBackupForm
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:19
 * @route '/admin/dashboard'
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
const AdminController = { getBusinessSettings, updateBusinessSettings, createBackup, downloadBackup, dashboard }

export default AdminController