/**
 * @fileoverview Custom hook for responsive breakpoint detection
 * 
 * Provides a React hook that tracks window dimensions and determines the current
 * device type (mobile, tablet, desktop) based on configurable breakpoints.
 * This enables responsive behavior in components and layouts.
 * 
 * @since 1.0.0
 */

import { useState, useEffect } from 'react';

/**
 * Responsive breakpoints configuration in pixels
 * 
 * Defines the minimum width thresholds for each device type:
 * - mobile: < 768px
 * - tablet: 768px - 1023px
 * - desktop: ≥ 1024px
 * 
 * @readonly
 * @since 1.0.0
 */
export const BREAKPOINTS = {
    /** Mobile devices maximum width */
    mobile: 768,
    /** Tablet devices maximum width */
    tablet: 1024,
    /** Desktop devices minimum width */
    desktop: 1200,
} as const;

/**
 * Device type classification based on screen width
 * 
 * @since 1.0.0
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Window size dimensions
 * 
 * Represents current browser window dimensions in pixels.
 */
export interface WindowSize {
    /** Current window inner width in pixels */
    width: number;
    /** Current window inner height in pixels */
    height: number;
}

/**
 * Return type for useResponsive hook
 * 
 * Provides device type classification and responsive state information.
 */
export interface UseResponsiveReturn {
    /** Current device type classification */
    deviceType: DeviceType;
    /** Current window dimensions */
    windowSize: WindowSize;
    /** True if current device is mobile */
    isMobile: boolean;
    /** True if current device is tablet */
    isTablet: boolean;
    /** True if current device is desktop */
    isDesktop: boolean;
}

/**
 * Determines device type based on window width
 * 
 * Classifies the device type according to the defined breakpoints:
 * - Width < 768px: mobile
 * - Width >= 768px and < 1024px: tablet  
 * - Width >= 1024px: desktop
 * 
 * @param width - Window inner width in pixels
 * @returns The classified device type
 * @since 1.0.0
 */
const getDeviceType = (width: number): DeviceType => {
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
};

/**
 * Custom hook for responsive behavior and device detection
 * 
 * Tracks window dimensions and provides device type classification
 * with helper flags. Automatically updates on window resize with
 * proper cleanup of event listeners.
 * 
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { deviceType, isMobile, windowSize } = useResponsive();
 *   
 *   return (
 *     <div>
 *       <p>Device: {deviceType}</p>
 *       <p>Size: {windowSize.width}x{windowSize.height}</p>
 *       {isMobile && <MobileMenu />}
 *       {!isMobile && <DesktopMenu />}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Using in layout components
 * function MainLayout() {
 *   const { isTablet, isDesktop } = useResponsive();
 *   
 *   return (
 *     <Layout>
 *       <Sidebar collapsed={!isDesktop} />
 *       <Content style={{ marginLeft: isDesktop ? 240 : 0 }} />
 *     </Layout>
 *   );
 * }
 * ```
 * 
 * @returns Object containing device type, dimensions, and helper flags
 * @since 1.0.0
 */
export const useResponsive = (): UseResponsiveReturn => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
    });

    const deviceType = getDeviceType(windowSize.width);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        /**
         * Window resize event handler
         * 
         * Updates window size state when the browser window is resized.
         * Debouncing is handled by React's state batching.
         */
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        deviceType,
        windowSize,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
    };
};

export default useResponsive;