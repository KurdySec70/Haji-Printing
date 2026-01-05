import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, RefreshCw, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { router, usePage } from '@inertiajs/react';
import { transformRoute } from '@/utils/routeHelper';

export function BackupSettings() {
    const { t } = useTranslation();
    const [isBackingUp, setIsBackingUp] = useState(false);
    const { props } = usePage();

    // Handle flash messages from backend
    useEffect(() => {
        if ((props.flash as { success?: string })?.success) {
            toast({
                title: t('settings.backup.createSuccess'),
                description: (props.flash as { success: string }).success,
                duration: 4000,
            });
        }

        if (props.errors?.backup) {
            toast({
                title: t('settings.backup.failed'),
                description: props.errors.backup,
                variant: "destructive",
                duration: 5000,
            });
        }
    }, [props.flash, props.errors, t]);

    const handleManualBackup = async () => {
        setIsBackingUp(true);

        router.post('/api/backup/create', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsBackingUp(false);
            }
        });
    };

    const handleDownloadBackup = () => {
        // Simple download trigger
        window.open(transformRoute('/api/backup/download'), '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Backup Management Section */}
            <Card className="w-full bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.backup.title')}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {t('settings.backup.description')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Backup Status */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                                    {t('settings.backup.status')}
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {t('settings.backup.statusReady')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Backup Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{t('settings.backup.lastBackup')}</span>
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {t('settings.backup.manualBackupOnly')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {t('settings.backup.createFirstBackup')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('settings.backup.backupType')}
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {t('settings.backup.fullDatabaseBackup')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {t('settings.backup.includesAllTables')}
                            </div>
                        </div>
                    </div>

                    {/* Manual Backup Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            onClick={handleManualBackup}
                            disabled={isBackingUp}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isBackingUp ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>{t('settings.backup.creatingBackup')}</span>
                                </>
                            ) : (
                                <>
                                    <Database className="w-4 h-4" />
                                    <span>{t('settings.backup.createBackupNow')}</span>
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleDownloadBackup}
                            variant="outline"
                            className="flex items-center space-x-2 border-gray-300 dark:border-[#431407] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#431407]/50 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>{t('settings.backup.downloadLatestBackup')}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Backup Information */}
            <Card className="w-full bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.backup.backupInformation')}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {t('settings.backup.backupInfoDescription')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('settings.backup.whatGetsBackedUp')}</h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                            <li>{t('settings.backup.businessSettings')}</li>
                            <li>{t('settings.backup.userAccounts')}</li>
                            <li>{t('settings.backup.productCatalog')}</li>
                            <li>{t('settings.backup.customerInfo')}</li>
                            <li>{t('settings.backup.transactionHistory')}</li>
                            <li>{t('settings.backup.systemPosts')}</li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">{t('settings.backup.backupRecommendations')}</h4>
                        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                            <li>{t('settings.backup.backupBeforeUpdates')}</li>
                            <li>{t('settings.backup.downloadAndStore')}</li>
                            <li>{t('settings.backup.testRestoreProcedures')}</li>
                            <li>{t('settings.backup.keepMultipleCopies')}</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
