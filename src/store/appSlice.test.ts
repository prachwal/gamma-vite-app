/**
 * @fileoverview Tests for appSlice Redux slice
 * @since 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import appSlice, { setSidebarCollapsed, setTheme, setLanguage, toggleSidebar } from './appSlice';
import type { Theme, Language } from '../types';

describe('appSlice', () => {
    let store: Store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                app: appSlice,
            },
        });
    });

    describe('initial state', () => {
        it('should have correct initial state', () => {
            const state = store.getState().app;
            expect(state).toEqual({
                sidebarCollapsed: false,
                theme: 'light',
                language: 'en',
            });
        });
    });

    describe('setSidebarCollapsed action', () => {
        it('should set sidebar collapsed to true', () => {
            store.dispatch(setSidebarCollapsed(true));

            const state = store.getState().app;
            expect(state.sidebarCollapsed).toBe(true);
        });

        it('should set sidebar collapsed to false', () => {
            // First set it to true
            store.dispatch(setSidebarCollapsed(true));
            // Then set it to false
            store.dispatch(setSidebarCollapsed(false));

            const state = store.getState().app;
            expect(state.sidebarCollapsed).toBe(false);
        });
    });

    describe('toggleSidebar action', () => {
        it('should toggle sidebar from collapsed to expanded', () => {
            // Initially false
            expect(store.getState().app.sidebarCollapsed).toBe(false);

            // Toggle to true
            store.dispatch(toggleSidebar());
            expect(store.getState().app.sidebarCollapsed).toBe(true);
        });

        it('should toggle sidebar from expanded to collapsed', () => {
            // Set to true first
            store.dispatch(setSidebarCollapsed(true));
            expect(store.getState().app.sidebarCollapsed).toBe(true);

            // Toggle to false
            store.dispatch(toggleSidebar());
            expect(store.getState().app.sidebarCollapsed).toBe(false);
        });

        it('should toggle multiple times correctly', () => {
            const initialState = store.getState().app.sidebarCollapsed;

            store.dispatch(toggleSidebar());
            expect(store.getState().app.sidebarCollapsed).toBe(!initialState);

            store.dispatch(toggleSidebar());
            expect(store.getState().app.sidebarCollapsed).toBe(initialState);
        });
    });

    describe('setTheme action', () => {
        it('should set theme to dark', () => {
            const theme: Theme = 'dark';
            store.dispatch(setTheme(theme));

            const state = store.getState().app;
            expect(state.theme).toBe(theme);
        });

        it('should set theme to light', () => {
            const theme: Theme = 'light';
            store.dispatch(setTheme(theme));

            const state = store.getState().app;
            expect(state.theme).toBe(theme);
        });

        it('should switch themes correctly', () => {
            // Start with light
            expect(store.getState().app.theme).toBe('light');

            // Switch to dark
            store.dispatch(setTheme('dark'));
            expect(store.getState().app.theme).toBe('dark');

            // Switch back to light
            store.dispatch(setTheme('light'));
            expect(store.getState().app.theme).toBe('light');
        });
    });

    describe('setLanguage action', () => {
        it('should set language to Polish', () => {
            const language: Language = 'pl';
            store.dispatch(setLanguage(language));

            const state = store.getState().app;
            expect(state.language).toBe(language);
        });

        it('should set language to English', () => {
            const language: Language = 'en';
            store.dispatch(setLanguage(language));

            const state = store.getState().app;
            expect(state.language).toBe(language);
        });

        it('should switch languages correctly', () => {
            // Start with English
            expect(store.getState().app.language).toBe('en');

            // Switch to Polish
            store.dispatch(setLanguage('pl'));
            expect(store.getState().app.language).toBe('pl');

            // Switch back to English
            store.dispatch(setLanguage('en'));
            expect(store.getState().app.language).toBe('en');
        });
    });

    describe('reducer behavior', () => {
        it('should handle unknown actions gracefully', () => {
            const initialState = store.getState().app;

            // Dispatch an unknown action
            store.dispatch({ type: 'unknown/action' });

            const newState = store.getState().app;
            expect(newState).toEqual(initialState);
        });

        it('should not mutate state directly', () => {
            const initialState = store.getState().app;

            // Dispatch multiple actions
            store.dispatch(setSidebarCollapsed(true));
            store.dispatch(setTheme('dark'));
            store.dispatch(setLanguage('pl'));

            const newState = store.getState().app;

            // States should be different objects
            expect(newState).not.toBe(initialState);
            expect(newState.sidebarCollapsed).toBe(true);
            expect(newState.theme).toBe('dark');
            expect(newState.language).toBe('pl');
        });

        it('should maintain independent state properties', () => {
            // Change sidebar state
            store.dispatch(setSidebarCollapsed(true));
            let state = store.getState().app;
            expect(state.sidebarCollapsed).toBe(true);
            expect(state.theme).toBe('light'); // Should remain unchanged
            expect(state.language).toBe('en'); // Should remain unchanged

            // Change theme
            store.dispatch(setTheme('dark'));
            state = store.getState().app;
            expect(state.sidebarCollapsed).toBe(true); // Should remain unchanged
            expect(state.theme).toBe('dark');
            expect(state.language).toBe('en'); // Should remain unchanged

            // Change language
            store.dispatch(setLanguage('pl'));
            state = store.getState().app;
            expect(state.sidebarCollapsed).toBe(true); // Should remain unchanged
            expect(state.theme).toBe('dark'); // Should remain unchanged
            expect(state.language).toBe('pl');
        });
    });

    describe('state structure validation', () => {
        it('should have required state properties', () => {
            const state = store.getState().app;

            expect(state).toHaveProperty('sidebarCollapsed');
            expect(state).toHaveProperty('theme');
            expect(state).toHaveProperty('language');
        });

        it('should have correct property types', () => {
            const state = store.getState().app;

            expect(typeof state.sidebarCollapsed).toBe('boolean');
            expect(typeof state.theme).toBe('string');
            expect(typeof state.language).toBe('string');
        });
    });
});
