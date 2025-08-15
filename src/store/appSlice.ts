/**
 * @fileoverview Redux slice for application state management
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Language, AppState } from '../types';

/**
 * Get initial theme from localStorage or system preference
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
 * Get initial language from localStorage or browser preference
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
 * Initial application state
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
