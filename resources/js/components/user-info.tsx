import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { useTranslation } from 'react-i18next';

export function UserInfo({ user, showEmail = false }: { user: User | null; showEmail?: boolean }) {
    const getInitials = useInitials();
    const { t } = useTranslation();

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 overflow-hidden rounded-full">
                    <AvatarFallback className="rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium text-xs">
                        ?
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-gray-900 dark:text-gray-100 text-xs leading-none">
                        {t('common.messages.loading')}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium text-xs">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <span className="truncate font-medium text-gray-900 dark:text-gray-100 text-xs leading-none">
                    {user.name}
                </span>
                {showEmail && (
                    <span className="truncate text-xs text-gray-600 dark:text-gray-400 leading-none mt-0.5 hidden sm:block">
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
}
