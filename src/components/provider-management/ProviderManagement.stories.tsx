/**
 * @fileoverview Storybook stories for ProviderManagement component
 * 
 * Stories demonstrating the provider management interface with different
 * states and configurations.
 * 
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProviderManagement } from './ProviderManagement';

const meta: Meta<typeof ProviderManagement> = {
    title: 'Components/ProviderManagement',
    component: ProviderManagement,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
Provider Management component for configuring AI providers. Features:

- View all configured providers
- Add custom providers with forms
- Edit existing provider settings  
- Delete custom providers
- Test provider connections
- Display provider status and information

The component provides a table interface with modals for provider configuration.
        `,
            },
        },
    },
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional CSS class name',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default provider management view with standard providers
 */
export const Default: Story = {
    parameters: {
        mockData: [
            {
                providers: [
                    {
                        id: 'openai',
                        name: 'OpenAI',
                        description: 'Leading AI research company providing GPT models',
                        baseUrl: 'https://api.openai.com/v1',
                        requiresApiKey: true,
                        logoUrl: 'https://openai.com/favicon.ico',
                        primaryColor: '#00A67E',
                    },
                    {
                        id: 'anthropic',
                        name: 'Anthropic',
                        description: 'AI safety focused company with Claude models',
                        baseUrl: 'https://api.anthropic.com',
                        requiresApiKey: true,
                        logoUrl: 'https://anthropic.com/favicon.ico',
                        primaryColor: '#D97B2A',
                    },
                ],
            },
        ],
    },
};

/**
 * Provider management with custom providers added
 */
export const WithCustomProviders: Story = {
    parameters: {
        mockData: [
            {
                providers: [
                    {
                        id: 'openai',
                        name: 'OpenAI',
                        description: 'Leading AI research company providing GPT models',
                        baseUrl: 'https://api.openai.com/v1',
                        requiresApiKey: true,
                        logoUrl: 'https://openai.com/favicon.ico',
                        primaryColor: '#00A67E',
                    },
                    {
                        id: 'my-custom-ai',
                        name: 'My Custom AI',
                        description: 'Self-hosted AI model with custom capabilities',
                        baseUrl: 'https://my-ai.example.com/v1',
                        requiresApiKey: true,
                        isCustom: true,
                        primaryColor: '#6366F1',
                    },
                    {
                        id: 'local-llama',
                        name: 'Local Llama',
                        description: 'Local LLaMA instance running on internal servers',
                        baseUrl: 'http://localhost:8000/v1',
                        requiresApiKey: false,
                        isCustom: true,
                        primaryColor: '#059669',
                    },
                ],
            },
        ],
    },
};

/**
 * Empty state with no providers configured
 */
export const EmptyState: Story = {
    parameters: {
        mockData: [
            {
                providers: [],
            },
        ],
    },
};

/**
 * Provider management with custom styling
 */
export const WithCustomStyling: Story = {
    args: {
        className: 'custom-provider-management',
    },
    parameters: {
        mockData: [
            {
                providers: [
                    {
                        id: 'openai',
                        name: 'OpenAI',
                        description: 'Leading AI research company providing GPT models',
                        baseUrl: 'https://api.openai.com/v1',
                        requiresApiKey: true,
                        logoUrl: 'https://openai.com/favicon.ico',
                        primaryColor: '#00A67E',
                    },
                ],
            },
        ],
    },
};

/**
 * Large dataset for testing pagination and performance
 */
export const LargeDataset: Story = {
    parameters: {
        mockData: [
            {
                providers: Array.from({ length: 50 }, (_, i) => ({
                    id: `provider-${i + 1}`,
                    name: `Provider ${i + 1}`,
                    description: `AI provider number ${i + 1} with various capabilities`,
                    baseUrl: `https://api.provider${i + 1}.com/v1`,
                    requiresApiKey: Math.random() > 0.3,
                    isCustom: i > 10,
                    primaryColor: `hsl(${(i * 137.5) % 360}, 70%, 50%)`,
                })),
            },
        ],
    },
};
