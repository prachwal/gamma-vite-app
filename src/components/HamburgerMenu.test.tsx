/**
 * @fileoverview Tests for HamburgerMenu component
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render, userEvent } from '../test/utils';
import { HamburgerMenu } from './HamburgerMenu';

describe('HamburgerMenu', () => {
    const mockOnToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders hamburger menu button', () => {
        render(<HamburgerMenu isOpen={false} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('displays menu icon when closed', () => {
        render(<HamburgerMenu isOpen={false} onToggle={mockOnToggle} />);

        const menuIcon = screen.getByRole('img', { name: /menu/i });
        expect(menuIcon).toBeInTheDocument();
    });

    it('displays close icon when open', () => {
        render(<HamburgerMenu isOpen={true} onToggle={mockOnToggle} />);

        const closeIcon = screen.getByRole('img', { name: /close/i });
        expect(closeIcon).toBeInTheDocument();
    });

    it('calls onToggle when clicked', async () => {
        const user = userEvent.setup();

        render(<HamburgerMenu isOpen={false} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
        render(<HamburgerMenu isOpen={false} onToggle={mockOnToggle} className="custom-class" />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('has correct styling', () => {
        render(<HamburgerMenu isOpen={false} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        expect(button).toHaveStyle({ color: 'var(--color-text-primary)' });
    });
});
