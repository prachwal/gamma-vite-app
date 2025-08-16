import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import { AIPage } from './AIPage';

describe('AIPage', () => {
    it('renders page title', () => {
        render(<AIPage />);
        expect(screen.getByText('AI Configuration')).toBeInTheDocument();
    });

    it('renders description text', () => {
        render(<AIPage />);
        expect(screen.getByText(/Configure API keys and models/)).toBeInTheDocument();
    });

    it('renders AI settings component', () => {
        render(<AIPage />);
        expect(screen.getByText('AI Provider Settings')).toBeInTheDocument();
    });
});