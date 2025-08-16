/**
 * @fileoverview Tests for default models
 * 
 * @since 1.0.0
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_MODELS } from './defaultModels';

describe('DEFAULT_MODELS', () => {
    it('should contain models for all major providers', () => {
        const expectedProviders = ['openai', 'anthropic', 'xai', 'mistral', 'deepseek', 'groq', 'openrouter'];

        expectedProviders.forEach(provider => {
            expect(DEFAULT_MODELS[provider]).toBeDefined();
            expect(Array.isArray(DEFAULT_MODELS[provider])).toBe(true);
            expect(DEFAULT_MODELS[provider].length).toBeGreaterThan(0);
        });
    });

    it('should have valid model structure', () => {
        Object.entries(DEFAULT_MODELS).forEach(([providerId, models]) => {
            models.forEach(model => {
                expect(model.id).toBeTruthy();
                expect(model.name).toBeTruthy();
                expect(model.provider).toBe(providerId);
                expect(model.description).toBeTruthy();
                expect(typeof model.contextLength).toBe('number');
                expect(typeof model.inputCostPerMillion).toBe('number');
                expect(typeof model.outputCostPerMillion).toBe('number');
                expect(Array.isArray(model.capabilities)).toBe(true);
            });
        });
    });

    it('should contain popular models', () => {
        // Check for GPT-4o
        const openaiModels = DEFAULT_MODELS.openai;
        expect(openaiModels.some(m => m.id === 'gpt-4o')).toBe(true);

        // Check for Claude 3.5 Sonnet
        const anthropicModels = DEFAULT_MODELS.anthropic;
        expect(anthropicModels.some(m => m.id === 'claude-3-5-sonnet-20241022')).toBe(true);

        // Check for Grok
        const xaiModels = DEFAULT_MODELS.xai;
        expect(xaiModels.some(m => m.id === 'grok-beta')).toBe(true);
    });

    it('should have valid capabilities', () => {
        const validCapabilities = ['vision', 'function_calling', 'json_mode', 'code_interpreter', 'web_search', 'multimodal'];

        Object.values(DEFAULT_MODELS).forEach(models => {
            models.forEach(model => {
                if (model.capabilities) {
                    model.capabilities.forEach(capability => {
                        expect(validCapabilities).toContain(capability);
                    });
                }
            });
        });
    });

    it('should have reasonable pricing', () => {
        Object.values(DEFAULT_MODELS).forEach(models => {
            models.forEach(model => {
                // Input cost should be positive and reasonable (< $100 per million)
                expect(model.inputCostPerMillion).toBeGreaterThan(0);
                expect(model.inputCostPerMillion).toBeLessThan(100);

                // Output cost should be positive and reasonable (< $200 per million)
                expect(model.outputCostPerMillion).toBeGreaterThan(0);
                expect(model.outputCostPerMillion).toBeLessThan(200);
            });
        });
    });

    it('should have reasonable context lengths', () => {
        Object.values(DEFAULT_MODELS).forEach(models => {
            models.forEach(model => {
                expect(model.contextLength).toBeGreaterThan(1000);
                expect(model.contextLength).toBeLessThan(1000000); // 1M tokens max
            });
        });
    });
});
