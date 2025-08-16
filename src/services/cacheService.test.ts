/**
 * @fileoverview Tests for cacheService
 * 
 * @since 1.0.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    cacheModels,
    getCachedModels,
    getAllCachedModels,
    needsModelRefresh,
    clearModelsCache,
    initializeCacheWithDefaults
} from './cacheService';
import type { AIModel } from '../types/ai';

// Mock DEFAULT_MODELS
vi.mock('./defaultModels', () => ({
    DEFAULT_MODELS: {
        openai: [
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                provider: 'openai',
                description: 'Test model',
                capabilities: ['function_calling'],
                contextLength: 128000,
                inputCostPerMillion: 5.0,
                outputCostPerMillion: 15.0,
                maxOutputTokens: 16384
            }
        ],
        anthropic: [
            {
                id: 'claude-3-5-sonnet',
                name: 'Claude 3.5 Sonnet',
                provider: 'anthropic',
                description: 'Test Anthropic model',
                capabilities: ['vision'],
                contextLength: 200000,
                inputCostPerMillion: 3.0,
                outputCostPerMillion: 15.0,
                maxOutputTokens: 8192
            }
        ]
    }
}));

describe('cacheService', () => {
    const mockModels: AIModel[] = [
        {
            id: 'test-model',
            name: 'Test Model',
            provider: 'test-provider',
            description: 'Test model for testing',
            capabilities: ['function_calling'],
            contextLength: 4096,
            inputCostPerMillion: 1.0,
            outputCostPerMillion: 2.0
        }
    ];

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('cacheModels', () => {
        it('should cache models successfully', () => {
            cacheModels('test-provider', mockModels);

            const cached = getCachedModels('test-provider');
            expect(cached).toEqual(mockModels);
        });

        it('should handle empty models array', () => {
            cacheModels('test-provider', []);

            const cached = getCachedModels('test-provider');
            expect(cached).toEqual([]);
        });
    });

    describe('getCachedModels', () => {
        it('should return null for non-existent provider', () => {
            const cached = getCachedModels('non-existent');
            expect(cached).toBeNull();
        });

        it('should return cached models for existing provider', () => {
            cacheModels('test-provider', mockModels);

            const cached = getCachedModels('test-provider');
            expect(cached).toEqual(mockModels);
        });

        it('should return null for expired cache', () => {
            // Mock Date.now to simulate expired cache
            const originalNow = Date.now;
            Date.now = vi.fn(() => 1000000);

            cacheModels('test-provider', mockModels);

            // Advance time by 25 hours
            Date.now = vi.fn(() => 1000000 + 25 * 60 * 60 * 1000);

            const cached = getCachedModels('test-provider');
            expect(cached).toBeNull();

            // Restore original Date.now
            Date.now = originalNow;
        });
    });

    describe('getAllCachedModels', () => {
        it('should return empty object when no models cached', () => {
            const allCached = getAllCachedModels();
            expect(allCached).toEqual({});
        });

        it('should return all cached models', () => {
            const models1 = [{ ...mockModels[0], id: 'model1' }];
            const models2 = [{ ...mockModels[0], id: 'model2' }];

            cacheModels('provider1', models1);
            cacheModels('provider2', models2);

            const allCached = getAllCachedModels();
            expect(allCached).toEqual({
                provider1: models1,
                provider2: models2
            });
        });

        it('should exclude expired models', () => {
            const originalNow = Date.now;
            Date.now = vi.fn(() => 1000000);

            // Cache expired provider first (older timestamp)
            cacheModels('expired-provider', mockModels);

            // Advance time by 25 hours
            Date.now = vi.fn(() => 1000000 + 25 * 60 * 60 * 1000);

            // Cache fresh provider at current time (newer timestamp)
            cacheModels('fresh-provider', mockModels);

            // Check - only fresh-provider should remain
            const allCached = getAllCachedModels();
            expect(allCached).toEqual({
                'fresh-provider': mockModels
            });

            Date.now = originalNow;
        });
    });

    describe('needsModelRefresh', () => {
        it('should return true for non-existent provider', () => {
            const needsRefresh = needsModelRefresh('non-existent');
            expect(needsRefresh).toBe(true);
        });

        it('should return false for fresh cache', () => {
            cacheModels('test-provider', mockModels);

            const needsRefresh = needsModelRefresh('test-provider');
            expect(needsRefresh).toBe(false);
        });

        it('should return true for expired cache', () => {
            const originalNow = Date.now;
            Date.now = vi.fn(() => 1000000);

            cacheModels('test-provider', mockModels);

            // Advance time by 25 hours
            Date.now = vi.fn(() => 1000000 + 25 * 60 * 60 * 1000);

            const needsRefresh = needsModelRefresh('test-provider');
            expect(needsRefresh).toBe(true);

            Date.now = originalNow;
        });
    });

    describe('clearModelsCache', () => {
        it('should clear all cached models', () => {
            cacheModels('provider1', mockModels);
            cacheModels('provider2', mockModels);

            expect(getAllCachedModels()).not.toEqual({});

            clearModelsCache();

            expect(getAllCachedModels()).toEqual({});
        });
    });

    describe('initializeCacheWithDefaults', () => {
        it('should initialize cache with default models when empty', () => {
            const allCached = getAllCachedModels();
            expect(allCached).toEqual({});

            initializeCacheWithDefaults();

            const afterInit = getAllCachedModels();
            expect(Object.keys(afterInit)).toContain('openai');
            expect(Object.keys(afterInit)).toContain('anthropic');
            expect(afterInit.openai).toBeDefined();
            expect(afterInit.anthropic).toBeDefined();
        });

        it('should not overwrite existing cache', () => {
            cacheModels('test-provider', mockModels);

            initializeCacheWithDefaults();

            const afterInit = getAllCachedModels();
            expect(afterInit['test-provider']).toEqual(mockModels);
        });

        it('should handle errors gracefully', () => {
            // Mock localStorage to throw error
            const originalGetItem = localStorage.getItem;
            localStorage.getItem = vi.fn().mockImplementation(() => {
                throw new Error('localStorage error');
            });

            // Should not throw
            expect(() => initializeCacheWithDefaults()).not.toThrow();

            // Restore
            localStorage.getItem = originalGetItem;
        });
    });
});
