// Removed unused import
import { Button } from '@/components/ui/button';
import { Trash2, X, AlertTriangle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';


interface DeletePostModalProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
    onPostDeleted?: (post: Post) => void;
}

export default function DeletePostModal({
    post,
    isOpen,
    onClose,
    onPostDeleted
}: DeletePostModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    
    const { delete: deletePost, processing, errors } = useForm();

    if (!post || !isOpen) return null;

    const handleDelete = () => {
        deletePost(`/admin/posts/${post.id}`, {
            onSuccess: () => {
                onClose();
                onPostDeleted?.(post);
                toast({
                    title: t('toast.success'),
                    description: t('toast.postDeleted'),
                    variant: "success",
                });
            },
            onError: () => {
                toast({
                    title: t('toast.error'),
                    description: t('toast.failedToDeletePost'),
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-0 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F58E18] red-600 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t('posts.modal.deletePost.title', 'Delete Post')}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Warning Icon and Message */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <p className="text-red-800 dark:text-red-300 font-medium">
                                {t('posts.modal.deletePost.warning', 'This action cannot be undone!')}
                            </p>
                            <p className="text-red-700 dark:text-red-400 text-sm">
                                {t('posts.modal.deletePost.description', 'This will permanently delete this post and any associated images. All content will be lost forever.')}
                            </p>
                        </div>
                    </div>

                    {/* Post Information */}
                    <div className="p-4 bg-gray-50 dark:bg-[#262626]/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: #{post.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* General Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                {Object.values(errors).join(', ')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="px-6 py-2 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out hover:scale-105 hover:shadow-md transform"
                        disabled={processing}
                    >
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform group"
                        disabled={processing}
                    >
                        <Trash2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300 ease-out" />
                        {processing ? t('posts.modal.deletePost.buttons.deleting', 'Deleting...') : t('posts.modal.deletePost.buttons.delete', 'Delete Post')}
                    </Button>
                </div>
            </div>
        </div>
    );
}