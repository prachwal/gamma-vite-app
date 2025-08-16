/**
 * @fileoverview Enhanced AI service with caching and custom model descriptions
 * 
 * Provides AI provider integration with localStorage caching and enhanced model data.
 * 
 * @since 1.0.0
 */

import type { AIModel, ModelCapability } from '../types/ai';
import {
    cacheModels,
    getCachedModels,
    needsModelRefresh,
    getAllCachedModels,
    initializeCacheWithDefaults
} from './cacheService';
import { AI_PROVIDERS } from './aiProviders';
import { getStoredApiKeys } from './aiService';

/**
 * Custom model descriptions for providers that don't provide good descriptions
 */
const CUSTOM_MODEL_DESCRIPTIONS: Record<string, Record<string, string>> = {
    'xai': {
        'grok-beta': 'xAI\'s flagship conversational AI model with real-time information access and web search capabilities. Designed for witty, engaging conversations with a rebellious personality.',
        'grok-vision-beta': 'Advanced multimodal version of Grok with vision capabilities. Can analyze images, understand visual content, and provide detailed descriptions while maintaining Grok\'s characteristic humor.',
    },
    'deepseek': {
        'deepseek-chat': 'DeepSeek\'s general-purpose conversational AI model optimized for natural dialogue and reasoning tasks. Excellent for complex problem-solving and analytical discussions.',
        'deepseek-coder': 'Specialized coding assistant model trained on vast amounts of code. Excels at programming tasks, code generation, debugging, and technical documentation.',
        'deepseek-reasoner': 'Advanced reasoning model designed for complex logical thinking and step-by-step problem solving. Ideal for mathematical, scientific, and analytical tasks.',
    },
    'openai': {
        'gpt-4o': 'OpenAI\'s most advanced multimodal model with vision, audio, and text capabilities. Offers superior reasoning, creativity, and real-time conversation abilities.',
        'gpt-4o-mini': 'Faster, more affordable version of GPT-4o with excellent performance for most tasks. Ideal balance of capability and cost-effectiveness.',
        'gpt-4-turbo': 'Enhanced GPT-4 with improved instruction following, JSON mode, and reproducible outputs. Optimized for complex, multi-step tasks.',
        'gpt-4': 'OpenAI\'s flagship large language model with exceptional reasoning capabilities. Best for complex analysis, creative writing, and professional applications.',
        'gpt-3.5-turbo': 'Fast and efficient model perfect for chatbots, content generation, and general conversational AI applications.',
        'o1-preview': 'Advanced reasoning model that thinks step-by-step through complex problems. Excels at mathematics, coding, and scientific reasoning.',
        'o1-mini': 'Faster version of o1 optimized for coding and STEM reasoning tasks while maintaining high accuracy.',
    },
    'anthropic': {
        'claude-3-5-sonnet-20241022': 'Anthropic\'s most advanced model with exceptional reasoning, analysis, and creative capabilities. Excellent for complex tasks requiring nuanced understanding.',
        'claude-3-5-haiku-20241022': 'Fast and efficient Claude model optimized for quick responses while maintaining high quality. Perfect for real-time applications.',
        'claude-3-opus-20240229': 'Anthropic\'s most powerful model for highly complex tasks. Unmatched in reasoning depth and analytical capabilities.',
        'claude-3-sonnet-20240229': 'Balanced Claude model offering strong performance across a wide range of tasks with good speed-quality tradeoff.',
        'claude-3-haiku-20240307': 'Fastest Claude model for applications requiring quick responses. Maintains Claude\'s safety and helpfulness.',
    },
    'groq': {
        'llama-3.1-405b-reasoning': 'Meta\'s largest and most capable Llama model with enhanced reasoning abilities. Excels at complex problem-solving and analytical tasks.',
        'llama-3.1-70b-versatile': 'Versatile Llama model balanced for various applications. Strong performance in conversation, analysis, and creative tasks.',
        'llama-3.1-8b-instant': 'Fast, lightweight Llama model for quick responses. Ideal for chatbots and real-time applications.',
        'mixtral-8x7b-32768': 'Mistral AI\'s mixture-of-experts model with extended context. Excellent for long-form content and document analysis.',
    },
    'mistral': {
        'mistral-large-latest': 'Mistral AI\'s flagship model with advanced reasoning and multilingual capabilities. Optimized for complex professional tasks.',
        'mistral-small-latest': 'Efficient Mistral model balancing performance and cost. Great for most conversational and analytical applications.',
        'pixtral-12b-2409': 'Multimodal Mistral model with vision capabilities. Can analyze images and provide detailed visual understanding.',
        'codestral-latest': 'Specialized coding model by Mistral AI. Excels at code generation, debugging, and software development tasks.',
    },
};

interface ProviderConfig {
    id: string;
    name: string;
    baseUrl: string;
    requiresApiKey: boolean;
}

interface ModelData {
    id: string;
    name?: string;
    description?: string;
    context_length?: number;
    max_tokens?: number;
    created?: number;
    multimodal?: boolean;
    function_calling?: boolean;
    json_mode?: boolean;
    pricing?: {
        prompt?: number;
        completion?: number;
    };
    [key: string]: unknown;
}

/**
 * Enhanced model fetching with caching and custom descriptions
 */
export class EnhancedAIService {
    /**
     * Initialize cache with default models if empty
     */
    static initializeDefaultModels(): void {
        initializeCacheWithDefaults();
    }

    /**
     * Get models for a provider with caching
     */
    static async getModels(providerId: string, forceRefresh = false): Promise<AIModel[]> {
        // Check cache first unless force refresh
        if (!forceRefresh) {
            const cachedModels = getCachedModels(providerId);
            if (cachedModels) {
                return this.enhanceModels(providerId, cachedModels);
            }
        }

        // Fetch fresh data
        try {
            const provider = AI_PROVIDERS.find(p => p.id === providerId);
            if (!provider) {
                throw new Error(`Provider ${providerId} not found`);
            }

            const models = await this.fetchModelsFromProvider(provider);
            const enhancedModels = this.enhanceModels(providerId, models);

            // Cache the enhanced models
            cacheModels(providerId, enhancedModels);

            return enhancedModels;
        } catch (error) {
            console.error(`Failed to fetch models for ${providerId}:`, error);

            // Fallback to cache if available, even if expired
            const cachedModels = getCachedModels(providerId);
            if (cachedModels) {
                return this.enhanceModels(providerId, cachedModels);
            }

            throw error;
        }
    }

    /**
     * Get all cached models from all providers
     */
    static getAllCachedModels(): Record<string, AIModel[]> {
        const cachedModels = getAllCachedModels();
        const enhancedModels: Record<string, AIModel[]> = {};

        Object.entries(cachedModels).forEach(([providerId, models]) => {
            enhancedModels[providerId] = this.enhanceModels(providerId, models);
        });

        return enhancedModels;
    }

    /**
     * Check if models need refresh
     */
    static needsRefresh(providerId: string): boolean {
        return needsModelRefresh(providerId);
    }

    /**
     * Refresh all models that are older than 24 hours
     */
    static async refreshStaleModels(): Promise<void> {
        const promises = AI_PROVIDERS.map(async (provider) => {
            // Only try to refresh if we have an API key for this provider
            const storedKeys = getStoredApiKeys();
            const keyEntry = storedKeys[provider.id];
            if (!keyEntry && provider.requiresApiKey) {
                console.debug(`Skipping refresh for ${provider.id}: no API key available`);
                return;
            }

            if (this.needsRefresh(provider.id)) {
                try {
                    await this.getModels(provider.id, true);
                } catch (error) {
                    console.warn(`Failed to refresh models for ${provider.id}:`, error);
                }
            }
        });

        await Promise.allSettled(promises);
    }

    /**
     * Enhance models with custom descriptions and additional metadata
     */
    private static enhanceModels(providerId: string, models: AIModel[]): AIModel[] {
        const customDescriptions = CUSTOM_MODEL_DESCRIPTIONS[providerId] || {};

        return models.map(model => ({
            ...model,
            description: customDescriptions[model.id] || model.description || `${model.name} model from ${providerId}`,
            // Add enhanced metadata
            enhanced: true,
            lastUpdated: new Date().toISOString(),
        }));
    }

    /**
     * Fetch models from a specific provider
     */
    private static async fetchModelsFromProvider(provider: ProviderConfig): Promise<AIModel[]> {
        // Get API key from the correct localStorage structure
        const storedKeys = getStoredApiKeys();
        const keyEntry = storedKeys[provider.id];

        if (!keyEntry && provider.requiresApiKey) {
            throw new Error(`API key required for ${provider.name}`);
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (keyEntry) {
            // Decrypt the API key
            const apiKey = atob(keyEntry.apiKey);
            if (provider.id === 'anthropic') {
                headers['x-api-key'] = apiKey;
                headers['anthropic-version'] = '2023-06-01';
            } else {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }
        }

        const response = await fetch(`${provider.baseUrl}/models`, {
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (data.data) {
            // OpenAI/OpenRouter format
            return data.data.map((model: ModelData) => ({
                id: model.id,
                name: model.name || model.id,
                description: model.description || '',
                provider: provider.id,
                capabilities: this.inferCapabilities(model),
                cost: this.extractCost(model),
                contextLength: model.context_length || model.max_tokens || 4096,
                created: model.created,
            }));
        } else if (data.models) {
            // Alternative format
            return data.models.map((model: ModelData) => ({
                id: model.id,
                name: model.name || model.id,
                description: model.description || '',
                provider: provider.id,
                capabilities: this.inferCapabilities(model),
                cost: this.extractCost(model),
                contextLength: model.context_length || 4096,
            }));
        } else {
            // Direct array format
            return (data as ModelData[]).map((model: ModelData) => ({
                id: model.id,
                name: model.name || model.id,
                description: model.description || '',
                provider: provider.id,
                capabilities: this.inferCapabilities(model),
                cost: this.extractCost(model),
                contextLength: model.context_length || 4096,
            }));
        }
    }

    /**
     * Infer model capabilities from model data
     */
    private static inferCapabilities(model: Record<string, unknown>): ModelCapability[] {
        const capabilities: ModelCapability[] = [];

        const modelId = (typeof model.id === 'string' ? model.id : '').toLowerCase();
        const modelName = (typeof model.name === 'string' ? model.name : '').toLowerCase();

        if (modelId.includes('vision') || modelName.includes('vision')) {
            capabilities.push('vision');
        }
        if (modelId.includes('code') || modelName.includes('code')) {
            capabilities.push('code_interpreter');
        }
        if (model.multimodal) {
            capabilities.push('multimodal');
        }
        if (modelId.includes('function') || model.function_calling) {
            capabilities.push('function_calling');
        }
        if (modelId.includes('json') || model.json_mode) {
            capabilities.push('json_mode');
        }

        return capabilities;
    }

    /**
     * Extract cost information from model data
     */
    private static extractCost(model: Record<string, unknown>): { input?: number; output?: number } {
        const cost: { input?: number; output?: number } = {};

        if (model.pricing && typeof model.pricing === 'object') {
            const pricing = model.pricing as Record<string, unknown>;
            if (typeof pricing.prompt === 'number') {
                cost.input = pricing.prompt;
            }
            if (typeof pricing.completion === 'number') {
                cost.output = pricing.completion;
            }
        }

        return cost;
    }
}
