import type { Meta, StoryObj } from '@storybook/react-vite';
import { AIPage } from './AIPage';

const meta: Meta<typeof AIPage> = {
    title: 'Pages/AIPage',
    component: AIPage,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMockData: Story = {
    parameters: {
        mockData: [
            {
                url: '/api/ai/providers',
                method: 'GET',
                status: 200,
                response: {
                    providers: ['openai', 'anthropic', 'xai'],
                },
            },
        ],
    },
};