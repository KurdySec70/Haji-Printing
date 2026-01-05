import React from 'react';
import { Head } from '@inertiajs/react';
import { Home } from 'lucide-react';

interface Error503Props {
    message?: string;
    retryAfter?: number;
}

export default function Error503({ message = "Service temporarily unavailable", retryAfter = 30 }: Error503Props) {
    return (
        <>
            <Head title="503 - Service Unavailable" />
            
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        503
                    </h1>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        {message}
                    </p>

                    {retryAfter > 0 && (
                        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Please try again in {retryAfter} seconds.
                            </p>
                        </div>
                    )}
                    
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
