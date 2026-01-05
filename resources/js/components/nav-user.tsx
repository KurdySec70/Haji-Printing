import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="group text-white gradient-active">
                    <UserInfo user={auth.user} />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
