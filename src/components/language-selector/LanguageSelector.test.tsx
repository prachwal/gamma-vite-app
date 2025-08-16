/**
 * @fileoverview Tests for LanguageSelector component
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render, userEvent } from '../../test/utils';
import { LanguageSelector } from './LanguageSelector';

// Mock react-i18next
const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'language.changeLanguage': 'Change language',
            };
            return translations[key] || key;
        },
        i18n: {
            changeLanguage: mockChangeLanguage,
        },
    }),
}));

describe('LanguageSelector', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders language selector button', () => {
        render(<LanguageSelector />, {
            preloadedState: {
                app: {
                    theme: 'light',
                    language: 'en',
                    sidebarCollapsed: false,
                },
            },
        });

        const button = screen.getByRole('button', { name: /change language/i });
        expect(button).toBeInTheDocument();
    });

    it('displays current language flag', () => {
        render(<LanguageSelector />, {
            preloadedState: {
                app: {
                    theme: 'light',
                    language: 'en',
                    sidebarCollapsed: false,
                },
            },
        });

        const button = screen.getByRole('button', { name: /change language/i });
        expect(button).toHaveTextContent('🇺🇸');
    });

    it('displays polish flag when polish is selected', () => {
        render(<LanguageSelector />, {
            preloadedState: {
                app: {
                    theme: 'light',
                    language: 'pl',
                    sidebarCollapsed: false,
                },
            },
        });

        const button = screen.getByRole('button', { name: /change language/i });
        expect(button).toHaveTextContent('🇵🇱');
    });

    it('opens dropdown when clicked', async () => {
        const user = userEvent.setup();

        render(<LanguageSelector />, {
            preloadedState: {
                app: {
                    theme: 'light',
                    language: 'en',
                    sidebarCollapsed: false,
                },
            },
        });

        const button = screen.getByRole('button', { name: /change language/i });
        await user.click(button);

        // Check that dropdown opened by looking for language options
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Polski')).toBeInTheDocument();
    });

    it('changes language when option is selected', async () => {
        const user = userEvent.setup();

        render(<LanguageSelector />, {
            preloadedState: {
                app: {
                    theme: 'light',
                    language: 'en',
                    sidebarCollapsed: false,
                },
            },
        });

        const button = screen.getByRole('button', { name: /change language/i });
        await user.click(button);

        const polishOption = screen.getByText('Polski');
        await user.click(polishOption);

        expect(mockChangeLanguage).toHaveBeenCalledWith('pl');
    });

    it('has correct styling', () => {
        render(<LanguageSelector />, {
            preloadedState: {
                app: {
                    theme: 'light',
                    language: 'en',
                    sidebarCollapsed: false,
                },
            },
        });

        const button = screen.getByRole('button', { name: /change language/i });

        // Check that component renders with expected CSS classes or attributes
        expect(button).toHaveAttribute('class');
        const className = button.getAttribute('class') || '';
        expect(className).toContain('ant-btn');
    });
});
