import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';


interface PostModalProps {
    post?: Post | null;
    isEditMode?: boolean;
    isOpen?: boolean;
    onPostAdded?: (post: Post) => void;
    onPostUpdated?: (post: Post) => void;
    onClose?: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ 
    post: postData = null, 
    isEditMode = false,
    isOpen: externalIsOpen = false, 
    onPostAdded, 
    onPostUpdated, 
    onClose 
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    // Use external isOpen prop if provided, otherwise use internal state
    const isOpen = externalIsOpen || internalIsOpen;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        image_file: null as File | null,
        _method: 'POST' as string,
    });

    // Populate form when in edit mode
    useEffect(() => {
        if (isEditMode && postData) {
            setData({
                title: postData.title || '',
                description: postData.description || '',
                image_file: null,
                _method: 'PUT',
            });
            setInternalIsOpen(true);
        } else {
            setData({
                title: '',
                description: '',
                image_file: null,
                _method: 'POST',
            });
        }
    }, [isEditMode, postData, setData]);

    const handleInputChange = (field: string, value: string | File | null) => {
        setData(field as keyof typeof data, value);
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image_file', file);
    };

    const handleClose = () => {
        setInternalIsOpen(false);
        reset();
        // Call external onClose callback if provided
        if (onClose) {
            onClose();
        }
        // Note: No need to notify parent when modal is closed without saving
    };

    const handleSubmit = () => {
        // Use POST for both create and update when dealing with files
        const url = isEditMode && postData ? `/admin/posts/${postData.id}` : '/admin/posts';
        
        post(url, {
            onSuccess: () => {
                reset();
                setInternalIsOpen(false);
                
                if (isEditMode && postData) {
                    // Update mode
                    const updatedPost = {
                        ...postData,
                        title: data.title,
                        description: data.description,
                    };
                    onPostUpdated?.(updatedPost);
                    toast({
                        title: t('toast.success'),
                        description: t('toast.postUpdated'),
                        variant: "success",
                    });
                } else {
                    // Create mode
                    onPostAdded?.({
                        id: 0,
                        title: data.title,
                        description: data.description,
                        content: data.description || '', // Use description as content for now
                        image_url: '',
                        image_path: '',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                    toast({
                        title: t('toast.success'),
                        description: t('toast.postCreated'),
                        variant: "success",
                    });
                }
            },
            onError: () => {
                toast({
                    title: t('toast.error'),
                    description: isEditMode ? t('toast.failedToUpdate') : t('toast.failedToCreate'),
                    variant: "destructive",
                });
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden mx-2 sm:mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            {isEditMode ? (
                                <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {isEditMode ? t('posts.editPost') : t('posts.addPost')}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#262626]/50 rounded-lg transition-colors duration-200"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-3 sm:space-y-4">
                        {/* Title Section */}
                        <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                {t('posts.title')} *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder={t('posts.titlePlaceholder')}
                                className={`w-full px-2.5 sm:px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#1a1a1a] dark:border-gray-800 dark:text-white transition-all duration-200 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-800'
                                }`}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                {t('posts.description')} *
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder={t('posts.descriptionPlaceholder')}
                                rows={3}
                                className={`w-full px-2.5 sm:px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#1a1a1a] dark:border-gray-800 dark:text-white transition-all duration-200 resize-none ${
                                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-800'
                                }`}
                                required
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Image Upload Section */}
                        <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{t('posts.image')}</h3>
                            </div>
                            
                            {/* Current Image Preview (Edit Mode) */}
                            {isEditMode && postData?.image_url && !data.image_file && (
                                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-2 sm:mb-3 font-medium">
                                        {t('posts.currentImage', 'Current Image')}:
                                    </p>
                                    <div className="relative inline-block">
                                        <img
                                            src={postData.image_url}
                                            alt={postData.title}
                                            className="max-w-full sm:max-w-xs max-h-24 sm:max-h-32 rounded-lg border border-gray-300 dark:border-gray-800 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {t('posts.replaceImage', 'Click below to replace')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-4 sm:p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3"
                                >
                                    <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block">
                                            {data.image_file ? data.image_file.name : 
                                             isEditMode ? t('posts.replaceOrAddImage', 'Click to replace or add image') : 
                                             t('posts.clickToUpload')}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                                            {t('posts.supportedFormats', 'PNG, JPG, GIF up to 10MB')}
                                        </span>
                                    </div>
                                </label>
                            </div>
                            
                            {data.image_file && (
                                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {t('posts.newImageSelected', 'New image selected')}: {data.image_file.name}
                                    </p>
                                </div>
                            )}
                            
                            {errors.image_file && (
                                <p className="text-sm text-red-500 mt-2">{errors.image_file}</p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626]/50 transition-colors font-medium cursor-pointer"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#F58E18] hover:bg-[#EA580C] text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {isEditMode ? t('common.updating') : t('common.creating')}
                                </>
                            ) : (
                                <>
                                    {isEditMode ? (
                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                    ) : (
                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    )}
                                    {isEditMode ? t('common.update') : t('common.create')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;