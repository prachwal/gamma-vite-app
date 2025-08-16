import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
    title: 'Components/ThemeToggle',
    component: ThemeToggle,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTheme: Story = {
    parameters: {
        backgrounds: { default: 'light' },
    },
};

export const DarkTheme: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
