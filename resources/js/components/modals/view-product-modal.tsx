import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Package, 
    DollarSign, 
    Tag, 
    Calendar, 
    Ruler,
    Hash,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIQDWithSymbol } from '@/lib/currency';

interface Product {
    id: number;
    name: string;
    price: number;
    type: string;
    width?: string | number;
    height?: string | number;
    created_at: string;
    updated_at: string;
}

interface ViewProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export default function ViewProductModal({
    product,
    isOpen,
    onClose,
}: ViewProductModalProps) {
    const { t } = useTranslation();

    if (!product) return null;

    // Format product type display
    const formatProductType = (product: Product) => {
        if (product.type === 'width*height' && product.width && product.height) {
            // Backend now returns width and height with "cm" already appended
            return `${product.width} × ${product.height}`;
        }
        return product.type.toUpperCase();
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get type badge color
    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'pcs':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'kg':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'width*height':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-[#262626]/50 dark:text-gray-300';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3b82f6] rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t('products.modal.viewProduct.title')}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('products.modal.viewProduct.description')}
                            </p>
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
                <div className="p-4 space-y-3">
                    {/* Product Name */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{t('products.modal.viewProduct.price')}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                            {formatIQDWithSymbol(product.price)}
                        </span>
                    </div>

                    {/* Type */}
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{t('products.modal.viewProduct.type')}</span>
                        </div>
                        <Badge className={cn(
                            "text-sm font-semibold px-2 py-1",
                            getTypeBadgeColor(product.type)
                        )}>
                            {formatProductType(product)}
                        </Badge>
                    </div>

                    {/* Dimensions (if applicable) */}
                    {product.type === 'width*height' && product.width && product.height && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span className="font-medium text-gray-900 dark:text-white">{t('products.modal.viewProduct.dimensions')}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {t('products.modal.viewProduct.width')}
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{product.width}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {t('products.modal.viewProduct.height')}
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{product.height}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 dark:bg-[#262626]/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-3 h-3 text-blue-500" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {t('products.modal.viewProduct.createdAt')}
                                </span>
                            </div>
                            <p className="text-xs text-gray-900 dark:text-white">{formatDate(product.created_at)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-[#262626]/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Hash className="w-3 h-3 text-purple-500" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {t('products.modal.viewProduct.updatedAt')}
                                </span>
                            </div>
                            <p className="text-xs text-gray-900 dark:text-white">{formatDate(product.updated_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400">ID: #{product.id}</span>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            size="sm"
                        >
                            {t('common.buttons.close')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
