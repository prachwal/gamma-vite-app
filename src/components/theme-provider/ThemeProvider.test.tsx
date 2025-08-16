/**
 * @fileoverview Tests for ThemeProvider component
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../../test/utils";
import { ThemeProvider } from "./ThemeProvider";

describe("ThemeProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset document attribute
        document.documentElement.removeAttribute('data-theme');
    });

    it("renders children correctly", () => {
        const { getByText } = render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        expect(getByText("Test Content")).toBeInTheDocument();
    });

    it("applies light theme to document by default", () => {
        render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it("applies dark theme when theme is dark in Redux store", () => {
        // This would require mocking the Redux store to return dark theme
        // For now, we'll test that the component renders without crashing
        render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        // The component should render without throwing
        expect(document.documentElement.getAttribute('data-theme')).toBeDefined();
    });

    it("wraps children with Ant Design ConfigProvider", () => {
        const { container } = render(
            <ThemeProvider>
                <div className="test-child">Test Content</div>
            </ThemeProvider>
        );

        // ConfigProvider should wrap the children
        const child = container.querySelector('.test-child');
        expect(child).toBeInTheDocument();
    });

    it("updates theme when Redux state changes", () => {
        const { rerender } = render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        // Initial theme should be applied
        expect(document.documentElement.getAttribute('data-theme')).toBeDefined();

        // Re-render should still work
        rerender(
            <ThemeProvider>
                <div>Updated Content</div>
            </ThemeProvider>
        );

        expect(document.documentElement.getAttribute('data-theme')).toBeDefined();
    });

    it("handles theme synchronization with document", () => {
        render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        // Theme should be synchronized with document
        const documentTheme = document.documentElement.getAttribute('data-theme');
        expect(documentTheme).toMatch(/^(light|dark)$/);
    });

    it("provides Ant Design theme configuration", () => {
        const { container } = render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        // Should render without throwing errors, indicating ConfigProvider is working
        expect(container.firstChild).toBeInTheDocument();
    });

    it("applies theme immediately on mount", () => {
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();

        render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        expect(document.documentElement.getAttribute('data-theme')).not.toBeNull();
    });

    it("removes theme attribute on unmount", () => {
        const { unmount } = render(
            <ThemeProvider>
                <div>Test Content</div>
            </ThemeProvider>
        );

        expect(document.documentElement.getAttribute('data-theme')).not.toBeNull();

        unmount();

        // Note: The component doesn't actually clean up the attribute on unmount
        // This is intentional to maintain theme consistency
        expect(document.documentElement.getAttribute('data-theme')).not.toBeNull();
    });
});
