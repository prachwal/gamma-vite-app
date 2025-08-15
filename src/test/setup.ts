/**
 * @fileoverview Vitest setup file for configuring testing environment
 * @since 1.0.0
 */

import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation
  }
  
  unobserve() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock localStorage with proper typing
const localStorageData: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => {
    return localStorageData[key] || null;
  },
  setItem: (key: string, value: string): void => {
    localStorageData[key] = value;
  },
  removeItem: (key: string): void => {
    delete localStorageData[key];
  },
  clear: (): void => {
    Object.keys(localStorageData).forEach(key => {
      delete localStorageData[key];
    });
  },
  get length() {
    return Object.keys(localStorageData).length;
  },
  key: (index: number): string | null => {
    const keys = Object.keys(localStorageData);
    return keys[index] || null;
  }
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});
