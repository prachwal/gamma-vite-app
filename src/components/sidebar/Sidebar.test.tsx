/**
 * @fileoverview Tests for Sidebar component
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, userEvent } from "../../test/utils";
import { Sidebar } from "./Sidebar";

// Mock React Router
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/" };

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

// Mock useResponsive hook
vi.mock("../../hooks/useResponsive", () => ({
    useResponsive: vi.fn(() => ({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        deviceType: 'desktop' as const,
        windowSize: { width: 1200, height: 800 }
    })),
}));

// Mock i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'navigation.home': 'Home',
                'navigation.about': 'About',
                'navigation.settings': 'Settings',
            };
            return translations[key] || key;
        },
    }),
}));

describe("Sidebar", () => {
    const mockProps = {
        collapsed: false,
        onCollapse: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders sidebar with navigation items", () => {
        const { getByRole } = render(<Sidebar {...mockProps} />);

        const sidebar = getByRole("complementary");
        expect(sidebar).toBeInTheDocument();
    });

    it("shows navigation labels when not collapsed", () => {
        const { getByText } = render(<Sidebar {...mockProps} />);

        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("About")).toBeInTheDocument();
        expect(getByText("Settings")).toBeInTheDocument();
    });

    it("navigates when menu item is clicked", async () => {
        const { getByText } = render(<Sidebar {...mockProps} />);

        const homeLink = getByText("Home");
        const user = userEvent.setup();

        await user.click(homeLink);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("handles collapsed state", () => {
        const { container } = render(<Sidebar {...mockProps} collapsed={true} />);

        const sider = container.querySelector(".ant-layout-sider");
        expect(sider).toHaveClass("ant-layout-sider-collapsed");
    });

    it("calls onCollapse when collapse trigger is used", async () => {
        const onCollapse = vi.fn();
        const { container } = render(
            <Sidebar {...mockProps} onCollapse={onCollapse} />
        );

        // Find the collapse trigger button
        const collapseButton = container.querySelector(".ant-layout-sider-trigger");

        if (collapseButton) {
            const user = userEvent.setup();
            await user.click(collapseButton);
            expect(onCollapse).toHaveBeenCalled();
        }
    });

    it("applies custom className when provided", () => {
        const { container } = render(
            <Sidebar {...mockProps} className="custom-sidebar" />
        );

        const sider = container.querySelector(".ant-layout-sider");
        expect(sider).toHaveClass("custom-sidebar");
    });

    it("highlights current page in navigation", () => {
        mockLocation.pathname = "/about";

        const { container } = render(<Sidebar {...mockProps} />);

        // Menu should have selected item based on current location
        const selectedItem = container.querySelector(".ant-menu-item-selected");
        expect(selectedItem).toBeInTheDocument();
    });

    it("handles mobile responsive behavior", async () => {
        const { useResponsive } = await import("../../hooks/useResponsive");
        vi.mocked(useResponsive).mockReturnValue({
            isMobile: true,
            isTablet: false,
            isDesktop: false,
            deviceType: 'mobile' as const,
            windowSize: { width: 400, height: 800 }
        });

        const { container } = render(<Sidebar {...mockProps} />);

        // Sidebar should handle mobile layout appropriately
        const sider = container.querySelector(".ant-layout-sider");
        expect(sider).toBeInTheDocument();
    });

    it("renders with correct ARIA attributes", () => {
        const { getByRole } = render(<Sidebar {...mockProps} />);

        const sidebar = getByRole("complementary");
        expect(sidebar).toBeInTheDocument();

        const navigation = getByRole("menu");
        expect(navigation).toBeInTheDocument();
    });
});
