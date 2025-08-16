/**
 * @fileoverview Storybook stories for AISettings component
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../../store/appSlice';
import configReducer from '../../store/configSlice';
import aiReducer from '../../store/aiSlice';
import { AISettings } from './AISettings';

// Create a mock store for Storybook  
const createMockStore = () => {
    return configureStore({
        reducer: {
            app: appReducer,
            config: configReducer,
            ai: aiReducer,
        },
    });
};

const meta = {
    title: 'Components/AI/AISettings',
    component: AISettings,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'AI Provider Settings component for managing API keys, providers, and models.',
            },
        },
    },
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional CSS class name',
        },
    },
    decorators: [
        (Story, { args }) => {
            const store = createMockStore();

            return (
                <Provider store={store}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Story {...args} />
                    </div>
                </Provider>
            );
        },
    ],
} satisfies Meta<typeof AISettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with no API keys configured
 */
export const Default: Story = {
    args: {},
};

/**
 * Settings with API keys configured
 */
export const WithAPIKeys: Story = {
    decorators: [
        (Story) => {
            const store = createMockStore();

            return (
                <Provider store={store}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Story />
                    </div>
                </Provider>
            );
        },
    ],
};

/**
 * Settings with loading states
 */
export const Loading: Story = {
    decorators: [
        (Story) => {
            const store = createMockStore();

            return (
                <Provider store={store}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Story />
                    </div>
                </Provider>
            );
        },
    ],
};

/**
 * Settings with error states
 */
export const WithErrors: Story = {
    decorators: [
        (Story) => {
            const store = createMockStore();

            return (
                <Provider store={store}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Story />
                    </div>
                </Provider>
            );
        },
    ],
};

/**
 * Compact layout with custom styling
 */
export const CustomStyling: Story = {
    args: {
        className: 'custom-ai-settings',
    },
    parameters: {
        docs: {
            description: {
                story: 'AISettings component with custom CSS class applied.',
            },
        },
    },
};
