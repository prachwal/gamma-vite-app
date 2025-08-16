/**
 * @fileoverview Setup dla testów Vitest z kompletnym mockingiem
 * @since 1.0.0
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock ResizeObserver
vi.stubGlobal('ResizeObserver', vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
})));

// Mock matchMedia
vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
})));

// Mock localStorage
const storageData: Record<string, string> = {};

const localStorageMock = {
    getItem: vi.fn((key: string) => {
        if (key === 'language') return 'en';
        if (key === 'theme') return 'light';
        // Return stored data for AI-related keys
        return storageData[key] || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
        storageData[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
        delete storageData[key];
    }),
    clear: vi.fn(() => {
        Object.keys(storageData).forEach(key => delete storageData[key]);
    }),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock fetch globally
vi.stubGlobal('fetch', vi.fn());

// Mock getComputedStyle for JSDOM
Object.defineProperty(window, 'getComputedStyle', {
    value: vi.fn(() => ({
        getPropertyValue: vi.fn(() => ''),
        width: '0px',
        height: '0px',
    })),
    writable: true,
});

// Mock Element.prototype.scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: vi.fn(),
    writable: true,
});

// Mock IntersectionObserver
vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
})));

// Mock window dimensions dla useResponsive
Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
});

// Mock window dla SSR
Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: {
        pathname: '/',
        search: '',
        hash: '',
    },
});

// Mock console dla czyszczych testów
vi.stubGlobal('console', {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
});