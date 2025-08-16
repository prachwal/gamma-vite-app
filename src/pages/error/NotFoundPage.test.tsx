/**
 * @fileoverview NotFoundPage component tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test/utils';
import { NotFoundPage } from './NotFoundPage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
    value: { reload: mockReload },
    writable: true
});

describe('NotFoundPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<NotFoundPage />);
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('displays error message', () => {
        render(<NotFoundPage />);
        expect(screen.getByText('Sorry, the page you visited does not exist.')).toBeInTheDocument();
    });

    it('navigates home when clicking Back Home button', async () => {
        const user = userEvent.setup();
        render(<NotFoundPage />);
        const homeButton = screen.getByRole('button', { name: /back home/i });
        await user.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('reloads page when clicking Retry button', async () => {
        const user = userEvent.setup();
        render(<NotFoundPage />);
        const retryButton = screen.getByRole('button', { name: /retry/i });
        await user.click(retryButton);
        expect(mockReload).toHaveBeenCalled();
    });

    it('applies custom className when provided', () => {
        const { container } = render(<NotFoundPage className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with correct styling', () => {
        const { container } = render(<NotFoundPage />);
        const element = container.firstChild as HTMLElement;

        // Check that element has the expected style attributes
        expect(element).toHaveAttribute('style');
        const style = element.getAttribute('style') || '';
        expect(style).toContain('height: 100%');
        expect(style).toContain('display: flex');
        expect(style).toContain('align-items: center');
        expect(style).toContain('justify-content: center');
    });
});
