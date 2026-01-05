import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, ChevronDown, Package, DollarSign, Tag, SortAsc, SortDesc, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
    onFiltersChange?: (filters: FilterState) => void;
    className?: string;
}

interface FilterState {
    search: string;
    type: string;
    priceMin: string;
    priceMax: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function ProductFilters({ onFiltersChange, className = '' }: ProductFiltersProps) {
    const { t } = useTranslation();
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        type: '',
        priceMin: '',
        priceMax: '',
        sortBy: 'name',
        sortOrder: 'asc'
    });

    // Dropdown states
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
    const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);
    
    // Refs for dropdowns
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const sortByDropdownRef = useRef<HTMLDivElement>(null);
    const sortOrderDropdownRef = useRef<HTMLDivElement>(null);

    const typeOptions = [
        { value: '', label: t('products.filters.allTypes') },
        { value: 'pcs', label: t('products.filters.pcs') },
        { value: 'kg', label: t('products.filters.kg') },
        { value: 'width*height', label: t('products.filters.widthHeight') }
    ];

    const sortOptions = [
        { value: 'name', label: t('products.filters.sortByName') },
        { value: 'price', label: t('products.filters.sortByPrice') },
        { value: 'created_at', label: t('products.filters.sortByDate') }
    ];

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange?.(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            type: '',
            priceMin: '',
            priceMax: '',
            sortBy: 'name',
            sortOrder: 'asc' as const
        };
        setFilters(clearedFilters);
        onFiltersChange?.(clearedFilters);
    };

    const hasActiveFilters = filters.search || filters.type || filters.priceMin || filters.priceMax;

    // Click outside handler for dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setIsTypeDropdownOpen(false);
            }
            if (sortByDropdownRef.current && !sortByDropdownRef.current.contains(event.target as Node)) {
                setIsSortByDropdownOpen(false);
            }
            if (sortOrderDropdownRef.current && !sortOrderDropdownRef.current.contains(event.target as Node)) {
                setIsSortOrderDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Dropdown selection handlers
    const handleTypeSelect = (value: string) => {
        handleFilterChange('type', value);
        setIsTypeDropdownOpen(false);
    };

    const handleSortBySelect = (value: string) => {
        handleFilterChange('sortBy', value);
        setIsSortByDropdownOpen(false);
    };

    const handleSortOrderSelect = (value: string) => {
        handleFilterChange('sortOrder', value as 'asc' | 'desc');
        setIsSortOrderDropdownOpen(false);
    };

    // Filter categories removed as they're not used

    return (
        <div className={cn("w-full relative z-25", className)}>
            {/* Main Container */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible">
                {/* Header */}
                <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 rounded-t-lg">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F58E18] rounded-lg flex items-center justify-center shadow-sm">
                                    <Filter className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {t('products.filters.title')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('products.filters.description')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {hasActiveFilters && (
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {t('products.filters.clear')}
                                    </Button>
                                )}
                                
                                <Button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] text-gray-700 dark:text-gray-300"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {showAdvanced ? t('products.filters.hide') : t('products.filters.advanced')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Filters - Always Visible */}
                <div className={cn("p-4", !showAdvanced && "rounded-b-2xl")}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Search className="w-4 h-4 text-blue-500" />
                                {t('products.filters.search')}
                            </Label>
                            <Input
                                id="search"
                                type="text"
                                placeholder={t('products.filters.searchPlaceholder')}
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Package className="w-4 h-4 text-emerald-500" />
                                {t('products.filters.type')}
                            </Label>
                            <div className="relative" ref={typeDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                    className="w-full h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-colors duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer"
                                >
                                    <span className={filters.type ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                        {filters.type ? typeOptions.find(opt => opt.value === filters.type)?.label : t('products.filters.allTypes')}
                                    </span>
                                    <ChevronDown 
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                            isTypeDropdownOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>
                                
                                {isTypeDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-25 overflow-hidden">
                                        {typeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleTypeSelect(option.value)}
                                                className="w-full px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/30 focus:bg-emerald-50 dark:focus:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 focus:text-emerald-700 dark:focus:text-emerald-300 transition-colors duration-200 text-gray-900 dark:text-white cursor-pointer"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters Section */}
                {showAdvanced && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 rounded-b-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center shadow-sm">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                                {t('products.filters.advanced')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Price Range */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-amber-500" />
                                    {t('products.filters.minPrice')} (IQD)
                                </Label>
                                <Input
                                    id="priceMin"
                                    type="number"
                                    placeholder="0"
                                    value={filters.priceMin}
                                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-amber-500" />
                                    {t('products.filters.maxPrice')} (IQD)
                                </Label>
                                <Input
                                    id="priceMax"
                                    type="number"
                                    placeholder="∞"
                                    value={filters.priceMax}
                                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <Label htmlFor="sortBy" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-purple-500" />
                                    {t('products.filters.sortBy')}
                                </Label>
                                <div className="relative" ref={sortByDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
                                        className="w-full h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-colors duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer"
                                    >
                                        <span className={filters.sortBy ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                            {sortOptions.find(opt => opt.value === filters.sortBy)?.label || t('products.filters.sortByName')}
                                        </span>
                                        <ChevronDown 
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                isSortByDropdownOpen ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </button>
                                    
                                    {isSortByDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-25 overflow-hidden">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => handleSortBySelect(option.value)}
                                                    className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:bg-purple-50 dark:focus:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 focus:text-purple-700 dark:focus:text-purple-300 transition-colors duration-200 text-gray-900 dark:text-white cursor-pointer"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4 text-purple-500" /> : <SortDesc className="w-4 h-4 text-purple-500" />}
                                    {t('products.filters.order')}
                                </Label>
                                <div className="relative" ref={sortOrderDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsSortOrderDropdownOpen(!isSortOrderDropdownOpen)}
                                        className="w-full h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-colors duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer"
                                    >
                                        <span className={filters.sortOrder ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                            {filters.sortOrder === 'asc' ? t('products.filters.ascending') : t('products.filters.descending')}
                                        </span>
                                        <ChevronDown 
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                isSortOrderDropdownOpen ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </button>
                                    
                                    {isSortOrderDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-25 overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => handleSortOrderSelect('asc')}
                                                className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:bg-purple-50 dark:focus:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 focus:text-purple-700 dark:focus:text-purple-300 transition-colors duration-200 text-gray-900 dark:text-white cursor-pointer"
                                            >
                                                {t('products.filters.ascending')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSortOrderSelect('desc')}
                                                className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:bg-purple-50 dark:focus:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 focus:text-purple-700 dark:focus:text-purple-300 transition-colors duration-200 text-gray-900 dark:text-white cursor-pointer"
                                            >
                                                {t('products.filters.descending')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}