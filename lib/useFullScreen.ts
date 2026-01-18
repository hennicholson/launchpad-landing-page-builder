"use client";

import { useState, useEffect, useCallback } from 'react';

const FULLSCREEN_STORAGE_KEY = 'launchpad-fullscreen-preference';

export interface UseFullScreenReturn {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  enterFullScreen: () => void;
  exitFullScreen: () => void;
  isSupported: boolean;
}

/**
 * Hook for managing browser fullscreen mode
 * Uses the native Fullscreen API to expand beyond Whop's iframe container
 */
export function useFullScreen(): UseFullScreenReturn {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if fullscreen is supported on mount
  useEffect(() => {
    const supported =
      typeof document !== 'undefined' &&
      (document.fullscreenEnabled ||
        (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
        (document as unknown as { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled ||
        (document as unknown as { msFullscreenEnabled?: boolean }).msFullscreenEnabled);

    setIsSupported(!!supported);
  }, []);

  // Listen for fullscreen changes (including user pressing Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen =
        document.fullscreenElement != null ||
        (document as unknown as { webkitFullscreenElement?: Element | null }).webkitFullscreenElement != null ||
        (document as unknown as { mozFullScreenElement?: Element | null }).mozFullScreenElement != null ||
        (document as unknown as { msFullscreenElement?: Element | null }).msFullscreenElement != null;

      setIsFullScreen(isCurrentlyFullscreen);

      // Persist preference to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(FULLSCREEN_STORAGE_KEY, JSON.stringify(isCurrentlyFullscreen));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Request fullscreen
  const enterFullScreen = useCallback(async () => {
    if (!isSupported) return;

    const element = document.documentElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (element as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((element as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
        await (element as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
      } else if ((element as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (element as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, [isSupported]);

  // Exit fullscreen
  const exitFullScreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ((document as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
        await (document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
      } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
        await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  // Toggle fullscreen
  const toggleFullScreen = useCallback(() => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  }, [isFullScreen, enterFullScreen, exitFullScreen]);

  return {
    isFullScreen,
    toggleFullScreen,
    enterFullScreen,
    exitFullScreen,
    isSupported,
  };
}

/**
 * Keyboard shortcut for fullscreen toggle
 * Add this to your component's useEffect to enable Cmd/Ctrl + Shift + F
 */
export function useFullScreenKeyboardShortcut(
  toggleFullScreen: () => void
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + F
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullScreen]);
}
