/**
 * @fileoverview ThemeProvider component stories for Storybook
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from './ThemeProvider';

const meta = {
    title: 'Providers/ThemeProvider',
    component: ThemeProvider,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Theme provider that manages application theming with Ant Design integration and CSS custom properties.',
            },
        },
    },
    argTypes: {
        children: {
            description: 'React components to be wrapped with theme context',
            control: false,
        },
    },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ThemeProvider with sample content
 */
export const Default: Story = {
    args: {
        children: (
            <div style={{ padding: '20px' }}>
                <h1 style={{ color: 'var(--color-text-primary)' }}> Sample Heading </h1>
                < p style={{ color: 'var(--color-text-secondary)' }}>
                    This content is wrapped in ThemeProvider and uses CSS custom properties for theming.
                </p>
                < button
                    style={{
                        background: 'var(--color-primary)',
                        color: 'var(--color-text-inverse)',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Sample Button
                </button>
            </div>
        ),
    },
};

/**
 * ThemeProvider with various themed elements
 */
export const WithThemedElements: Story = {
    args: {
        children: (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                    style={
                        {
                            padding: '16px',
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border-primary)',
                            borderRadius: '8px',
                        }
                    }
                >
                    <h3 style={{ color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
                        Card with Theme Variables
                    </h3>
                    < p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                        This card uses CSS custom properties that are managed by ThemeProvider.
                    </p>
                </div>
                < div style={{ display: 'flex', gap: '8px' }}>
                    <span
                        style={
                            {
                                padding: '4px 8px',
                                background: 'var(--color-success)',
                                color: 'var(--color-text-inverse)',
                                borderRadius: '12px',
                                fontSize: '12px',
                            }
                        }
                    >
                        Success
                    </span>
                    < span
                        style={{
                            padding: '4px 8px',
                            background: 'var(--color-warning)',
                            color: 'var(--color-text-inverse)',
                            borderRadius: '12px',
                            fontSize: '12px',
                        }}
                    >
                        Warning
                    </span>
                    < span
                        style={{
                            padding: '4px 8px',
                            background: 'var(--color-error)',
                            color: 'var(--color-text-inverse)',
                            borderRadius: '12px',
                            fontSize: '12px',
                        }}
                    >
                        Error
                    </span>
                </div>
            </div>
        ),
    },
};