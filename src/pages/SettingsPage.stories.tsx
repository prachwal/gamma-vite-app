/**
 * @fileoverview Storybook stories for SettingsPage component
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsPage } from './SettingsPage';

const meta: Meta<typeof SettingsPage> = {
    title: 'Pages/SettingsPage',
    component: SettingsPage,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Settings page for application configuration',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default SettingsPage story
 */
export const Default: Story = {};
