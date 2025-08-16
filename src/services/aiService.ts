/**
 * @fileoverview AI API service
 * 
 * @since 1.0.0
 */

import type { AIProvider, AIModel, APIKeyEntry } from '../types/ai';
import { getProviderById } from './aiProviders';

/**
 * Debug logging for AI operations
 */
const debugLog = (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
        console.log(`[AI Service Debug] ${message}`, data || '');
    }
};

/**
 * Error logging for AI operations
 */
const errorLog = (message: string, error: unknown, context?: unknown) => {
    console.error(`[AI Service Error] ${message}`, {
        error,
        context,
        timestamp: new Date().toISOString(),
    });
};
const STORAGE_KEYS = {
    API_KEYS: 'gamma_ai_keys',
    MODELS: 'gamma_ai_models',
} as const;

/**
 * Encrypt API key for storage (simple base64 for demo)
 */
const encryptKey = (key: string): string => {
    return btoa(key);
};

/**
 * Decrypt API key from storage
 */
const decryptKey = (encryptedKey: string): string => {
    try {
        return atob(encryptedKey);
    } catch {
        return '';
    }
};

/**
 * Save API key to localStorage
 */
export const saveApiKey = (provider: AIProvider, apiKey: string): void => {
    const keys = getStoredApiKeys();
    const entry: APIKeyEntry = {
        provider,
        apiKey: encryptKey(apiKey),
        addedAt: new Date().toISOString(),
        isVerified: false,
    };

    keys[provider] = entry;
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
};

/**
 * Get stored API keys
 */
export const getStoredApiKeys = (): Partial<Record<AIProvider, APIKeyEntry>> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.API_KEYS);
        const parsed = stored ? JSON.parse(stored) : {};
        // Ensure we always return an object, even if empty
        return parsed || {};
    } catch (error) {
        console.warn('Failed to retrieve stored API keys:', error);
        return {};
    }
};

/**
 * Get API key for provider
 */
export const getApiKey = (provider: AIProvider): string => {
    const keys = getStoredApiKeys();
    const entry = keys[provider];
    return entry ? decryptKey(entry.apiKey) : '';
};

/**
 * Remove API key for provider
 */
export const removeApiKey = (provider: AIProvider): void => {
    const keys = getStoredApiKeys();
    delete keys[provider];
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
};

/**
 * Verify API key with provider
 */
export const verifyApiKey = async (provider: AIProvider, apiKey: string): Promise<boolean> => {
    const config = getProviderById(provider);
    if (!config) {
        errorLog(`Provider config not found for: ${provider}`, null, { provider });
        return false;
    }

    debugLog(`Starting API key verification for ${provider}`, {
        provider,
        baseUrl: config.baseUrl,
        keyLength: apiKey.length
    });

    try {
        // Test endpoint varies by provider
        let testEndpoint = `${config.baseUrl}/models`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Set authorization header based on provider
        if (provider === 'anthropic') {
            headers['x-api-key'] = apiKey;
            headers['anthropic-version'] = '2023-06-01';
            testEndpoint = `${config.baseUrl}/messages`;
        } else {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        debugLog(`Making API request to ${provider}`, {
            endpoint: testEndpoint,
            method: provider === 'anthropic' ? 'POST' : 'GET',
            hasAuth: !!headers['Authorization'] || !!headers['x-api-key']
        });

        const response = await fetch(testEndpoint, {
            method: provider === 'anthropic' ? 'POST' : 'GET',
            headers,
            body: provider === 'anthropic' ? JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'test' }],
            }) : undefined,
        });

        debugLog(`API response from ${provider}`, {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
        });

        if (response.ok || response.status === 401) {
            // Mark as verified and save
            const keys = getStoredApiKeys();
            if (keys[provider]) {
                keys[provider].isVerified = response.ok;
                keys[provider].lastVerified = new Date().toISOString();
                localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
                debugLog(`Updated key verification status for ${provider}`, {
                    isVerified: response.ok,
                    lastVerified: keys[provider].lastVerified
                });
            }
            return response.ok;
        }

        errorLog(`Unexpected API response from ${provider}`, null, {
            status: response.status,
            statusText: response.statusText
        });
        return false;
    } catch (error) {
        errorLog(`Failed to verify API key for ${provider}`, error, {
            provider,
            endpoint: config.baseUrl,
            keyProvided: !!apiKey
        });
        return false;
    }
};

/**
 * Fetch available models for provider
 */
export const fetchModels = async (provider: AIProvider): Promise<AIModel[]> => {
    const config = getProviderById(provider);
    const apiKey = getApiKey(provider);

    if (!config || !apiKey) {
        errorLog(`Cannot fetch models for ${provider}`, null, {
            hasConfig: !!config,
            hasApiKey: !!apiKey,
            provider
        });
        return [];
    }

    debugLog(`Fetching models for ${provider}`, {
        provider,
        baseUrl: config.baseUrl,
        hasApiKey: !!apiKey
    });

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (provider === 'anthropic') {
            headers['x-api-key'] = apiKey;
            headers['anthropic-version'] = '2023-06-01';
        } else {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${config.baseUrl}/models`, { headers });

        debugLog(`Models API response from ${provider}`, {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            errorLog(`Models API error from ${provider}`, null, {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const models: AIModel[] = data.data?.map((model: { id: string; description?: string; context_length?: number; max_input_tokens?: number }) => ({
            id: model.id,
            name: model.id,
            description: model.description || '',
            contextLength: model.context_length || model.max_input_tokens,
            provider,
        })) || [];

        debugLog(`Successfully fetched ${models.length} models for ${provider}`, {
            modelCount: models.length,
            modelIds: models.slice(0, 5).map(m => m.id) // First 5 for preview
        });

        // Save models to localStorage
        const savedModels = getSavedModels();
        savedModels[provider] = models;
        localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(savedModels));

        return models;
    } catch (error) {
        errorLog(`Failed to fetch models for ${provider}`, error, {
            provider,
            endpoint: `${config.baseUrl}/models`
        });
        return [];
    }
};

/**
 * Get saved models from localStorage
 */
export const getSavedModels = (): Partial<Record<AIProvider, AIModel[]>> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.MODELS);
        const parsed = stored ? JSON.parse(stored) : {};
        // Ensure we always return an object, even if empty
        return parsed || {};
    } catch (error) {
        console.warn('Failed to retrieve saved models:', error);
        return {};
    }
};

/**
 * Clear all saved models
 */
export const clearSavedModels = (): void => {
    localStorage.removeItem(STORAGE_KEYS.MODELS);
};

/**
 * Clear all AI data
 */
export const clearAllAIData = (): void => {
    localStorage.removeItem(STORAGE_KEYS.API_KEYS);
    localStorage.removeItem(STORAGE_KEYS.MODELS);
};
