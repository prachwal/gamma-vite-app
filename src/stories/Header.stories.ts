/**
 * @fileoverview Storybook stories for Header component
 * @since 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Header } from '../components/Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Application header with navigation controls, theme toggle, and language selector.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    sidebarCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
    },
    onSidebarToggle: {
      action: 'sidebarToggle',
      description: 'Callback fired when sidebar toggle is clicked',
    },
    title: {
      control: 'text',
      description: 'Application title displayed in header',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onSidebarToggle: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header with expanded sidebar
 */
export const Default: Story = {
  args: {
    sidebarCollapsed: false,
    title: 'Gamma App',
  },
};

/**
 * Header with collapsed sidebar
 */
export const CollapsedSidebar: Story = {
  args: {
    sidebarCollapsed: true,
    title: 'Gamma App',
  },
};

/**
 * Header with custom title
 */
export const CustomTitle: Story = {
  args: {
    sidebarCollapsed: false,
    title: 'Custom Application Title',
  },
};

/**
 * Header with custom styling
 */
export const CustomStyling: Story = {
  args: {
    sidebarCollapsed: false,
    title: 'Styled Header',
    className: 'custom-header-class',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with custom CSS class applied for styling customization.',
      },
    },
  },
};

/**
 * Mobile layout header
 */
export const MobileLayout: Story = {
  args: {
    sidebarCollapsed: false,
    title: 'Mobile App',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header optimized for mobile devices with hamburger menu.',
      },
    },
  },
};
