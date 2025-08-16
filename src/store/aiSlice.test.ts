/**
 * @fileoverview Tests for aiSlice Redux slice
 * @since 1.0.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import aiSlice, { setSelectedProvider, removeAPIKey } from './aiSlice';
import type { AIProvider } from '../types/ai';
import { AI_PROVIDERS } from '../services/aiProviders';

// Mock the aiService module
vi.mock('../services/aiService', () => ({
    verifyApiKey: vi.fn(),
    fetchModels: vi.fn(),
    saveApiKey: vi.fn(),
    getStoredApiKeys: vi.fn(),
    getSavedModels: vi.fn(),
}));

describe('aiSlice', () => {
    let store: Store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                ai: aiSlice,
            },
        });
        vi.clearAllMocks();
    });

    describe('initial state', () => {
        it('should have correct initial state', () => {
            const state = store.getState().ai;
            expect(state).toEqual({
                providers: AI_PROVIDERS,
                selectedProvider: undefined,
                selectedModel: undefined,
                apiKeys: {},
                models: {},
                loading: {
                    verifyingKey: false,
                    fetchingModels: false,
                },
                errors: {},
            });
        });

        it('should have all expected providers', () => {
            const state = store.getState().ai;
            const providerIds = state.providers.map((p: { id: string }) => p.id);
            expect(providerIds).toContain('openai');
            expect(providerIds).toContain('anthropic');
            expect(providerIds).toContain('xai');
            expect(providerIds).toContain('mistral');
            expect(providerIds).toContain('deepseek');
            expect(providerIds).toContain('groq');
            expect(providerIds).toContain('openrouter');
        });
    });

    describe('synchronous actions', () => {
        it('should set selected provider', () => {
            const provider: AIProvider = 'anthropic';
            store.dispatch(setSelectedProvider(provider));

            const state = store.getState().ai;
            expect(state.selectedProvider).toBe(provider);
        });

        it('should handle invalid provider selection gracefully', () => {
            const provider: AIProvider = 'openai';
            store.dispatch(setSelectedProvider(provider));

            const state = store.getState().ai;
            expect(state.selectedProvider).toBe(provider);
        });

        it('should remove API key', () => {
            const provider: AIProvider = 'openai';

            // Remove API key
            store.dispatch(removeAPIKey(provider));

            const state = store.getState().ai;
            expect(state.apiKeys[provider]).toBeUndefined();
        });

        it('should clear errors when clearing API key', () => {
            const provider: AIProvider = 'openai';

            // Remove API key should also clear any errors
            store.dispatch(removeAPIKey(provider));

            const state = store.getState().ai;
            expect(state.errors.keyVerification).toBeUndefined();
        });
    });

    describe('reducer behavior', () => {
        it('should handle unknown actions gracefully', () => {
            const initialState = store.getState().ai;

            // Dispatch an unknown action
            store.dispatch({ type: 'unknown/action' });

            const newState = store.getState().ai;
            expect(newState).toEqual(initialState);
        });

        it('should maintain provider list immutability', () => {
            const initialProviders = store.getState().ai.providers;

            store.dispatch(setSelectedProvider('openai'));

            const newProviders = store.getState().ai.providers;
            expect(newProviders).toBe(initialProviders); // Same reference
        });

        it('should reset to initial state correctly', () => {
            // Modify state
            store.dispatch(setSelectedProvider('anthropic'));

            // Get current state
            const state = store.getState().ai;
            expect(state.selectedProvider).toBe('anthropic');

            // Providers should still be there
            expect(state.providers).toEqual(AI_PROVIDERS);
        });
    });

    describe('state structure validation', () => {
        it('should have required state properties', () => {
            const state = store.getState().ai;

            expect(state).toHaveProperty('providers');
            expect(state).toHaveProperty('selectedProvider');
            expect(state).toHaveProperty('selectedModel');
            expect(state).toHaveProperty('apiKeys');
            expect(state).toHaveProperty('models');
            expect(state).toHaveProperty('loading');
            expect(state).toHaveProperty('errors');
        });

        it('should have correct loading state structure', () => {
            const state = store.getState().ai;

            expect(state.loading).toHaveProperty('verifyingKey');
            expect(state.loading).toHaveProperty('fetchingModels');
            expect(typeof state.loading.verifyingKey).toBe('boolean');
            expect(typeof state.loading.fetchingModels).toBe('boolean');
        });

        it('should initialize with empty objects for dynamic state', () => {
            const state = store.getState().ai;

            expect(state.apiKeys).toEqual({});
            expect(state.models).toEqual({});
            expect(state.errors).toEqual({});
        });
    });
});
