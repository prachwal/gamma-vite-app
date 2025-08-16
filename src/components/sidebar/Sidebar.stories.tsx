/**
 * @fileoverview Storybook stories for Sidebar component
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Sidebar } from './Sidebar';

const meta = {
    title: 'Components/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Navigation sidebar with collapsible menu items.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        collapsed: {
            control: 'boolean',
            description: 'Whether the sidebar is collapsed',
        },
        onCollapse: {
            action: 'collapse',
            description: 'Callback fired when sidebar collapse state changes',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
    args: {
        onCollapse: fn(),
    },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default expanded sidebar
 */
export const Default: Story = {
    args: {
        collapsed: false,
    },
};

/**
 * Collapsed sidebar showing only icons
 */
export const Collapsed: Story = {
    args: {
        collapsed: true,
    },
};

/**
 * Sidebar with custom styling
 */
export const CustomStyling: Story = {
    args: {
        collapsed: false,
        className: 'custom-sidebar-class',
    },
    parameters: {
        docs: {
            description: {
                story: 'Sidebar with custom CSS class applied for styling customization.',
            },
        },
    },
};

/**
 * Mobile sidebar layout
 */
export const MobileLayout: Story = {
    args: {
        collapsed: false,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Sidebar optimized for mobile devices.',
            },
        },
    },
};
