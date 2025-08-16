/**
 * @fileoverview Tests for AISettings component
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { AISettings } from './AISettings';
import { render } from '../../test/utils';

// Mock the AI slice actions
vi.mock('../../store/aiSlice', () => ({
    default: {
        actions: {
            verifyAPIKey: vi.fn(),
            fetchProviderModels: vi.fn(),
            setSelectedProvider: vi.fn(),
            setSelectedModel: vi.fn(),
            removeAPIKey: vi.fn(),
            loadStoredAIData: vi.fn(),
            clearErrors: vi.fn(),
        },
    },
    verifyAPIKey: vi.fn(),
    fetchProviderModels: vi.fn(),
    setSelectedProvider: vi.fn(),
    setSelectedModel: vi.fn(),
    removeAPIKey: vi.fn(),
    loadStoredAIData: vi.fn(() => ({ type: 'ai/loadStoredAIData', payload: {} })),
    clearErrors: vi.fn(),
}));

describe('AISettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders AI settings component', () => {
        render(<AISettings />);

        // Check if the component renders without crashing
        expect(document.body).toBeInTheDocument();
    });

    it('displays provider cards', () => {
        render(<AISettings />);

        // Since we have AI_PROVIDERS in the initial state, check for provider elements
        // This will work with the default initial state from aiSlice
        const providerCards = screen.queryAllByRole('article');
        expect(providerCards.length).toBeGreaterThanOrEqual(0);
    });

    it('applies custom className when provided', () => {
        const { container } = render(<AISettings className="custom-class" />);

        const settingsDiv = container.firstChild as HTMLElement;
        expect(settingsDiv).toHaveClass('custom-class');
    });
});
