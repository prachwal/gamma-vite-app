/**
 * @fileoverview AI providers configuration tests
 * 
 * @since 1.0.0
 */

import { describe, it, expect } from 'vitest';
import { AI_PROVIDERS, getProviderById, getProviderIds } from './aiProviders';

describe('aiProviders', () => {
    describe('AI_PROVIDERS', () => {
        it('should contain all expected providers', () => {
            const expectedProviders = [
                'openrouter',
                'openai',
                'xai',
                'mistral',
                'deepseek',
                'groq',
                'anthropic',
            ];

            const providerIds = AI_PROVIDERS.map(p => p.id);
            expect(providerIds).toEqual(expect.arrayContaining(expectedProviders));
            expect(providerIds).toHaveLength(expectedProviders.length);
        });

        it('should have valid configuration for each provider', () => {
            AI_PROVIDERS.forEach(provider => {
                expect(provider).toMatchObject({
                    id: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    baseUrl: expect.any(String),
                    requiresApiKey: expect.any(Boolean),
                });

                expect(provider.baseUrl).toMatch(/^https?:\/\//);

                if (provider.keyFormat) {
                    expect(provider.keyFormat).toMatch(/\.\.\./);
                }

                if (provider.docsUrl) {
                    expect(provider.docsUrl).toMatch(/^https?:\/\//);
                }
            });
        });
    });

    describe('getProviderById', () => {
        it('should return correct provider by ID', () => {
            const openai = getProviderById('openai');

            expect(openai).toBeDefined();
            expect(openai?.id).toBe('openai');
            expect(openai?.name).toBe('OpenAI');
            expect(openai?.baseUrl).toBe('https://api.openai.com/v1');
        });

        it('should return undefined for unknown provider', () => {
            const unknown = getProviderById('unknown-provider');
            expect(unknown).toBeUndefined();
        });
    });

    describe('getProviderIds', () => {
        it('should return array of all provider IDs', () => {
            const ids = getProviderIds();

            expect(ids).toEqual([
                'openrouter',
                'openai',
                'xai',
                'mistral',
                'deepseek',
                'groq',
                'anthropic',
            ]);
        });
    });

    describe('Provider configurations', () => {
        it('should have correct OpenAI configuration', () => {
            const openai = getProviderById('openai');

            expect(openai).toMatchObject({
                id: 'openai',
                name: 'OpenAI',
                baseUrl: 'https://api.openai.com/v1',
                requiresApiKey: true,
                keyFormat: 'sk-...',
                docsUrl: 'https://platform.openai.com/docs',
            });
        });

        it('should have correct Anthropic configuration', () => {
            const anthropic = getProviderById('anthropic');

            expect(anthropic).toMatchObject({
                id: 'anthropic',
                name: 'Anthropic',
                baseUrl: 'https://api.anthropic.com/v1',
                requiresApiKey: true,
                docsUrl: 'https://docs.anthropic.com',
            });
        });

        it('should have correct Groq configuration', () => {
            const groq = getProviderById('groq');

            expect(groq).toMatchObject({
                id: 'groq',
                name: 'Groq',
                baseUrl: 'https://api.groq.com/openai/v1',
                requiresApiKey: true,
                docsUrl: 'https://console.groq.com/docs',
            });
        });
    });
});
