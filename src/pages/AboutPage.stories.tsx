/**
 * @fileoverview Storybook stories for AboutPage component
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AboutPage } from './AboutPage';

const meta: Meta<typeof AboutPage> = {
    title: 'Pages/AboutPage',
    component: AboutPage,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'About page displaying information about the application',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AboutPage story
 */
export const Default: Story = {};
