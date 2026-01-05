import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { t } = useTranslation();
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{t('app.name')}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const itemUrl = typeof item.href === 'string' ? item.href : item.href.url;
                    const isActive = page.url.startsWith(itemUrl);
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={isActive ? "gradient-active text-white font-semibold" : ""}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
