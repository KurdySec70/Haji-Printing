import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Post } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader, { PageHeaderActions } from '@/components/page-header';
import { LazyPostModal, LazyDeletePostModal } from '@/components/lazy-imports';
import PostViewModal from '@/components/modals/post-view-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Search, FileText } from 'lucide-react';
import { useAssetPath } from '@/hooks/useAssetPath';


interface PostsPageProps {
    posts?: Post[];
}

export default function Posts({ posts: initialPosts = [] }: PostsPageProps) {
    const { t } = useTranslation();
    const { getLogoUrl, getPostImageUrl } = useAssetPath();
    
    // State management
    const [posts, setPosts] = useState<Post[]>(initialPosts || []);
    // const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingPost, setDeletingPost] = useState<Post | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 15; // Show 15 posts per page (3 rows of 5)
    
    // Update posts when props change (after refresh)
    useEffect(() => {
        setPosts(initialPosts || []);
    }, [initialPosts]);

    // Filter posts based on search query
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePostAdded = (post: Post) => {
        setPosts(prev => [...prev, post]);
        // Go to the last page to show the new post
        const newTotalPages = Math.ceil((posts.length + 1) / postsPerPage);
        setCurrentPage(newTotalPages);
        // Refresh the page to get updated data
        router.reload();
    };

    // View modal handlers
    const openViewModal = (post: Post) => {
        setSelectedPost(post);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setSelectedPost(null);
        setIsViewModalOpen(false);
    };

    // Post modal handlers (for both add and edit)
    const openAddModal = () => {
        setEditingPost(null);
        setIsPostModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setIsPostModalOpen(true);
    };

    const closePostModal = () => {
        setEditingPost(null);
        setIsPostModalOpen(false);
    };

    // Delete modal handlers
    const openDeleteModal = (post: Post) => {
        setDeletingPost(post);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeletingPost(null);
        setIsDeleteModalOpen(false);
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
        router.reload();
    };

    const handlePostDeleted = (deletedPost: Post) => {
        setPosts(prev => prev.filter(p => p.id !== deletedPost.id));
        router.reload();
    };
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('posts.title'),
            href: '/admin/posts',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('posts.title')} - ${t('app.name')}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header Component */}
                <PageHeader
                    title={t('posts.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            <Button
                                onClick={openAddModal}
                                variant="default"
                                className="bg-[#F58E18] hover:bg-[#EA580C]"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t('posts.addPost')}
                            </Button>
                        </PageHeaderActions>
                    }
                />

                {/* Posts Container */}
                <div className="flex-1 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                    {/* Header with Search */}
                    <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-white dark:bg-[#1a1a1a]">
                        <div className="flex items-center justify-between gap-4">
                            {/* Search Input */}
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder={t('posts.searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#1c1917] border-gray-300 dark:border-[#431407] rounded-xl focus:ring-2 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-all duration-200"
                                    />
                                </div>
                            </div>
                            
                            {/* Results Count */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {filteredPosts.length} of {posts.length} posts
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid - Scrollable Content */}
                    <div className="flex-1">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
                        {currentPosts.map((post) => (
                            <div key={post.id} className="group relative bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                {/* Post Image */}
                                <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    {getPostImageUrl(post) ? (
                                        <img
                                            src={getPostImageUrl(post) || undefined}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg opacity-60">
                                                <img
                                                    src={getLogoUrl()}
                                                    alt="Haji Logo"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                        <button 
                                            onClick={() => openViewModal(post)}
                                            className="p-2 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group/btn border border-gray-200 dark:border-gray-800"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition-colors duration-200" />
                                        </button>
                                        <button 
                                            onClick={() => openEditModal(post)}
                                            className="p-2 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group/btn border border-gray-200 dark:border-gray-800"
                                        >
                                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-green-600 dark:group-hover/btn:text-green-400 transition-colors duration-200" />
                                        </button>
                                        <button 
                                            onClick={() => openDeleteModal(post)}
                                            className="p-2 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group/btn border border-gray-200 dark:border-gray-800"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500 group-hover/btn:text-red-600 dark:group-hover/btn:text-red-400 transition-colors duration-200" />
                                        </button>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="p-6 pb-16">
                                    {/* Post Title */}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#F58E18] dark:group-hover:text-[#EA580C] transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    
                                    {/* Post Description */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                                        {post.description}
                                    </p>
                                </div>

                                {/* Fixed Footer Meta */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Published
                                        </span>
                                        <span>{new Date(post.created_at).toLocaleString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredPosts.length === 0 && posts.length > 0 && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-[#F58E18] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Posts Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                                    No posts match your search criteria. Try adjusting your search terms.
                                </p>
                                <Button
                                    onClick={() => setSearchQuery('')}
                                    variant="default"
                                >
                                    Clear Search
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Empty State - No Posts at All */}
                    {posts.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-[#F58E18] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('posts.noPostsYet')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                                    {t('posts.noPostsYetDescription')}
                                </p>
                                <Button
                                    onClick={openAddModal}
                                    variant="default"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('posts.addPost')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Pagination */}
                {filteredPosts.length > 0 && totalPages > 1 && (
                    <div className="bg-white dark:bg-[#1c1917] rounded-2xl shadow-sm border border-gray-200 dark:border-[#431407] px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Posts Info */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(endIndex, filteredPosts.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredPosts.length}</span> posts
                                {searchQuery && (
                                    <span className="ml-2 text-[#F58E18] dark:text-[#EA580C]">
                                        (filtered from {posts.length} total)
                                    </span>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-3">
                                {/* Previous Button */}
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md ${
                                                currentPage === page
                                                    ? 'bg-[#F58E18] text-white'
                                                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626]'
                                            } cursor-pointer`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1c1917] border border-gray-300 dark:border-[#431407] rounded-xl hover:bg-gray-50 dark:hover:bg-[#431407]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Post View Modal */}
            <PostViewModal 
                post={selectedPost} 
                isOpen={isViewModalOpen} 
                onClose={closeViewModal} 
            />

            {/* Unified Post Modal (Add/Edit) */}
            <LazyPostModal
                post={editingPost}
                isEditMode={!!editingPost}
                isOpen={isPostModalOpen}
                onPostAdded={handlePostAdded}
                onPostUpdated={handlePostUpdated}
                onClose={closePostModal}
            />

            {/* Delete Post Modal */}
            <LazyDeletePostModal
                post={deletingPost}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onPostDeleted={handlePostDeleted}
            />
        </AppLayout>
    );
}
