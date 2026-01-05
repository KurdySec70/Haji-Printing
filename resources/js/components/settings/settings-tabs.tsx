import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BusinessInformation } from './business-information';
import { BackupSettings } from './backup-settings';
import { InvoiceTemplateSettings } from './invoice-template-settings';
import { SettingsTabList } from './settings-tab-list';
// import { useTranslation } from 'react-i18next';

export function SettingsTabs() {
    // const { t } = useTranslation();

    return (
        <Tabs defaultValue="business" className="w-full">
            <SettingsTabList />

            {/* Business Information Tab */}
            <TabsContent value="business" className="mt-0">
                <BusinessInformation />
            </TabsContent>

            {/* Backup Settings Tab */}
            <TabsContent value="backup" className="mt-0">
                <BackupSettings />
            </TabsContent>

            {/* Invoice Template Tab */}
            <TabsContent value="invoice-template" className="mt-0">
                <InvoiceTemplateSettings />
            </TabsContent>

        </Tabs>
    );
}
