import React from 'react';
import { Eye, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type Post } from '@/types';
import { useAssetPath } from '@/hooks/useAssetPath';

interface PostViewModalProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
}

const PostViewModal: React.FC<PostViewModalProps> = ({ post, isOpen, onClose }) => {
    const { t } = useTranslation();
    const { getLogoUrl, getPostImageUrl } = useAssetPath();

    if (!isOpen || !post) {
        return null;
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('posts.viewPost')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-[#262626]/50 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-6">
                        {/* Post Image */}
                        <div className="aspect-video relative overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg">
                            {getPostImageUrl(post) ? (
                                <img
                                    src={getPostImageUrl(post) || undefined}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg opacity-60">
                                        <img
                                            src={getLogoUrl()}
                                            alt="Haji Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Post Title */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {post.title}
                            </h1>
                        </div>


                        {/* Post Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                {t('posts.description')}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {post.description}
                            </p>
                        </div>

                        {/* Post Content (if exists) */}
                        {post.content && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('posts.content')}
                                </h3>
                                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-4">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-gray-100 dark:bg-[#262626]/50 hover:bg-gray-200 dark:hover:bg-[#262626]/70 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                            {t('common.buttons.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostViewModal;