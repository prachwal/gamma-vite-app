import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSelector } from './LanguageSelector';

const meta: Meta<typeof LanguageSelector> = {
    title: 'Components/LanguageSelector',
    component: LanguageSelector,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPolishSelected: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
};

export const WithEnglishSelected: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
