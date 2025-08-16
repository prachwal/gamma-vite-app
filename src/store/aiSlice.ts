/**
 * @fileoverview AI Redux slice
 * 
 * @since 1.0.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AIProvider, AIState } from '../types/ai';
import { AI_PROVIDERS } from '../services/aiProviders';
import { saveApiKey, verifyApiKey, fetchModels, getStoredApiKeys, getSavedModels } from '../services/aiService';

/**
 * Initial AI state
 */
const initialState: AIState = {
    providers: AI_PROVIDERS,
    models: {},
    apiKeys: {},
    selectedProvider: undefined,
    selectedModel: undefined,
    loading: {
        verifyingKey: false,
        fetchingModels: false,
    },
    errors: {},
};

/**
 * Verify API key async thunk
 */
export const verifyAPIKey = createAsyncThunk(
    'ai/verifyAPIKey',
    async ({ provider, apiKey }: { provider: AIProvider; apiKey: string }) => {
        const isValid = await verifyApiKey(provider, apiKey);
        if (isValid) {
            saveApiKey(provider, apiKey);
        }
        return { provider, isValid };
    }
);

/**
 * Fetch models async thunk
 */
export const fetchProviderModels = createAsyncThunk(
    'ai/fetchProviderModels',
    async (provider: AIProvider) => {
        const models = await fetchModels(provider);
        return { provider, models };
    }
);

/**
 * Load stored data async thunk
 */
export const loadStoredAIData = createAsyncThunk(
    'ai/loadStoredData',
    async () => {
        try {
            const keys = getStoredApiKeys() || {};
            const models = getSavedModels() || {};

            const apiKeysStatus: Record<string, boolean> = {};
            Object.entries(keys).forEach(([provider, entry]) => {
                if (entry && typeof entry.isVerified === 'boolean') {
                    apiKeysStatus[provider] = entry.isVerified;
                }
            });

            return { apiKeysStatus, models };
        } catch (error) {
            console.error('Failed to load stored AI data:', error);
            return { apiKeysStatus: {}, models: {} };
        }
    }
);

/**
 * AI slice
 */
const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        /**
         * Set selected provider
         */
        setSelectedProvider: (state, action: PayloadAction<AIProvider>) => {
            state.selectedProvider = action.payload;
            state.selectedModel = undefined; // Reset model selection
        },
        /**
         * Set selected model
         */
        setSelectedModel: (state, action: PayloadAction<string>) => {
            state.selectedModel = action.payload;
        },
        /**
         * Clear errors
         */
        clearErrors: (state) => {
            state.errors = {};
        },
        /**
         * Remove API key
         */
        removeAPIKey: (state, action: PayloadAction<AIProvider>) => {
            const provider = action.payload;
            delete state.apiKeys[provider];
            delete state.models[provider];
            if (state.selectedProvider === provider) {
                state.selectedProvider = undefined;
                state.selectedModel = undefined;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Verify API key
            .addCase(verifyAPIKey.pending, (state) => {
                state.loading.verifyingKey = true;
                delete state.errors.keyVerification;
            })
            .addCase(verifyAPIKey.fulfilled, (state, action) => {
                state.loading.verifyingKey = false;
                const { provider, isValid } = action.payload;
                state.apiKeys[provider] = isValid;
                if (!isValid) {
                    state.errors.keyVerification = `Invalid API key for ${provider}`;
                }
                // API key is already saved to localStorage by verifyAPIKey thunk
            })
            .addCase(verifyAPIKey.rejected, (state, action) => {
                state.loading.verifyingKey = false;
                state.errors.keyVerification = action.error.message || 'Failed to verify API key';
            })
            // Fetch models
            .addCase(fetchProviderModels.pending, (state) => {
                state.loading.fetchingModels = true;
                delete state.errors.modelFetching;
            })
            .addCase(fetchProviderModels.fulfilled, (state, action) => {
                state.loading.fetchingModels = false;
                const { provider, models } = action.payload;
                state.models[provider] = models;
                // Models are already saved to localStorage by fetchModels function
            })
            .addCase(fetchProviderModels.rejected, (state, action) => {
                state.loading.fetchingModels = false;
                state.errors.modelFetching = action.error.message || 'Failed to fetch models';
            })
            // Load stored data
            .addCase(loadStoredAIData.fulfilled, (state, action) => {
                const { apiKeysStatus, models } = action.payload || {};
                state.apiKeys = apiKeysStatus || {};
                state.models = models || {};
            })
            .addCase(loadStoredAIData.rejected, (_state, action) => {
                console.error('Failed to load stored AI data:', action.error);
                // Keep current state, don't overwrite with empty values
            });
    },
});

export const { setSelectedProvider, setSelectedModel, clearErrors, removeAPIKey } = aiSlice.actions;

export default aiSlice.reducer;
