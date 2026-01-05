import React from 'react';
import { Head } from '@inertiajs/react';
import { Home } from 'lucide-react';

interface Error404Props {
    message?: string;
}

export default function Error404({ message = "Page not found" }: Error404Props) {
    return (
        <>
            <Head title="404 - Page Not Found" />
            
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        404
                    </h1>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        {message}
                    </p>
                    
                    <button
                        onClick={() => window.location.href = '/'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg"
                    >
                        <Home className="w-5 h-5" />
                        <span>Go Home</span>
                    </button>
                </div>
            </div>
        </>
    );
}
