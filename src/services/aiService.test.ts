/**
 * @fileoverview AI service tests
 * 
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    saveApiKey,
    getStoredApiKeys,
    getApiKey,
    removeApiKey,
    verifyApiKey,
    getSavedModels,
    clearAllAIData,
} from './aiService';
import type { AIProvider } from '../types/ai';

// Mock fetch
global.fetch = vi.fn();

describe('aiService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        clearAllAIData();
    });

    describe('API key management', () => {
        it('should save and retrieve API key', () => {
            const provider: AIProvider = 'openai';
            const apiKey = 'sk-test123';

            saveApiKey(provider, apiKey);
            const retrievedKey = getApiKey(provider);

            expect(retrievedKey).toBe(apiKey);
        });

        it('should store encrypted API key', () => {
            const provider: AIProvider = 'openai';
            const apiKey = 'sk-test123';

            saveApiKey(provider, apiKey);
            const keys = getStoredApiKeys();

            expect(keys[provider]?.apiKey).not.toBe(apiKey);
            expect(keys[provider]?.provider).toBe(provider);
            expect(keys[provider]?.isVerified).toBe(false);
        });

        it('should remove API key', () => {
            const provider: AIProvider = 'openai';
            const apiKey = 'sk-test123';

            saveApiKey(provider, apiKey);
            expect(getApiKey(provider)).toBe(apiKey);

            removeApiKey(provider);
            expect(getApiKey(provider)).toBe('');
        });

        it('should handle missing API key', () => {
            const provider: AIProvider = 'openai';
            const retrievedKey = getApiKey(provider);

            expect(retrievedKey).toBe('');
        });
    });

    describe('API key verification', () => {
        it('should verify OpenAI API key successfully', async () => {
            const mockFetch = vi.mocked(fetch);
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
            } as Response);

            const result = await verifyApiKey('openai', 'sk-test123');

            expect(result).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.openai.com/v1/models',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer sk-test123',
                    }),
                })
            );
        });

        it('should verify Anthropic API key with different format', async () => {
            const mockFetch = vi.mocked(fetch);
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
            } as Response);

            const result = await verifyApiKey('anthropic', 'sk-ant-test123');

            expect(result).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.anthropic.com/v1/messages',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'x-api-key': 'sk-ant-test123',
                        'anthropic-version': '2023-06-01',
                    }),
                })
            );
        });

        it('should handle verification failure', async () => {
            const mockFetch = vi.mocked(fetch);
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                headers: new Headers(),
            } as Response);

            const result = await verifyApiKey('openai', 'invalid-key');

            expect(result).toBe(false);
        });

        it('should handle network error', async () => {
            const mockFetch = vi.mocked(fetch);
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await verifyApiKey('openai', 'sk-test123');

            expect(result).toBe(false);
        });
    });

    describe('Model management', () => {
        it('should handle empty models storage', () => {
            const models = getSavedModels();
            expect(models).toEqual({});
        });

        it('should handle corrupted storage', () => {
            localStorage.setItem('gamma_ai_models', 'invalid-json');
            const models = getSavedModels();
            expect(models).toEqual({});
        });
    });

    describe('Data cleanup', () => {
        it('should clear all AI data', () => {
            saveApiKey('openai', 'sk-test123');
            localStorage.setItem('gamma_ai_models', '{"openai": []}');

            clearAllAIData();

            expect(localStorage.getItem('gamma_ai_keys')).toBeNull();
            expect(localStorage.getItem('gamma_ai_models')).toBeNull();
        });
    });
});
