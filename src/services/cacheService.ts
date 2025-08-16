/**
 * @fileoverview Local storage service for caching AI models and provider data
 * 
 * Provides caching functionality for AI models with automatic refresh
 * when data is older than 24 hours.
 * 
 * @since 1.0.0
 */

import type { AIModel } from '../types/ai';
import { DEFAULT_MODELS } from './defaultModels';

interface CachedData<T> {
    data: T;
    timestamp: number;
}

interface ModelCache {
    [providerId: string]: CachedData<AIModel[]>;
}

interface ProviderCache {
    [providerId: string]: CachedData<Record<string, unknown>>;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MODELS_CACHE_KEY = 'ai_models_cache';
const PROVIDERS_CACHE_KEY = 'ai_providers_cache';

/**
 * Check if cached data is still valid (less than 24 hours old)
 */
const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
};

/**
 * Cache models for a specific provider
 */
export const cacheModels = (providerId: string, models: AIModel[]): void => {
    try {
        const existingCache = localStorage.getItem(MODELS_CACHE_KEY);
        const cache: ModelCache = existingCache ? JSON.parse(existingCache) : {};

        cache[providerId] = {
            data: models,
            timestamp: Date.now(),
        };

        localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Failed to cache models:', error);
    }
};

/**
 * Get cached models for a specific provider
 */
export const getCachedModels = (providerId: string): AIModel[] | null => {
    try {
        const cacheData = localStorage.getItem(MODELS_CACHE_KEY);
        if (!cacheData) return null;

        const cache: ModelCache = JSON.parse(cacheData);
        const providerCache = cache[providerId];

        if (!providerCache || !isCacheValid(providerCache.timestamp)) {
            return null;
        }

        return providerCache.data;
    } catch (error) {
        console.error('Failed to get cached models:', error);
        return null;
    }
};

/**
 * Get all cached models from all providers
 */
export const getAllCachedModels = (): { [providerId: string]: AIModel[] } => {
    try {
        const cacheData = localStorage.getItem(MODELS_CACHE_KEY);
        if (!cacheData) return {};

        const cache: ModelCache = JSON.parse(cacheData);
        const result: { [providerId: string]: AIModel[] } = {};

        Object.entries(cache).forEach(([providerId, cachedData]) => {
            if (isCacheValid(cachedData.timestamp)) {
                result[providerId] = cachedData.data;
            }
        });

        return result;
    } catch (error) {
        console.error('Failed to get all cached models:', error);
        return {};
    }
};

/**
 * Check if models need refresh (cache is older than 24 hours or doesn't exist)
 */
export const needsModelRefresh = (providerId: string): boolean => {
    try {
        const cacheData = localStorage.getItem(MODELS_CACHE_KEY);
        if (!cacheData) return true;

        const cache: ModelCache = JSON.parse(cacheData);
        const providerCache = cache[providerId];

        return !providerCache || !isCacheValid(providerCache.timestamp);
    } catch (error) {
        console.error('Failed to check cache validity:', error);
        return true;
    }
};

/**
 * Clear models cache for a specific provider
 */
export const clearModelsCache = (providerId?: string): void => {
    try {
        if (!providerId) {
            localStorage.removeItem(MODELS_CACHE_KEY);
            return;
        }

        const cacheData = localStorage.getItem(MODELS_CACHE_KEY);
        if (!cacheData) return;

        const cache: ModelCache = JSON.parse(cacheData);
        delete cache[providerId];

        localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Failed to clear models cache:', error);
    }
};

/**
 * Cache provider details
 */
export const cacheProviderDetails = (providerId: string, details: Record<string, unknown>): void => {
    try {
        const existingCache = localStorage.getItem(PROVIDERS_CACHE_KEY);
        const cache: ProviderCache = existingCache ? JSON.parse(existingCache) : {};

        cache[providerId] = {
            data: details,
            timestamp: Date.now(),
        };

        localStorage.setItem(PROVIDERS_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Failed to cache provider details:', error);
    }
};

/**
 * Get cached provider details
 */
export const getCachedProviderDetails = (providerId: string): Record<string, unknown> | null => {
    try {
        const cacheData = localStorage.getItem(PROVIDERS_CACHE_KEY);
        if (!cacheData) return null;

        const cache: ProviderCache = JSON.parse(cacheData);
        const providerCache = cache[providerId];

        if (!providerCache || !isCacheValid(providerCache.timestamp)) {
            return null;
        }

        return providerCache.data;
    } catch (error) {
        console.error('Failed to get cached provider details:', error);
        return null;
    }
};

/**
 * Get cache age for a provider in hours
 */
export const getCacheAge = (providerId: string): number => {
    try {
        const cacheData = localStorage.getItem(MODELS_CACHE_KEY);
        if (!cacheData) return Infinity;

        const cache: ModelCache = JSON.parse(cacheData);
        const providerCache = cache[providerId];

        if (!providerCache) return Infinity;

        return (Date.now() - providerCache.timestamp) / (1000 * 60 * 60); // Convert to hours
    } catch (error) {
        console.error('Failed to get cache age:', error);
        return Infinity;
    }
};

/**
 * Initialize cache with default models if empty
 */
export const initializeCacheWithDefaults = (): void => {
    try {
        const existingCache = getAllCachedModels();
        const hasAnyModels = Object.keys(existingCache).length > 0;

        if (!hasAnyModels) {
            console.log('Initializing cache with default models');
            Object.entries(DEFAULT_MODELS).forEach(([providerId, models]) => {
                cacheModels(providerId, models);
            });
        }
    } catch (error) {
        console.error('Failed to initialize cache with defaults:', error);
    }
};
