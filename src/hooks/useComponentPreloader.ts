/**
 * @fileoverview Component preloading hook
 * 
 * Provides functionality to preload components for better UX
 * 
 * @since 1.0.0
 */

import { useEffect } from 'react';

/**
 * Preload component on hover/focus for better UX
 */
export const useComponentPreloader = () => {
    useEffect(() => {
        const preloadAIComponents = () => {
            // Preload AI section components when hovering over AI menu item
            import('../pages/ai-overview');
            import('../pages/chat');
            import('../pages/model-browser');
            import('../pages/provider-management');
        };

        // Add event listeners for preloading
        const aiMenuItems = document.querySelectorAll('[data-menu-id^="ai"]');

        const handleMouseEnter = () => {
            preloadAIComponents();
        };

        aiMenuItems.forEach(item => {
            item.addEventListener('mouseenter', handleMouseEnter, { once: true });
        });

        return () => {
            aiMenuItems.forEach(item => {
                item.removeEventListener('mouseenter', handleMouseEnter);
            });
        };
    }, []);
};

/**
 * Preload components imperatively
 */
export const preloadComponents = {
    aiSection: () => Promise.all([
        import('../pages/ai-overview'),
        import('../pages/chat'),
        import('../pages/model-browser'),
        import('../pages/provider-management')
    ]),

    chat: () => import('../pages/chat'),
    models: () => import('../pages/model-browser'),
    providers: () => import('../pages/provider-management')
};
