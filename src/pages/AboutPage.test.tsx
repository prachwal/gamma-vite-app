/**
 * @fileoverview Tests for AboutPage component
 * @since 1.0.0
 */

import { describe, it, expect } from 'vitest';
import { render } from '../test/utils';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<AboutPage />);
        expect(container).toBeInTheDocument();
    });

    it('displays page content', () => {
        const { getByText } = render(<AboutPage />);
        // Look for the page title
        expect(getByText('pages.about.title')).toBeInTheDocument();
    });

    it('applies correct styling', () => {
        const { container } = render(<AboutPage />);
        const pageElement = container.firstChild;
        expect(pageElement).toHaveStyle({
            padding: expect.any(String),
        });
    });
});
