import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables
    // const env = loadEnv(mode, process.cwd(), '');
    
    const isProduction = mode === 'production';
    
    // Determine the base path for assets
    const basePath = isProduction ? '/build/' : '/';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
                publicDirectory: 'public',
            }),
            react({
                jsxImportSource: 'react',
                babel: {
                    plugins: [],
                },
            }),
            tailwindcss(),
            // wayfinder({
            //     formVariants: true,
            //     generateOnBuild: false,
            // }),
        ],
        // Dynamic base URL based on environment
        base: basePath,
        define: {
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        },
        esbuild: {
            jsx: 'automatic',
            jsxImportSource: 'react',
        },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@inertiajs/react'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast', '@radix-ui/react-select', '@radix-ui/react-tabs'],
                    utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
                    i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
                    icons: ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        // Enable source maps for better debugging in production
        sourcemap: false,
        // Optimize for faster loading
        assetsInlineLimit: 4096,
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        hmr: {
            port: 5173,
            host: '127.0.0.1',
        },
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        fs: {
            strict: false,
        },
        watch: {
            usePolling: false,
        },
        strictPort: false,
        origin: 'http://127.0.0.1:5173',
    },
        preview: {
            host: 'localhost',
            port: 4173,
        },
    };
});
