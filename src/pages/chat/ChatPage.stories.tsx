/**
 * @fileoverview ChatPage Storybook stories
 * 
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatPage } from './ChatPage';

const meta: Meta<typeof ChatPage> = {
    title: 'Pages/ChatPage',
    component: ChatPage,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
# ChatPage Component

The ChatPage component provides a comprehensive chat interface with AI models. It features:

- **Model Selection**: Choose from various AI providers and models
- **Conversation Management**: Create, save, and manage multiple chat conversations
- **Real-time Chat**: Send messages and receive AI responses
- **Markdown Support**: Rich text rendering with syntax highlighting
- **Responsive Design**: Optimized for desktop and mobile devices
- **Persistence**: Conversations saved to localStorage
- **Modular Architecture**: Extensible plugin system for additional features

## Features

- 🤖 Multi-provider AI model support (OpenAI, Anthropic, xAI, etc.)
- 💾 Automatic conversation persistence
- 📱 Responsive sidebar for conversation management
- ✨ Markdown rendering with code highlighting
- 🎨 Clean, accessible interface design
- ⚡ Fast model switching with auto-conversation creation
- 🔄 Real-time message synchronization

## Usage

The ChatPage integrates with the application's AI provider system and uses localStorage for conversation persistence. It automatically loads available models from the cache and provides a seamless chat experience.
                `
            }
        }
    },
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional CSS class name for styling'
        }
    },
    decorators: [
        (Story) => (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Story />
            </div>
        )
    ]
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ChatPage story showing the basic chat interface
 */
export const Default: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Basic ChatPage with default configuration and model selection.'
            }
        }
    }
};

/**
 * ChatPage with custom styling
 */
export const WithCustomClass: Story = {
    args: {
        className: 'custom-chat-styling'
    },
    parameters: {
        docs: {
            description: {
                story: 'ChatPage with a custom CSS class for additional styling options.'
            }
        }
    }
};

/**
 * Mobile responsive view simulation
 */
export const MobileView: Story = {
    args: {},
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        },
        docs: {
            description: {
                story: 'ChatPage optimized for mobile devices with responsive sidebar and compact layout.'
            }
        }
    }
};

/**
 * Tablet responsive view simulation
 */
export const TabletView: Story = {
    args: {},
    parameters: {
        viewport: {
            defaultViewport: 'tablet'
        },
        docs: {
            description: {
                story: 'ChatPage optimized for tablet devices with balanced layout and touch-friendly controls.'
            }
        }
    }
};

/**
 * Dark theme demonstration
 */
export const DarkTheme: Story = {
    args: {},
    parameters: {
        backgrounds: {
            default: 'dark'
        },
        docs: {
            description: {
                story: 'ChatPage in dark theme showing how the interface adapts to different color schemes.'
            }
        }
    },
    decorators: [
        (Story) => (
            <div data-theme="dark" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Story />
            </div>
        )
    ]
};

/**
 * Loading state simulation
 */
export const LoadingState: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'ChatPage showing loading states for models and conversations.'
            }
        }
    }
};
