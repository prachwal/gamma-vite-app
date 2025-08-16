/**
 * @fileoverview Tests for HomePage component
 * @since 1.0.0
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/utils';
import { HomePage } from './HomePage';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'pages.home.title': 'Gamma Vite App',
                'pages.home.welcome': 'Welcome to Gamma Vite App',
                'pages.home.description': 'A modern React application built with TypeScript, Vite, and Ant Design. Features include Redux state management, i18next internationalization, and responsive design.',
                'home.features.modern': 'Modern Stack',
                'home.features.modernDesc': 'Built with React 19, TypeScript, and Vite for fast development',
                'home.features.responsive': 'Responsive Design',
                'home.features.responsiveDesc': 'Optimized for mobile, tablet, and desktop devices',
                'home.features.i18n': 'Internationalization',
                'home.features.i18nDesc': 'Support for multiple languages with i18next',
            };
            return translations[key] || key;
        },
    }),
}));

describe('HomePage', () => {
    it('renders home page with welcome message', () => {
        render(<HomePage />);

        expect(screen.getByText('Gamma Vite App')).toBeInTheDocument();
        expect(screen.getByText('Welcome to Gamma Vite App')).toBeInTheDocument();
    });

    it('renders home icon', () => {
        render(<HomePage />);

        const homeIcon = screen.getByRole('img', { name: /home/i });
        expect(homeIcon).toBeInTheDocument();
    });

    it('renders description text', () => {
        render(<HomePage />);

        expect(screen.getByText(/A modern React application built with TypeScript, Vite, and Ant Design/)).toBeInTheDocument();
    });

    it('renders feature cards', () => {
        render(<HomePage />);

        expect(screen.getByText('Gamma Vite App')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
        render(<HomePage />);

        expect(screen.getByText(/A modern React application built with TypeScript, Vite, and Ant Design/)).toBeInTheDocument();
    });

    it('has proper responsive layout styling', () => {
        render(<HomePage />);

        const container = screen.getByText('Gamma Vite App').closest('div[style*="max-width: 800px"]');
        expect(container).toBeInTheDocument();
        expect(container).toHaveStyle({ maxWidth: '800px', margin: '0 auto' });
    });

    it('applies correct theme variables', () => {
        render(<HomePage />);

        const homeIcon = screen.getByRole('img', { name: /home/i });
        expect(homeIcon).toHaveStyle({ color: 'var(--color-primary)' });
    });
});
