import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';

interface InvoiceSettings {
    header_color: string;
    footer_color: string;
    table_header_color: string;
    primary_font: string;
    font_size_base: number;
    font_weight?: string;
    logo_width: number;
    logo_height: number;
    logo_url?: string;
    company_title: string;
    company_name: string;
    company_address?: string;
    company_phone_1?: string;
    company_phone_2?: string;
    company_email?: string;
    company_website?: string;
    header_height: number;
    footer_height: number;
    show_logo: boolean;
    show_company_info: boolean;
    show_date_time: boolean;
}

interface InvoiceTemplateContentProps {
    activeTab: string;
    settings: InvoiceSettings;
    onSettingsChange: (key: keyof InvoiceSettings, value: string | number | boolean) => void;
    selectedFile: File | null;
    onFileSelect: (file: File | null) => void;
    onLogoUpload?: (logoUrl: string) => void;
    filePreview?: string | null;
    onFilePreviewChange?: (preview: string | null) => void;
}

export function InvoiceTemplateContent({ 
    activeTab, 
    settings, 
    onSettingsChange, 
    onFileSelect, 
    onLogoUpload,
    filePreview: externalFilePreview,
    onFilePreviewChange
}: InvoiceTemplateContentProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
    const [internalFilePreview, setInternalFilePreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const fontDropdownRef = useRef<HTMLDivElement>(null);

    // Use external preview if provided, otherwise use internal state
    const filePreview = externalFilePreview !== undefined ? externalFilePreview : internalFilePreview;
    const setFilePreview = onFilePreviewChange || setInternalFilePreview;

    const updateSetting = (key: keyof InvoiceSettings, value: string | number | boolean) => {
        onSettingsChange(key, value);
    };

    const handleFileSelect = async (file: File) => {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: t('toast.error'),
                description: 'File size must be less than 2MB',
                variant: 'destructive',
            });
            return;
        }

        onFileSelect(file);
        
        // Create preview URL immediately for real-time display
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewUrl = e.target?.result as string;
            setFilePreview(previewUrl);
            // Update settings immediately with preview URL for real-time preview
            onSettingsChange('logo_url', previewUrl);
        };
        reader.readAsDataURL(file);

        // Upload logo immediately
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('logo', file);
            
            const uploadResponse = await fetch('/admin/api/upload-logo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                const newLogoUrl = uploadData.logo_url;
                
                // Update settings with the actual uploaded logo URL
                onSettingsChange('logo_url', newLogoUrl);
                
                // Update preview to use the uploaded URL
                setFilePreview(null); // Clear local preview, use uploaded URL
                
                // Notify parent component if callback provided
                if (onLogoUpload) {
                    onLogoUpload(newLogoUrl);
                }
                
                toast({
                    title: t('toast.success'),
                    description: 'Logo uploaded successfully',
                    variant: 'default',
                });
            } else {
                const errorData = await uploadResponse.json().catch(() => ({}));
                toast({
                    title: t('toast.error'),
                    description: errorData.message || 'Failed to upload logo',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast({
                title: t('toast.error'),
                description: 'Failed to upload logo. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleRemoveFile = () => {
        onFileSelect(null);
        setFilePreview(null);
        // Clear logo URL when removing
        onSettingsChange('logo_url', '');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
                setIsFontDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="space-y-2">
            {/* Colors Tab */}
            {activeTab === 'colors' && (
                <Card className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-gray-900 dark:text-white">{t('settings.invoiceTemplate.colorSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="header_color" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.headerColor')}</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="header_color"
                                        type="color"
                                        value={settings.header_color}
                                        onChange={(e) => updateSetting('header_color', e.target.value)}
                                        className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.header_color}
                                        onChange={(e) => updateSetting('header_color', e.target.value)}
                                        className="flex-1 text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="footer_color" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.footerColor')}</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="footer_color"
                                        type="color"
                                        value={settings.footer_color}
                                        onChange={(e) => updateSetting('footer_color', e.target.value)}
                                        className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.footer_color}
                                        onChange={(e) => updateSetting('footer_color', e.target.value)}
                                        className="flex-1 text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="table_header_color" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.tableHeaderColor')}</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="table_header_color"
                                        type="color"
                                        value={settings.table_header_color}
                                        onChange={(e) => updateSetting('table_header_color', e.target.value)}
                                        className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.table_header_color}
                                        onChange={(e) => updateSetting('table_header_color', e.target.value)}
                                        className="flex-1 text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick Color Presets */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Color Presets</Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Blue', header: '#3b82f6', footer: '#3b82f6', table: '#3b82f6' },
                                    { name: 'Orange', header: '#f97316', footer: '#f97316', table: '#f97316' },
                                    { name: 'Green', header: '#10b981', footer: '#10b981', table: '#10b981' },
                                    { name: 'Purple', header: '#8b5cf6', footer: '#8b5cf6', table: '#8b5cf6' },
                                    { name: 'Red', header: '#ef4444', footer: '#ef4444', table: '#ef4444' },
                                    { name: 'Gray', header: '#6b7280', footer: '#6b7280', table: '#6b7280' }
                                ].map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => {
                                            updateSetting('header_color', preset.header);
                                            updateSetting('footer_color', preset.footer);
                                            updateSetting('table_header_color', preset.table);
                                        }}
                                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
                <Card className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-gray-900 dark:text-white">{t('settings.invoiceTemplate.typographySettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primary_font" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.fontFamily')}</Label>
                                <div className="relative" ref={fontDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                                        className="w-full h-9 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-[#431407] rounded-lg hover:border-gray-300 dark:hover:border-[#431407] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer"
                                    >
                                        <span className="text-gray-900 dark:text-white">
                                            {settings.primary_font}
                                        </span>
                                        <ChevronDown 
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                isFontDropdownOpen ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </button>
                                    
                                    {isFontDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-[#431407] rounded-lg shadow-lg z-[10000] overflow-hidden">
                                            {[
                                                'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
                                                'Verdana', 'Courier New', 'Inter', 'Roboto', 'Open Sans',
                                                'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro', 'Nunito',
                                                'Playfair Display', 'Merriweather', 'Crimson Text', 'Libre Baskerville',
                                                'PT Sans', 'PT Serif', 'Raleway', 'Ubuntu', 'Fira Sans',
                                                'Work Sans', 'Cabin', 'Lora', 'Oswald', 'Droid Sans',
                                                'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino',
                                                'Garamond', 'Book Antiqua', 'Century Gothic', 'Tahoma'
                                            ].map((font) => (
                                                <button
                                                    key={font}
                                                    type="button"
                                                    onClick={() => {
                                                        updateSetting('primary_font', font);
                                                        setIsFontDropdownOpen(false);
                                                    }}
                                                    className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-[#431407] focus:bg-blue-50 dark:focus:bg-[#431407] hover:text-blue-700 dark:hover:text-[#fed7aa] focus:text-blue-700 dark:focus:text-[#fed7aa] transition-all duration-200 text-gray-900 dark:text-[#fed7aa] cursor-pointer"
                                                >
                                                    {font}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="font_size_base" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.baseFontSize')} ({settings.font_size_base}px)</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="8"
                                        max="20"
                                        step="1"
                                        value={settings.font_size_base}
                                        onChange={(e) => updateSetting('font_size_base', parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-center">{settings.font_size_base}px</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Font Weight Options */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Weight</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { value: '300', label: 'Light' },
                                    { value: '400', label: 'Normal' },
                                    { value: '500', label: 'Medium' },
                                    { value: '600', label: 'Semi Bold' },
                                    { value: '700', label: 'Bold' },
                                    { value: '800', label: 'Extra Bold' }
                                ].map((weight) => (
                                    <button
                                        key={weight.value}
                                        onClick={() => updateSetting('font_weight', weight.value)}
                                        className={`px-3 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                                            settings.font_weight === weight.value
                                                ? 'bg-orange-500 text-white border-orange-500'
                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {weight.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Logo Tab */}
            {activeTab === 'logo' && (
                <Card className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-gray-900 dark:text-white">{t('settings.invoiceTemplate.logoSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <Label htmlFor="show_logo" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.showLogo')}</Label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Display company logo on invoice</p>
                            </div>
                            <input
                                id="show_logo"
                                type="checkbox"
                                checked={settings.show_logo}
                                onChange={(e) => updateSetting('show_logo', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 cursor-pointer"
                            />
                        </div>
                        
                        {settings.show_logo && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="logo_upload" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.logoUpload')}</Label>
                                    <div className="p-4">
                                        <div className="text-center">
                                            <input
                                                type="file"
                                                id="logo_upload"
                                                accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileSelect(file);
                                                    }
                                                    // Reset input so same file can be selected again
                                                    e.target.value = '';
                                                }}
                                                className="hidden"
                                                disabled={uploadingLogo}
                                            />
                                            <label
                                                htmlFor="logo_upload"
                                                className={`inline-flex items-center px-4 py-2 bg-[#F58E18] text-white rounded-lg text-sm font-medium ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#EA580C]'}`}
                                            >
                                                {uploadingLogo ? 'Uploading...' : t('settings.invoiceTemplate.chooseFile')}
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {t('settings.invoiceTemplate.logoUploadDescription')}
                                            </p>
                                        </div>
                                        {(filePreview || settings.logo_url) && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                    {filePreview ? 'Selected Logo:' : 'Current Logo:'}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={filePreview || settings.logo_url || ''} 
                                                            alt="Company Logo" 
                                                            className="max-w-32 max-h-32 object-contain"
                                                            style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <button
                                                            type="button"
                                                            onClick={filePreview ? handleRemoveFile : () => updateSetting('logo_url', '')}
                                                            className="text-sm text-red-600 dark:text-red-400 font-medium"
                                                        >
                                                            {filePreview ? 'Remove Selection' : t('settings.invoiceTemplate.removeLogo')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_width" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.logoWidth')} ({settings.logo_width}px)</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="range"
                                                min="50"
                                                max="200"
                                                step="5"
                                                value={settings.logo_width}
                                                onChange={(e) => updateSetting('logo_width', parseInt(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-center">{settings.logo_width}px</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_height" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.logoHeight')} ({settings.logo_height}px)</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="range"
                                                min="50"
                                                max="200"
                                                step="5"
                                                value={settings.logo_height}
                                                onChange={(e) => updateSetting('logo_height', parseInt(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-center">{settings.logo_height}px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
                <Card className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-gray-900 dark:text-white">{t('settings.invoiceTemplate.companySettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_title" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.companyTitle')}</Label>
                                    <Input
                                        id="company_title"
                                        value={settings.company_title}
                                        onChange={(e) => updateSetting('company_title', e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.companyName')}</Label>
                                    <Input
                                        id="company_name"
                                        value={settings.company_name}
                                        onChange={(e) => updateSetting('company_name', e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_address" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.companyAddress')}</Label>
                                <Input
                                    id="company_address"
                                    value={settings.company_address || ''}
                                    onChange={(e) => updateSetting('company_address', e.target.value)}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_phone_1" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.primaryPhone')}</Label>
                                    <Input
                                        id="company_phone_1"
                                        value={settings.company_phone_1 || ''}
                                        onChange={(e) => updateSetting('company_phone_1', e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_phone_2" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.secondaryPhone')}</Label>
                                    <Input
                                        id="company_phone_2"
                                        value={settings.company_phone_2 || ''}
                                        onChange={(e) => updateSetting('company_phone_2', e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_email" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.companyEmail')}</Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={settings.company_email || ''}
                                        onChange={(e) => updateSetting('company_email', e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_website" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.companyWebsite')}</Label>
                                    <Input
                                        id="company_website"
                                        value={settings.company_website || ''}
                                        onChange={(e) => updateSetting('company_website', e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* Content Tab */}
            {activeTab === 'content' && (
                <Card className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-gray-900 dark:text-white">{t('settings.invoiceTemplate.contentSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <Label htmlFor="show_company_info" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.showCompanyInfo')}</Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Display company information on invoice</p>
                                </div>
                                <input
                                    id="show_company_info"
                                    type="checkbox"
                                    checked={settings.show_company_info}
                                    onChange={(e) => updateSetting('show_company_info', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <Label htmlFor="show_date_time" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.invoiceTemplate.showDateTime')}</Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Display date and time on invoice</p>
                                </div>
                                <input
                                    id="show_date_time"
                                    type="checkbox"
                                    checked={settings.show_date_time}
                                    onChange={(e) => updateSetting('show_date_time', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
