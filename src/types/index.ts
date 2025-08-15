/**
 * @fileoverview Global type definitions for the application
 */

/**
 * Available theme types
 */
export type Theme = 'light' | 'dark';

/**
 * Available language types
 */
export type Language = 'en' | 'pl';

/**
 * Application state interface
 */
export interface AppState {
    theme: Theme;
    language: Language;
    sidebarCollapsed: boolean;
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
    key: string;
    path: string;
    labelKey: string;
    icon?: React.ReactNode;
}

/**
 * Layout breakpoints
 */
export interface LayoutBreakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
}
