import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            jsxImportSource: 'react',
        }),
        tailwindcss(),
    ],
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
    },
});
