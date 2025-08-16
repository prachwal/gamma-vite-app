import type { Meta, StoryObj } from '@storybook/react-vite';
import { HamburgerMenu } from './HamburgerMenu';

const meta: Meta<typeof HamburgerMenu> = {
    title: 'Components/HamburgerMenu',
    component: HamburgerMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    args: {
        onToggle: () => console.log('Toggle hamburger menu'),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
    args: {
        isOpen: false,
    },
};

export const Open: Story = {
    args: {
        isOpen: true,
    },
};

export const WithCustomClass: Story = {
    args: {
        isOpen: false,
        className: 'custom-hamburger',
    },
};
