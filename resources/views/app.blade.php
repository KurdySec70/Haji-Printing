<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color - Pure white for light mode --}}
        <style>
            html {
                background-color: #ffffff !important;
            }

            html.dark {
                background-color: #0a0a0a !important;
            }

            body {
                background-color: #ffffff !important;
            }

            body.dark,
            html.dark body {
                background-color: #0a0a0a !important;
            }
        </style>

        <title inertia>{{ config('app.name', 'Haji Printing') }}</title>

        {{-- Use relative paths to avoid protocol/host mismatch in dev (http vs https) --}}
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">


        {{-- Vite will use build files in production (handled by AppServiceProvider) or dev server in development --}}
        @if(config('app.env') !== 'production')
            @viteReactRefresh
        @endif
        @vite(['resources/css/app.css', 'resources/js/app.tsx'], config('app.env') === 'production' ? 'build' : null)
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
