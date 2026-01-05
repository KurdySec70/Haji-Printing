import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

interface BusinessData {
    company_name: string;
    company_slogan: string;
    primary_phone: string;
    secondary_phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
}

export function BusinessInformation() {
    const { t } = useTranslation();

    // Static business data for Haji Printing
    const businessData: BusinessData = {
        company_name: 'Haji Printing',
        company_slogan: 'Professional Printing Services',
        primary_phone: '+964 7514463959',
        secondary_phone: '+964 7514473959',
        email: 'info@hajiprinting.com',
        address: 'Erbil, Kurdistan Region, Iraq',
        city: 'Erbil',
        country: 'Iraq'
    };

    return (
        <div className="space-y-6">
            {/* Business Details Section */}
            <Card className="w-full bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#F58E18] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.business.title')}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {t('settings.business.description')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Company Name and Slogan */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('settings.business.companyName')}
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {businessData.company_name || t('settings.business.notSpecified')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('settings.business.companySlogan')}
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {businessData.company_slogan || t('settings.business.notSpecified')}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card className="w-full bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.business.contactInformation')}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {t('settings.business.contactDescription')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Phone Numbers and Email */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{t('settings.business.primaryPhone')}</span>
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {businessData.primary_phone || t('settings.business.notSpecified')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{t('settings.business.secondaryPhone')}</span>
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {businessData.secondary_phone || t('settings.business.notSpecified')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{t('settings.business.emailAddress')}</span>
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {businessData.email || t('settings.business.notSpecified')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Address Information Section */}
            <Card className="w-full bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.business.locationInformation')}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {t('settings.business.locationDescription')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Address */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('settings.business.businessAddress')}
                        </div>
                        <div className="text-lg text-gray-900 dark:text-white leading-relaxed">
                            {businessData.address || t('settings.business.noAddressProvided')}
                        </div>
                    </div>

                    {/* City and Country */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('settings.business.city')}
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {businessData.city || t('settings.business.notSpecified')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('settings.business.country')}
                            </div>
                            <div className="text-lg text-gray-900 dark:text-white">
                                {businessData.country || t('settings.business.notSpecified')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
