/**
 * @fileoverview Redux slice for application state management
 * 
 * Manages global application state including theme, language preferences,
 * and UI state. Provides actions for theme toggling, language switching,
 * and sidebar collapse state with localStorage persistence.
 * 
 * @since 1.0.0
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Language, AppState } from '../types';

/**
 * Retrieves initial theme from localStorage or system preference
 * 
 * Checks localStorage first for saved theme preference, then falls back
 * to system preference via matchMedia API. Defaults to 'light' theme
 * on server-side rendering.
 * 
 * @returns The initial theme setting
 * @since 1.0.0
 */
const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme') as Theme;
        if (saved && ['light', 'dark'].includes(saved)) {
            return saved;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

/**
 * Retrieves initial language from localStorage or browser preference
 * 
 * Checks localStorage first for saved language preference, then falls back
 * to browser language detection. Supports 'en' and 'pl' languages with
 * 'pl' as default fallback.
 * 
 * @returns The initial language setting
 * @since 1.0.0
 */
const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('language') as Language;
        if (saved && ['en', 'pl'].includes(saved)) {
            return saved;
        }
        const browserLang = navigator.language.split('-')[0];
        return browserLang === 'pl' ? 'pl' : 'en';
    }
    return 'pl';
};

/**
 * Initial application state configuration
 * 
 * Defines the default state with preferences loaded from localStorage
 * or system defaults. Sidebar starts collapsed on mobile devices.
 * 
 * @since 1.0.0
 */
const initialState: AppState = {
    theme: getInitialTheme(),
    language: getInitialLanguage(),
    sidebarCollapsed: false,
};

/**
 * Application state slice
 */
export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        /**
         * Toggle between light and dark theme
         */
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.theme);
            }
        },

        /**
         * Set specific theme
         */
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.theme);
            }
        },

        /**
         * Set language
         */
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('language', state.language);
            }
        },

        /**
         * Toggle sidebar collapsed state
         */
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },

        /**
         * Set sidebar collapsed state
         */
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebarCollapsed = action.payload;
        },
    },
});

export const {
    toggleTheme,
    setTheme,
    setLanguage,
    toggleSidebar,
    setSidebarCollapsed
} = appSlice.actions;

export default appSlice.reducer;
