/**
 * @fileoverview Setup dla mocków w testach
 * @since 1.0.0
 */

import { vi } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/' }),
    };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'nav.home': 'Home',
                'nav.profile': 'Profile',
                'nav.settings': 'Settings',
                'nav.about': 'About',
                'header.title': 'Test App',
                'header.toggleSidebar': 'Toggle Sidebar',
                'header.closeSidebar': 'Close Menu',
                'language.changeLanguage': 'Change Language',
                'theme.toggleTheme': 'Toggle Theme',
                'pages.home.title': 'Welcome to Gamma Vite App',
                'pages.home.welcome': 'Welcome to Gamma Vite App',
                'pages.home.description': 'A modern React application with TypeScript, Vite, and Ant Design',
                'features.modern.title': 'Modern Stack',
                'features.modern.description': 'Built with React 19, TypeScript, and Vite',
                'features.responsive.title': 'Responsive Design',
                'features.responsive.description': 'Optimized for mobile and desktop',
                'features.i18n.title': 'Internationalization',
                'features.i18n.description': 'Support for multiple languages'
            };
            return translations[key] || key;
        },
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        }
    })
}));
