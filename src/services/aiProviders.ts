/**
 * @fileoverview AI provider configurations
 * 
 * @since 1.0.0
 */

import type { AIProviderConfig } from '../types/ai';

/**
 * Available AI providers configuration
 */
export const AI_PROVIDERS: AIProviderConfig[] = [
    {
        id: 'openrouter',
        name: 'OpenRouter',
        description: 'Access to multiple AI models through a single API',
        baseUrl: 'https://openrouter.ai/api/v1',
        requiresApiKey: true,
        keyFormat: 'sk-or-v1-...',
        docsUrl: 'https://openrouter.ai/docs',
        logoUrl: 'https://openrouter.ai/favicon.ico',
        primaryColor: '#7C3AED',
    },
    {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT-4, GPT-3.5, and other OpenAI models',
        baseUrl: 'https://api.openai.com/v1',
        requiresApiKey: true,
        keyFormat: 'sk-...',
        docsUrl: 'https://platform.openai.com/docs',
        logoUrl: 'https://openai.com/favicon.ico',
        primaryColor: '#00A67E',
    },
    {
        id: 'xai',
        name: 'xAI (Grok)',
        description: 'Grok models by xAI',
        baseUrl: 'https://api.x.ai/v1',
        requiresApiKey: true,
        keyFormat: 'xai-...',
        docsUrl: 'https://docs.x.ai',
        logoUrl: 'https://x.ai/favicon.ico',
        primaryColor: '#1DA1F2',
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        description: 'Mistral and Mixtral models',
        baseUrl: 'https://api.mistral.ai/v1',
        requiresApiKey: true,
        docsUrl: 'https://docs.mistral.ai',
        logoUrl: 'https://mistral.ai/favicon.ico',
        primaryColor: '#FF6B35',
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'DeepSeek Coder and Chat models',
        baseUrl: 'https://api.deepseek.com/v1',
        requiresApiKey: true,
        keyFormat: 'sk-...',
        docsUrl: 'https://platform.deepseek.com/docs',
        logoUrl: 'https://platform.deepseek.com/favicon.ico',
        primaryColor: '#1890FF',
    },
    {
        id: 'groq',
        name: 'Groq',
        description: 'Ultra-fast AI inference with Llama, Mixtral, and Gemma',
        baseUrl: 'https://api.groq.com/openai/v1',
        requiresApiKey: true,
        docsUrl: 'https://console.groq.com/docs',
        logoUrl: 'https://groq.com/favicon.ico',
        primaryColor: '#F56500',
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Claude models by Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        requiresApiKey: true,
        docsUrl: 'https://docs.anthropic.com',
        logoUrl: 'https://anthropic.com/favicon.ico',
        primaryColor: '#D97706',
    },
];

/**
 * Get provider configuration by ID
 */
export const getProviderById = (id: string) =>
    AI_PROVIDERS.find(provider => provider.id === id);

/**
 * Get all provider IDs
 */
export const getProviderIds = () =>
    AI_PROVIDERS.map(provider => provider.id);
