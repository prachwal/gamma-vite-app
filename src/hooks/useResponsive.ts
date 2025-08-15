/**
 * @fileoverview Custom hook for responsive breakpoints
 */

import { useState, useEffect } from 'react';

/**
 * Responsive breakpoints configuration
 */
export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
} as const;

/**
 * Device type based on screen width
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Get device type based on window width
 */
const getDeviceType = (width: number): DeviceType => {
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
};

/**
 * Custom hook for responsive behavior
 * @returns Current device type and window dimensions
 */
export const useResponsive = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
    });

    const deviceType = getDeviceType(windowSize.width);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        windowSize,
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
    };
};
