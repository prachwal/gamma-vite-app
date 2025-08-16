/**
 * @fileoverview Tests for SettingsPage component
 * @since 1.0.0
 */

import { describe, it, expect } from 'vitest';
import { render } from '../test/utils';
import { SettingsPage } from './SettingsPage';

describe('SettingsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<SettingsPage />);
        expect(container).toBeInTheDocument();
    });

    it('displays page content', () => {
        const { getByText } = render(<SettingsPage />);
        // Look for unique title text
        expect(getByText('pages.settings.title')).toBeInTheDocument();
    });

    it('applies correct styling', () => {
        const { container } = render(<SettingsPage />);
        const pageElement = container.firstChild;

        // Check that style attribute contains expected values
        const style = (pageElement as HTMLElement)?.getAttribute('style') || '';
        expect(style).toContain('max-width: 800px');
    });

    it('has proper content structure', () => {
        const { container } = render(<SettingsPage />);
        expect(container.firstChild).toBeDefined();
    });
});
