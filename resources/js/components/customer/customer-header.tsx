import { Breadcrumbs } from '@/components/breadcrumbs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import LanguageToggleDropdown from '@/components/language-dropdown';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData, Transaction } from '@/types';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useAssetPath } from '@/hooks/useAssetPath';
import { Bell } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

export function CustomerHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const { getLogoUrl } = useAssetPath();

    // Notification state
    const [notifications, setNotifications] = useState<Transaction[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [removingNotification, setRemovingNotification] = useState<number | null>(null);
    const [lastCheckedTransactionId, setLastCheckedTransactionId] = useState<number | null>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Notification functions
    const loadNotifications = useCallback(() => {
        const storedNotifications = localStorage.getItem(`notifications_${auth.user.id}`);
        if (storedNotifications) {
            const parsedNotifications = JSON.parse(storedNotifications);
            setNotifications(parsedNotifications);
            setUnreadCount(parsedNotifications.length);
        }
    }, [auth.user.id]);

    const saveNotifications = useCallback((newNotifications: Transaction[]) => {
        localStorage.setItem(`notifications_${auth.user.id}`, JSON.stringify(newNotifications));
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.length);
    }, [auth.user.id]);

    const markAsRead = useCallback((transactionId: number) => {
        // Show visual feedback
        setRemovingNotification(transactionId);
        
        // Remove notification after a short delay for visual feedback
        setTimeout(() => {
            const updatedNotifications = notifications.filter(notif => notif.id !== transactionId);
            saveNotifications(updatedNotifications);
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.length);
            setRemovingNotification(null);
        }, 200);
    }, [notifications, saveNotifications]);

    const markAllAsRead = useCallback(() => {
        // Show visual feedback for all notifications
        setRemovingNotification(-1); // Special value to indicate all notifications
        
        // Clear all notifications after a short delay for visual feedback
        setTimeout(() => {
            saveNotifications([]);
            setNotifications([]);
            setUnreadCount(0);
            setRemovingNotification(null);
            
            // Also clear the last checked transaction ID so system can start fresh
            localStorage.removeItem(`lastCheckedTransaction_${auth.user.id}`);
            setLastCheckedTransactionId(null);
        }, 300);
    }, [saveNotifications, auth.user.id]);

    const toggleNotificationDropdown = () => {
        setNotificationDropdownOpen(!notificationDropdownOpen);
    };

    // Helper function to format relative time
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
            return t('common.justNow', 'Just now');
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    };

    // Load notifications and last checked transaction ID on component mount
    useEffect(() => {
        loadNotifications();
        
        // Load last checked transaction ID from localStorage
        const storedLastChecked = localStorage.getItem(`lastCheckedTransaction_${auth.user.id}`);
        if (storedLastChecked) {
            setLastCheckedTransactionId(parseInt(storedLastChecked));
        } else {
            // Initialize last checked transaction ID if not stored
            const initializeLastChecked = async () => {
                try {
                    const response = await fetch(`/customer/api/transactions`, {
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.transactions && data.transactions.data && data.transactions.data.length > 0) {
                            const mostRecentTransaction = data.transactions.data[0];
                            setLastCheckedTransactionId(mostRecentTransaction.id);
                            localStorage.setItem(`lastCheckedTransaction_${auth.user.id}`, mostRecentTransaction.id.toString());
                        }
                    }
                } catch {
                    // Silently handle errors
                }
            };
            
            initializeLastChecked();
        }
    }, [loadNotifications, auth.user.id]);

    // Function to add new transaction as notification
    const addNewTransactionNotification = useCallback((transaction: Transaction) => {
        const existingNotifications = [...notifications];
        const isDuplicate = existingNotifications.some(notif => notif.id === transaction.id);
        
        if (!isDuplicate) {
            const newNotifications = [transaction, ...existingNotifications];
            saveNotifications(newNotifications);
            
            // Show a subtle visual indicator that a new notification was added
            // The notification will persist until manually marked as read
        }
    }, [notifications, saveNotifications]);





    // Function to check for new transactions
    const checkForNewTransactions = useCallback(async () => {
        try {
            const response = await fetch(`/customer/api/transactions`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.transactions && data.transactions.data && data.transactions.data.length > 0) {
                    // Get the most recent transaction (first in the list since it's ordered by date desc)
                    const mostRecentTransaction = data.transactions.data[0];
                    
                    // Check if this is a new transaction (different from last checked)
                    const isNewTransaction = lastCheckedTransactionId !== mostRecentTransaction.id;
                    
                    // Only add if it's a new transaction
                    if (isNewTransaction) {
                        addNewTransactionNotification(mostRecentTransaction);
                        
                        // Update the last checked transaction ID and save to localStorage
                        setLastCheckedTransactionId(mostRecentTransaction.id);
                        localStorage.setItem(`lastCheckedTransaction_${auth.user.id}`, mostRecentTransaction.id.toString());
                        
                        // Trigger a custom event to notify the dashboard of new transactions
                        window.dispatchEvent(new CustomEvent('newTransactionsDetected', {
                            detail: { transactions: [mostRecentTransaction] }
                        }));
                    }
                }
            }
        } catch {
            // Silently handle errors
        }
    }, [addNewTransactionNotification, lastCheckedTransactionId, auth.user.id]);

    // Check for new transactions immediately and periodically
    useEffect(() => {
        // Check immediately when component mounts
        checkForNewTransactions();
        
        // Then check every 15 seconds for faster response
        const interval = setInterval(checkForNewTransactions, 15000);
        return () => clearInterval(interval);
    }, [checkForNewTransactions]);

    // Listen for page visibility changes to check for new transactions when user returns
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkForNewTransactions();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [checkForNewTransactions]);

    // Click outside handler for notification dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationDropdownOpen(false);
            }
        };

        if (notificationDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notificationDropdownOpen]);

    return (
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 shrink-0 items-center gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] px-3 sm:px-4 lg:px-6 w-full">
            {/* Left Section - Logo and Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* System Logo */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg overflow-hidden shadow-sm">
                        <img
                            src={getLogoUrl()}
                            alt="Haji Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white hidden xs:block">
                            {t('app.name')}
                        </span>
                    </div>
                </div>
                
                {/* Separator - Hidden on very small screens */}
                <div className="h-4 sm:h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                
                {/* Breadcrumbs - Responsive */}
                <div className="min-w-0 flex-1 hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            
            {/* Mobile Breadcrumbs - Show only current page */}
            <div className="sm:hidden min-w-0 flex-1">
                {breadcrumbs.length > 0 && (
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {breadcrumbs[breadcrumbs.length - 1]?.title}
                    </div>
                )}
            </div>
            
            {/* Right Section - Controls */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Desktop Controls */}
                <div className="hidden sm:flex items-center gap-2">
                    {/* Fullscreen Toggle */}
                    <FullscreenToggle />
                    
                    {/* Notification Button */}
                    <div className="relative z-10" ref={notificationRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-md shadow-sm transition-all duration-200 hover:!bg-transparent hover:!text-current hover:!shadow-sm"
                            title={t('customer.dashboard.notifications')}
                            onClick={toggleNotificationDropdown}
                        >
                            <Bell className="h-5 w-5" />
                        </Button>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-[100] font-medium shadow-lg border-2 border-white dark:border-gray-900">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                        
                        {/* Notification Dropdown */}
                        {notificationDropdownOpen && (
                            <div className="absolute right-0 top-10 w-80 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-[#431407] rounded-lg shadow-xl z-[100] backdrop-blur-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-[#431407]">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {t('customer.dashboard.notifications')}
                                        </h3>
                                        {unreadCount > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={markAllAsRead}
                                                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:!text-blue-600 dark:hover:!text-blue-400 hover:!bg-transparent !important no-hover"
                                                style={{
                                                    backgroundColor: 'transparent !important',
                                                    color: 'rgb(37 99 235) !important'
                                                }}
                                            >
                                                {t('customer.dashboard.markAllRead')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                            {t('customer.dashboard.noNotifications')}
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-100 dark:border-[#431407] hover:bg-gray-50 dark:hover:bg-[#431407] cursor-pointer transition-all duration-200 no-hover ${
                                                    removingNotification === notification.id || removingNotification === -1
                                                        ? 'opacity-50 scale-95' 
                                                        : ''
                                                }`}
                                                style={{
                                                    backgroundColor: 'transparent !important'
                                                }}
                                                onClick={() => {
                                                    markAsRead(notification.id);
                                                    // You can add navigation to transaction details here
                                                }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {notification.type === 'transaction' 
                                                                ? t('customer.dashboard.newTransaction')
                                                                : t('customer.dashboard.newOffer')
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {notification.order_id} - {new Date(notification.transaction_date).toLocaleDateString()} {new Date(notification.transaction_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </div>
                                                        <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                                            {getRelativeTime(notification.transaction_date)}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                            {t('customer.dashboard.total')}: {notification.grand_total.toLocaleString()} IQD
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification.id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 no-hover"
                                                        style={{
                                                            backgroundColor: 'transparent !important',
                                                            color: 'rgb(156 163 175) !important'
                                                        }}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Language Toggle */}
                    <LanguageToggleDropdown />
                    
                    {/* Theme Toggle */}
                    <AppearanceToggleDropdown />
                    
                    {/* Separator */}
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
                
                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 sm:h-10 px-2 sm:px-4 rounded-lg bg-blue-100 dark:bg-[#1c1917] hover:bg-blue-200 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 text-gray-900 dark:text-[#fed7aa] shadow-sm transition-all duration-200 group">
                            <UserInfo user={auth.user} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 sm:w-64 p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
