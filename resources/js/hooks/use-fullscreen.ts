import { useState, useEffect, useCallback } from 'react';

export function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                const element = document.documentElement;
                if (element.requestFullscreen) {
                    await element.requestFullscreen();
                } else if ((element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
                    await (element as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
                } else if ((element as HTMLElement & { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
                    await (element as HTMLElement & { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
                } else if ((element as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
                    await (element as HTMLElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
                    await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
                } else if ((document as Document & { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
                    await (document as Document & { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
                } else if ((document as Document & { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
                    await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
                }
            }
        } catch {
            // Ignore fullscreen errors
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            // Handle F11 key
            if (event.key === 'F11') {
                event.preventDefault();
                toggleFullscreen();
            }
        };

        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // Listen for F11 key
        document.addEventListener('keydown', handleKeyDown);

        // Check initial state
        handleFullscreenChange();

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [toggleFullscreen]);

    return {
        isFullscreen,
        toggleFullscreen,
    };
}