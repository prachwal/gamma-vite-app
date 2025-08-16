/**
 * @fileoverview Global type definitions and interfaces for the application
 * 
 * Contains all shared TypeScript interfaces and type definitions used
 * throughout the application. Includes theme configuration, language
 * settings, application state, and navigation structures.
 * 
 * @since 1.0.0
 */

/**
 * Available theme types for the application
 * 
 * Supports light and dark theme modes with CSS custom properties
 * for consistent styling across components.
 * 
 * @since 1.0.0
 */
export type Theme = 'light' | 'dark';

/**
 * Available language types for internationalization
 * 
 * Supports English and Polish languages with i18next integration
 * and HTTP-based translation loading.
 * 
 * @since 1.0.0
 */
export type Language = 'en' | 'pl';

/**
 * Global application state interface
 * 
 * Defines the structure of the Redux store's app slice containing
 * user preferences and UI state.
 * 
 * @since 1.0.0
 */
export interface AppState {
    /** Current theme setting (light/dark) */
    theme: Theme;
    /** Current language setting (en/pl) */
    language: Language;
    /** Sidebar collapse state for responsive layout */
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
    children?: NavigationItem[];
}

/**
 * Layout breakpoints
 */
export interface LayoutBreakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
}

// AI types
export type * from './ai';
