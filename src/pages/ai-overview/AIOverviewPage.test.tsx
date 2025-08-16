/**
 * @fileoverview AIOverviewPage component tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test/utils';
import { AIOverviewPage } from './AIOverviewPage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('AIOverviewPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<AIOverviewPage />);
        expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
    });

    it('displays correct statistics', () => {
        render(<AIOverviewPage />);
        expect(screen.getByText('Configured Providers')).toBeInTheDocument();
        expect(screen.getByText('Available Models')).toBeInTheDocument();
        expect(screen.getByText('AI Status')).toBeInTheDocument();
    });

    it('renders feature cards', () => {
        render(<AIOverviewPage />);
        expect(screen.getByText('AI Chat')).toBeInTheDocument();
        expect(screen.getByText('Model Browser')).toBeInTheDocument();
        expect(screen.getByText('Provider Management')).toBeInTheDocument();
    });

    it('navigates to chat when clicking Launch AI Chat', async () => {
        const user = userEvent.setup();
        render(<AIOverviewPage />);
        const launchButton = screen.getByRole('button', { name: /launch ai chat/i });
        await user.click(launchButton);
        expect(mockNavigate).toHaveBeenCalledWith('/ai/chat');
    });

    it('navigates to models when clicking Launch Model Browser', async () => {
        const user = userEvent.setup();
        render(<AIOverviewPage />);
        const launchButton = screen.getByRole('button', { name: /launch model browser/i });
        await user.click(launchButton);
        expect(mockNavigate).toHaveBeenCalledWith('/ai/models');
    });

    it('renders quick actions', () => {
        render(<AIOverviewPage />);
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
        expect(screen.getByText('Start New Chat')).toBeInTheDocument();
        expect(screen.getByText('Browse Models')).toBeInTheDocument();
        expect(screen.getByText('Configure Providers')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = render(<AIOverviewPage className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
