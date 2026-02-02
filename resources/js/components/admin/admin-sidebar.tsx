import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { logout } from '@/routes';
import admin from '@/routes/admin';
import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Package, Users, UserCheck, ShoppingCart, LogOut, Receipt, FileText, Settings, AlertCircle } from 'lucide-react';
import { useAssetPath } from '@/hooks/useAssetPath';
import { detectBaseUrl, isSubdirectoryDeployment } from '@/utils/routeHelper';
import { Auth } from '@/types';
// import { usePrefetch } from '@/hooks/usePrefetch';

export function AdminSidebar() {
    const page = usePage();
    const { auth } = (page.props as { auth?: Auth }) || {};
    const { t } = useTranslation();
    const { getLogoUrl } = useAssetPath();
    // const { prefetchOnHover, prefetchRoute } = usePrefetch();

    // Helper function to check if route is active
    const isRouteActive = (routeUrl: string) => {
        const currentUrl = page.url;

        // For subdirectory deployment, remove the base path from current URL for comparison
        if (isSubdirectoryDeployment()) {
            const baseUrl = detectBaseUrl();
            const basePath = baseUrl.replace(window.location.origin, '');
            const normalizedCurrentUrl = currentUrl.startsWith(basePath)
                ? currentUrl.substring(basePath.length)
                : currentUrl;
            return normalizedCurrentUrl.startsWith(routeUrl);
        }

        return currentUrl.startsWith(routeUrl);
    };

    const handleLogout = () => {
        router.post(logout.url());
    };

    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 p-0 group-data-[collapsible=icon]:h-12">
                <div className="flex items-center h-16 px-6 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:px-3">
                    <div className="flex items-center space-x-3 group-data-[collapsible=icon]:space-x-0">
                        {/* Logo Icon */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 group-data-[collapsible=icon]:hidden bg-[#F58E18] p-1">
                            <img
                                src={getLogoUrl()}
                                alt="Haji Logo"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        
                        {/* Brand Name - Hidden when collapsed */}
                        <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                            <span className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                                {t('admin.brandName')}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {t('admin.adminPanel')}
                            </span>
                        </div>
                    </div>
                    
                    {/* Small Logo - Only visible when collapsed */}
                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
                        <div className="w-6 h-6 rounded-md overflow-hidden bg-[#F58E18] p-0.5">
                            <img
                                src={getLogoUrl()}
                                alt="Haji Logo"
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-3">
                <SidebarMenu>
                    {/* Dashboard */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.dashboard.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.dashboard()} 
                                prefetch
                            >
                                <LayoutGrid className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.dashboard')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Point of Sale */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.pointOfSale.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.pointOfSale()} 
                                prefetch
                            >
                                <ShoppingCart className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.pos')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Products */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.products.index.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.products.index()} 
                                prefetch
                            >
                                <Package className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.products')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Transactions */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.transactions.index.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link
                                href={admin.transactions.index()}
                                prefetch={false}
                            >
                                <Receipt className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.transactions')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Debts */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.debts.index.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link
                                href={admin.debts.index()}
                                prefetch
                            >
                                <AlertCircle className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.debts')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Customers */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.customers.index.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.customers.index()} 
                                prefetch
                            >
                                <UserCheck className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('customers.title')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Users */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.users.index.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.users.index()} 
                                prefetch
                            >
                                <Users className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.users')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Posts */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive(admin.posts.index.url())} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.posts.index()} 
                                prefetch
                            >
                                <FileText className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.posts')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Settings */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isRouteActive('/admin/settings')} className="group-data-[collapsible=icon]:justify-center py-6 group-data-[collapsible=icon]:py-3">
                            <Link 
                                href={admin.settings.index()} 
                                prefetch
                            >
                                <Settings className="w-6 h-6 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
                                <span className="group-data-[collapsible=icon]:hidden text-lg">{t('sidebar.settings')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-3">
                <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:space-y-3">
                    {/* User Info - Hidden when collapsed */}
                    <div className="flex items-center space-x-3 group-data-[collapsible=icon]:hidden">
                        <div className="w-8 h-8 bg-[#F58E18] rounded-full flex items-center justify-center cursor-pointer">
                            <span className="text-white text-sm font-semibold">
                                {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {auth?.user?.name || 'Admin'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {t('admin.userRole')}
                            </span>
                        </div>
                    </div>
                    
                    {/* Avatar - Only visible when collapsed */}
                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-8 h-8 bg-[#F58E18] rounded-full cursor-pointer">
                        <span className="text-white text-sm font-semibold">
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg cursor-pointer group-data-[collapsible=icon]:mt-3"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
