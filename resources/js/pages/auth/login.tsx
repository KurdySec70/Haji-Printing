import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, User, Lock, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAssetPath } from '@/hooks/useAssetPath';
import { AnimatedBackground } from '@/components/welcome/AnimatedBackground';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

interface LoginFormData {
    username: string;
    password: string;
    remember: boolean;
}


interface FormErrors {
    username?: string;
    password?: string;
}

export default function Login({ status }: LoginProps) {
    const { t } = useTranslation();
    const { getLogoUrl } = useAssetPath();
    
    // Form state management
    const [loginData, setLoginData] = useState<LoginFormData>({
        username: '',
        password: '',
        remember: true,
    });
    
    const [isActive] = useState<boolean>(false);

    // Optimized handlers with useCallback
    const handleLoginChange = useCallback((field: keyof LoginFormData) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = field === 'remember' ? e.target.checked : e.target.value;
            setLoginData(prev => ({ ...prev, [field]: value }));
        }, []
    );


    // const toggleForm = useCallback(() => {
    //     setIsActive(prev => !prev);
    // }, []);

    const handleFormSubmit = useCallback(() => {
        // Form submission logic will be handled by Inertia
    }, []);

    // Reusable input class for consistency
    const inputClassName = "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200/60 dark:border-gray-600/60 my-2 py-4 px-4 pl-12 text-base rounded-xl w-full outline-none focus:ring-4 focus:ring-[#F58E18]/20 focus:border-[#F58E18] transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-700/90 hover:border-gray-300/80 dark:hover:border-gray-500/80 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:shadow-lg";
    
    const buttonClassName = "group relative overflow-hidden bg-gradient-to-r from-[#F58E18] to-[#EA580C] text-white text-base py-4 px-4 border-0 rounded-xl font-semibold tracking-wide uppercase mt-2 cursor-pointer hover:from-[#EA580C] hover:to-[#DC2626] transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-[#F58E18]/20 w-full";

    return (
        <>
            <Head title={`${t('auth.login.title')} - ${t('app.name')}`} />
            
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                <AnimatedBackground />

                {/* Back to Home Button */}
                <Link 
                    href="/" 
                    className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/30"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('auth.backToHome')}</span>
                </Link>

                {/* Main Container */}
                <div className="relative bg-white dark:bg-[#1c1917] rounded-3xl shadow-2xl w-full max-w-4xl min-h-[600px] overflow-hidden border border-gray-200 dark:border-0">
                    
                    {/* Login Form Container - Full width on mobile, half width on desktop */}
                    <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out ${
                        isActive 
                            ? 'left-0 w-1/2 opacity-0 z-[1] transform -translate-x-full' 
                            : 'left-0 w-1/2 opacity-100 z-[5]'
                    } md:left-0 md:w-1/2 md:opacity-100 md:z-[5] md:transform-none w-full md:w-1/2`}>
                        <div className="bg-white dark:bg-[#1c1917] flex items-center justify-center flex-col px-8 sm:px-16 h-full">
                            {/* Mobile Logo - Only visible on mobile screens */}
                            <div className="md:hidden mb-6 flex justify-center">
                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-600">
                                    <img
                                        src={getLogoUrl()}
                                        alt="Haji Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            
        <Form
            method="post"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={loginData as any}
            onSubmit={handleFormSubmit}
            className="w-full max-w-sm"
        >
                                {({ processing, errors }: { processing: boolean; errors: FormErrors }) => (
                                    <>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                            {t('auth.login.title')}
                                        </h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                            {t('auth.loginSubtitle')}
                                        </p>
                                        
                                        {/* Status Message */}
                                        {status && (
                                            <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                                {status}
                                            </div>
                                        )}
                                        
                                        {/* Username Input */}
                                        <div className="w-full mb-4">
                                            <div className="relative group">
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    value={loginData.username}
                                                    onChange={handleLoginChange('username')}
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    placeholder={t('auth.username')}
                                                    className={inputClassName}
                                                    autoComplete="username"
                                                />
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#F58E18] transition-colors duration-300" />
                                            </div>
                                            <InputError message={errors.username} />
                                        </div>

                                        {/* Password Input */}
                                        <div className="w-full mb-4">
                                            <div className="relative group">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={loginData.password}
                                                    onChange={handleLoginChange('password')}
                                                    required
                                                    tabIndex={2}
                                                    placeholder={t('auth.password')}
                                                    className={inputClassName}
                                                    autoComplete="current-password"
                                                />
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#F58E18] transition-colors duration-300" />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me Checkbox */}
                                        <div className="w-full mb-4">
                                            <label className="flex items-center cursor-pointer group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="remember"
                                                        checked={loginData.remember}
                                                        onChange={handleLoginChange('remember')}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                                                        loginData.remember 
                                                            ? 'bg-gradient-to-r from-[#F58E18] to-[#EA580C] border-transparent shadow-lg' 
                                                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 group-hover:border-[#F58E18] group-hover:shadow-sm'
                                                    }`}>
                                                        {loginData.remember && (
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="ml-3 text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200">
                                                    {t('auth.rememberMe')}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Login Button */}
                                        <Button 
                                            type="submit" 
                                            className={buttonClassName}
                                            tabIndex={3} 
                                            disabled={processing}
                                        >
                                            {/* Button Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#F58E18] to-[#EA580C] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#F58E18]/20 to-[#EA580C]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <span className="relative z-10 flex items-center justify-center">
                                                {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                                                {t('auth.loginButton')}
                                            </span>
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>


                    {/* Toggle Container - Hidden on mobile, visible on desktop */}
                    <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[1000] hidden md:block ${
                        isActive 
                            ? 'transform -translate-x-full rounded-[0_150px_100px_0]' 
                            : 'rounded-[150px_0_0_100px]'
                    }`}>
                        <div className={`bg-gradient-to-r from-[#F58E18] to-[#EA580C] text-white relative -left-full h-full w-[200%] transform transition-all duration-700 ease-in-out ${
                            isActive 
                                ? 'translate-x-1/2' 
                                : 'translate-x-0'
                        }`}>
                            
                             {/* Toggle Left Panel */}
                             <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transform transition-all duration-700 ease-in-out ${
                                 isActive 
                                     ? 'translate-x-0' 
                                     : '-translate-x-[200%]'
                             }`}>
                                 <div className="text-white">
                                     <h1 className="text-3xl font-bold mb-6">
                                         {t('auth.login.welcome.hello')}
                                     </h1>
                                     <p className="text-lg leading-6 tracking-[0.3px] mb-8 opacity-90">
                                         {t('auth.login.welcome.premiumServices')}
                                     </p>
                                     <div className="space-y-4 text-sm opacity-80">
                                         <div className="flex items-center justify-center gap-3">
                                             <div className="w-2 h-2 bg-white rounded-full"></div>
                                             <span>{t('auth.login.welcome.features.highQuality')}</span>
                                         </div>
                                         <div className="flex items-center justify-center gap-3">
                                             <div className="w-2 h-2 bg-white rounded-full"></div>
                                             <span>{t('auth.login.welcome.features.professionalResults')}</span>
                                         </div>
                                         <div className="flex items-center justify-center gap-3">
                                             <div className="w-2 h-2 bg-white rounded-full"></div>
                                             <span>{t('auth.login.welcome.features.fastReliable')}</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Toggle Right Panel */}
                             <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 right-0 transform transition-all duration-700 ease-in-out ${
                                 isActive 
                                     ? 'translate-x-[200%]' 
                                     : 'translate-x-0'
                             }`}>
                                 <div className="text-white">
                                     <h1 className="text-3xl font-bold mb-6">
                                         {t('auth.login.welcome.title')}
                                     </h1>
                                     <p className="text-lg leading-6 tracking-[0.3px] mb-8 opacity-90">
                                         {t('auth.login.welcome.subtitle')}
                                     </p>
                                 </div>
                             </div>

                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('auth.login.footer')}
                </p>
            </div>
        </>
    );
}