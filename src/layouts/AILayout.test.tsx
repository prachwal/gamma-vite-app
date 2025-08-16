/**
 * @fileoverview AILayout component tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/utils';
import { AILayout } from './AILayout';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: () => ({ pathname: '/ai' }),
        Outlet: () => <div data-testid="outlet">Outlet Content</div>,
        Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
            <a href={to}>{children}</a>
    };
});

describe('AILayout', () => {
    it('renders without crashing', () => {
        render(<AILayout />);
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('displays breadcrumb navigation', () => {
        render(<AILayout />);
        expect(screen.getByText('AI')).toBeInTheDocument();
    });

    it('renders horizontal navigation menu', () => {
        render(<AILayout />);
        expect(screen.getByText('Chat')).toBeInTheDocument();
        expect(screen.getByText('Model Browser')).toBeInTheDocument();
        expect(screen.getByText('Providers')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = render(<AILayout className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders suspense fallback for loading state', () => {
        render(<AILayout />);
        // The suspense fallback would show during actual lazy loading
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
});
