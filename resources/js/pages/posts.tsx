import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { login } from '@/routes';
import { type SharedData, type Post } from '@/types';
import { usePage } from '@inertiajs/react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import LanguageToggleDropdown from '@/components/language-dropdown';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { useTranslation } from 'react-i18next';
import PostViewModal from '@/components/modals/post-view-modal';
import { useAssetPath, getAssetPath } from '@/hooks/useAssetPath';
import { AnimatedBackground } from '@/components/welcome/AnimatedBackground';

interface PostsPageProps {
    posts?: Post[];
}

export default function Posts({ posts = [] }: PostsPageProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const { getLogoUrl, getPostImageUrl } = useAssetPath();
    const [visiblePosts, setVisiblePosts] = useState(5);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modern load more functionality with smooth animation
    const loadMorePosts = async () => {
        if (isLoadingMore || visiblePosts >= posts.length) return;
        
        setIsLoadingMore(true);
        
        // Simulate smooth loading animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Show all remaining posts at once
        setVisiblePosts(posts.length);
        setIsLoadingMore(false);
    };

    // Hide posts functionality
    const hidePosts = () => {
        setVisiblePosts(5);
    };

    // Open post modal
    const openPostModal = (post: Post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    // Close post modal
    const closePostModal = () => {
        setSelectedPost(null);
        setIsModalOpen(false);
    };

    const hasMorePosts = visiblePosts < posts.length;
    const hasHiddenPosts = visiblePosts > 5;
    const displayedPosts = posts.slice(0, visiblePosts);

    return (
        <>
            <Head title={`${t('posts.title')} - ${t('app.name')}`}>
                <style>{`
                    @keyframes fade-in-up {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.6s ease-out forwards;
                    }
                `}</style>
            </Head>
            
            {/* Fixed Header - Fully Responsive */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 to-orange-50/95 dark:from-[#0F0F0F]/90 dark:to-[#1a1a1a]/90 backdrop-blur-xl border-b border-orange-200/50 dark:border-[#F58E18]/20 shadow-lg shadow-orange-500/10 dark:shadow-black/30">
                {/* Header Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F58E18]/5 to-[#EA580C]/5 dark:from-[#F58E18]/3 dark:to-[#EA580C]/3 opacity-50"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
                        {/* Logo Section - Responsive sizing */}
                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                            <Link 
                                href="/"
                                className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 rounded-lg p-1 cursor-pointer"
                            >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={getLogoUrl()}
                                        alt="Haji Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="hidden xs:block">
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        {t('app.name')}
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        {/* Controls Section */}
                        <div className="flex items-center space-x-2 md:space-x-3">
                            {/* Fullscreen Toggle */}
                            <FullscreenToggle />
                            
                            {/* Language Toggle */}
                            <LanguageToggleDropdown />
                            
                            {/* Theme Toggle */}
                            <AppearanceToggleDropdown />
                            
                            {/* Divider */}
                            <div className="w-px h-4 sm:h-5 md:h-6 bg-gray-200 dark:bg-[#431407]"></div>
                            
                            {/* Login/Dashboard Button */}
                            {auth.isAuthenticated ? (
                                <Link
                                    href={auth.user?.role === 'admin' ? '/admin/dashboard' : 
                                          auth.user?.role === 'cashier' ? '/cashier/pos' : 
                                          auth.user?.role === 'customer' ? '/customer/dashboard' : '/admin/dashboard'}
                                    className="group relative inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#F58E18] to-[#EA580C] text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F58E18]/20"
                                >
                                    <span className="relative z-10">{t('common.dashboard')}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#EA580C] to-[#DC2626] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="group relative inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#F58E18] to-[#EA580C] text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F58E18]/20"
                                >
                                    <span className="relative z-10">{t('welcome.getStarted')}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#EA580C] to-[#DC2626] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 relative overflow-hidden">
                <AnimatedBackground />
                <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-8 sm:space-y-10 md:space-y-12">
                        {/* Posts Grid - Bigger Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 mt-12 sm:mt-14 md:mt-16 max-w-7xl mx-auto">
                            {posts.length > 0 ? (
                                displayedPosts.map((post, index) => (
                                        <div 
                                            key={post.id} 
                                            className="bg-white dark:bg-[#1c1917] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in-up relative border border-gray-200 dark:border-[#431407] hover:shadow-[#F58E18]/20 dark:hover:shadow-[#F58E18]/10 hover:scale-105"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            {/* Card Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#F58E18]/5 to-[#EA580C]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            {/* View Button Badge */}
                                            <div className="absolute top-3 left-3 z-10">
                                                <button
                                                    onClick={() => openPostModal(post)}
                                                    className="group/badge relative inline-flex items-center px-3 py-2 bg-white/95 dark:bg-[#1c1917]/95 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg shadow-sm border border-gray-200 dark:border-[#431407] hover:bg-[#F58E18] hover:text-white hover:border-[#F58E18] hover:shadow-lg hover:shadow-[#F58E18]/25 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                                                >
                                                    {/* Button Background Glow Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#F58E18] to-[#EA580C] opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300 rounded-md"></div>
                                                    
                                                    {/* Shimmer Effect */}
                                                    <div className="absolute inset-0 -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/badge:translate-x-full transition-transform duration-700 rounded-md"></div>
                                                    
                                                    {/* Content */}
                                                    <div className="relative z-10 flex items-center">
                                                        <Eye className="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover/badge:scale-110 group-hover/badge:rotate-12" />
                                                        <span className="transition-all duration-300 group-hover/badge:font-semibold">{t('posts.page.view')}</span>
                                                    </div>
                                                    
                                                    {/* Pulse Effect */}
                                                    <div className="absolute inset-0 rounded-md bg-[#F58E18]/20 opacity-0 group-hover/badge:opacity-100 group-hover/badge:animate-ping"></div>
                                                </button>
                                            </div>

                                        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-[#431407]/50">
                                            {getPostImageUrl(post) ? (
                                                <img
                                                    src={getPostImageUrl(post) || undefined}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#F58E18] to-[#EA580C] flex items-center justify-center">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-lg opacity-80">
                                                        <img
                                                            src={getLogoUrl()}
                                                            alt="Haji Logo"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        
                                        <div className="p-4 sm:p-5 md:p-6">
                                            {/* Post Title */}
                                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                                                {post.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center min-h-[60vh] text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#F58E18] to-[#EA580C] rounded-full flex items-center justify-center">
                                        <img
                                            src={getAssetPath('images/hajiNoBackground.png')}
                                            alt="Haji Logo"
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('posts.page.noPostsYet')}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{t('posts.page.checkBackSoon')}</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Action Buttons - Responsive */}
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            {/* Load More Button */}
                            {hasMorePosts && (
                                <button 
                                    onClick={loadMorePosts}
                                    disabled={isLoadingMore}
                                    className="group relative overflow-hidden bg-gradient-to-r from-[#F58E18] to-[#EA580C] text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F58E18]/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                                >
                                    {/* Button Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#EA580C] to-[#DC2626] rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#F58E18]/20 to-[#EA580C]/20 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isLoadingMore ? (
                                            <>
                                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span className="hidden sm:inline">{t('posts.page.loading')}</span>
                                                <span className="sm:hidden">{t('posts.page.loading')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">{t('posts.page.loadMorePosts')}</span>
                                                <span className="sm:hidden">{t('posts.page.loadMore')}</span>
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#EA580C] to-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                                </button>
                            )}

                            {/* Hide More Button */}
                            {hasHiddenPosts && (
                                <button 
                                    onClick={hidePosts}
                                    className="group relative overflow-hidden bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/20 cursor-pointer text-xs sm:text-sm"
                                >
                                    {/* Button Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                        <span className="hidden sm:inline">{t('posts.page.showLess')}</span>
                                        <span className="sm:hidden">{t('posts.page.less')}</span>
                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </button>
                            )}
                        </div>

                        {/* Posts Counter - Responsive */}
                        {posts.length > 0 && (
                            <div className="text-center px-4">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {t('posts.page.showing')} {displayedPosts.length} {t('posts.page.of')} {posts.length} {t('posts.page.posts')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post View Modal */}
            <PostViewModal 
                post={selectedPost}
                isOpen={isModalOpen}
                onClose={closePostModal}
            />
        </>
    );
}
