/**
 * @fileoverview Default models for demonstration
 * 
 * Provides sample models for each provider when API keys are not available.
 * 
 * @since 1.0.0
 */

import type { AIModel } from '../types/ai';

/**
 * Default models for demonstration purposes
 */
export const DEFAULT_MODELS: Record<string, AIModel[]> = {
    openai: [
        {
            id: 'gpt-4o',
            name: 'GPT-4o',
            provider: 'openai',
            description: 'Most advanced GPT-4 model optimized for chat, creative and technical writing',
            capabilities: ['function_calling', 'vision'],
            contextLength: 128000,
            inputCostPerMillion: 5.0,
            outputCostPerMillion: 15.0,
            maxOutputTokens: 16384
        },
        {
            id: 'gpt-4o-mini',
            name: 'GPT-4o mini',
            provider: 'openai',
            description: 'Affordable and intelligent small model for fast, lightweight tasks',
            capabilities: ['function_calling', 'vision'],
            contextLength: 128000,
            inputCostPerMillion: 0.15,
            outputCostPerMillion: 0.6,
            maxOutputTokens: 16384
        },
        {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            provider: 'openai',
            description: 'Fast, inexpensive model for simple tasks',
            capabilities: ['function_calling'],
            contextLength: 16385,
            inputCostPerMillion: 0.5,
            outputCostPerMillion: 1.5,
            maxOutputTokens: 4096
        }
    ],
    anthropic: [
        {
            id: 'claude-3-5-sonnet-20241022',
            name: 'Claude 3.5 Sonnet',
            provider: 'anthropic',
            description: 'Most intelligent model, combining top-tier performance with improved speed',
            capabilities: ['function_calling', 'vision'],
            contextLength: 200000,
            inputCostPerMillion: 3.0,
            outputCostPerMillion: 15.0,
            maxOutputTokens: 8192
        },
        {
            id: 'claude-3-5-haiku-20241022',
            name: 'Claude 3.5 Haiku',
            provider: 'anthropic',
            description: 'Fastest model for everyday tasks',
            capabilities: ['vision'],
            contextLength: 200000,
            inputCostPerMillion: 1.0,
            outputCostPerMillion: 5.0,
            maxOutputTokens: 8192
        },
        {
            id: 'claude-3-opus-20240229',
            name: 'Claude 3 Opus',
            provider: 'anthropic',
            description: 'Most powerful model for highly complex tasks',
            capabilities: ['vision'],
            contextLength: 200000,
            inputCostPerMillion: 15.0,
            outputCostPerMillion: 75.0,
            maxOutputTokens: 4096
        }
    ],
    xai: [
        {
            id: 'grok-beta',
            name: 'Grok Beta',
            provider: 'xai',
            description: 'Grok is an AI assistant with a rebellious streak and real-time access to information',
            capabilities: ['web_search'],
            contextLength: 131072,
            inputCostPerMillion: 5.0,
            outputCostPerMillion: 15.0,
            maxOutputTokens: 4096
        },
        {
            id: 'grok-vision-beta',
            name: 'Grok Vision Beta',
            provider: 'xai',
            description: 'Grok with vision capabilities for image understanding and analysis',
            capabilities: ['vision', 'web_search'],
            contextLength: 131072,
            inputCostPerMillion: 5.0,
            outputCostPerMillion: 15.0,
            maxOutputTokens: 4096
        }
    ],
    mistral: [
        {
            id: 'mistral-large-latest',
            name: 'Mistral Large',
            provider: 'mistral',
            description: 'Flagship model with state-of-the-art reasoning, knowledge and coding capabilities',
            capabilities: ['function_calling'],
            contextLength: 131072,
            inputCostPerMillion: 2.0,
            outputCostPerMillion: 6.0,
            maxOutputTokens: 8192
        },
        {
            id: 'mistral-small-latest',
            name: 'Mistral Small',
            provider: 'mistral',
            description: 'Cost-efficient model for translation, summarization, and sentiment analysis',
            capabilities: ['function_calling'],
            contextLength: 131072,
            inputCostPerMillion: 0.2,
            outputCostPerMillion: 0.6,
            maxOutputTokens: 8192
        },
        {
            id: 'codestral-latest',
            name: 'Codestral',
            provider: 'mistral',
            description: 'Cutting-edge generative model specifically designed and optimized for code generation',
            capabilities: ['code_interpreter'],
            contextLength: 32768,
            inputCostPerMillion: 1.0,
            outputCostPerMillion: 3.0,
            maxOutputTokens: 8192
        }
    ],
    deepseek: [
        {
            id: 'deepseek-chat',
            name: 'DeepSeek Chat',
            provider: 'deepseek',
            description: 'General-purpose conversational AI model with strong reasoning capabilities',
            capabilities: ['function_calling'],
            contextLength: 64000,
            inputCostPerMillion: 0.14,
            outputCostPerMillion: 0.28,
            maxOutputTokens: 4096
        },
        {
            id: 'deepseek-coder',
            name: 'DeepSeek Coder',
            provider: 'deepseek',
            description: 'Specialized model for code generation, debugging, and programming assistance',
            capabilities: ['code_interpreter'],
            contextLength: 64000,
            inputCostPerMillion: 0.14,
            outputCostPerMillion: 0.28,
            maxOutputTokens: 4096
        },
        {
            id: 'deepseek-reasoner',
            name: 'DeepSeek Reasoner',
            provider: 'deepseek',
            description: 'Advanced reasoning model for complex problem-solving and analysis',
            capabilities: ['function_calling'],
            contextLength: 64000,
            inputCostPerMillion: 0.55,
            outputCostPerMillion: 1.9,
            maxOutputTokens: 4096
        }
    ],
    groq: [
        {
            id: 'llama-3.3-70b-versatile',
            name: 'Llama 3.3 70B Versatile',
            provider: 'groq',
            description: 'Meta\'s latest Llama model optimized for versatile tasks and high performance',
            capabilities: ['function_calling'],
            contextLength: 131072,
            inputCostPerMillion: 0.59,
            outputCostPerMillion: 0.79,
            maxOutputTokens: 32768
        },
        {
            id: 'llama-3.2-90b-vision-preview',
            name: 'Llama 3.2 90B Vision',
            provider: 'groq',
            description: 'Large multimodal model with vision capabilities for image understanding',
            capabilities: ['vision'],
            contextLength: 131072,
            inputCostPerMillion: 0.9,
            outputCostPerMillion: 0.9,
            maxOutputTokens: 8192
        },
        {
            id: 'mixtral-8x7b-32768',
            name: 'Mixtral 8x7B',
            provider: 'groq',
            description: 'Mistral\'s mixture of experts model for efficient high-quality responses',
            capabilities: ['function_calling'],
            contextLength: 32768,
            inputCostPerMillion: 0.24,
            outputCostPerMillion: 0.24,
            maxOutputTokens: 32768
        }
    ],
    openrouter: [
        {
            id: 'anthropic/claude-3.5-sonnet',
            name: 'Claude 3.5 Sonnet (via OpenRouter)',
            provider: 'openrouter',
            description: 'Anthropic\'s Claude 3.5 Sonnet accessed through OpenRouter',
            capabilities: ['function_calling', 'vision'],
            contextLength: 200000,
            inputCostPerMillion: 3.0,
            outputCostPerMillion: 15.0,
            maxOutputTokens: 8192
        },
        {
            id: 'openai/gpt-4o',
            name: 'GPT-4o (via OpenRouter)',
            provider: 'openrouter',
            description: 'OpenAI\'s GPT-4o accessed through OpenRouter',
            capabilities: ['function_calling', 'vision'],
            contextLength: 128000,
            inputCostPerMillion: 5.0,
            outputCostPerMillion: 15.0,
            maxOutputTokens: 16384
        },
        {
            id: 'meta-llama/llama-3.2-90b-vision-instruct',
            name: 'Llama 3.2 90B Vision (via OpenRouter)',
            provider: 'openrouter',
            description: 'Meta\'s Llama 3.2 90B with vision capabilities through OpenRouter',
            capabilities: ['vision'],
            contextLength: 131072,
            inputCostPerMillion: 0.9,
            outputCostPerMillion: 0.9,
            maxOutputTokens: 8192
        }
    ]
};
