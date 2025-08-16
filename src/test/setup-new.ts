/**
 * @fileoverview Vitest setup file for configuring testing environment
 * @since 1.0.0
 */

import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach, afterAll } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock localStorage
const localStorageData: Record<string, string> = {};

const localStorageMock = {
    getItem: vi.fn((key: string) => localStorageData[key] || null),
    setItem: vi.fn((key: string, value: string) => {
        localStorageData[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
        delete localStorageData[key];
    }),
    clear: vi.fn(() => {
        Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
    }),
    get length() {
        return Object.keys(localStorageData).length;
    },
    key: vi.fn((index: number) => {
        const keys = Object.keys(localStorageData);
        return keys[index] || null;
    }),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
    value: vi.fn().mockImplementation(() => ({
        getPropertyValue: vi.fn(() => ''),
    })),
});

// Mock URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
    value: vi.fn(() => 'mocked-object-url'),
});

// Mock URL.revokeObjectURL
Object.defineProperty(window.URL, 'revokeObjectURL', {
    value: vi.fn(),
});

// Reset all mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage data
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
});

// Mock console methods to reduce noise in tests (optional)
const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => { });
const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => { });

// Clean up after each test
afterEach(() => {
    consoleMock.mockClear();
    consoleWarnMock.mockClear();
});

// Restore console methods after all tests
afterAll(() => {
    consoleMock.mockRestore();
    consoleWarnMock.mockRestore();
});
