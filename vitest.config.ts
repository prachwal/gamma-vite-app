/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        // Global setup dla wszystkich testów
        setupFiles: ['./src/test/setup.ts', './src/test/mocks.ts'],
        include: [
            'src/**/*.{test,spec}.{ts,tsx}'
        ],
        exclude: [
            'node_modules/**/*',
            'dist/**/*',
            'coverage/**/*',
            'src/**/*.stories.{ts,tsx}',
            '.storybook/**/*',
            'storybook-static/**/*',
            'docs/**/*'
        ],
        reporters: ['verbose'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            exclude: [
                // Node modules
                'node_modules/**',

                // Build outputs
                'dist/**',
                'coverage/**',
                'storybook-static/**',
                'docs/**',

                // Config files
                'vite.config.ts',
                'vitest.config.ts',
                'eslint.config.js',
                'typedoc.json',
                'tsconfig*.json',
                '*.config.{js,ts,mjs}',

                // Storybook files
                '.storybook/**',
                'src/**/*.stories.{ts,tsx}',

                // Test files themselves
                'src/test/**',
                'src/**/*.{test,spec}.{ts,tsx}',

                // Type definitions
                '**/*.d.ts',
                'src/vite-env.d.ts',

                // Main entry point (minimal logic)
                'src/main.tsx',

                // Static assets
                'public/**',
                'src/assets/**',

                // VS Code config
                '.vscode/**'
            ],
            include: [
                'src/**/*.{ts,tsx}',
                '!src/test/**',
                '!src/**/*.stories.{ts,tsx}',
                '!src/**/*.{test,spec}.{ts,tsx}',
                '!src/main.tsx',
                '!src/vite-env.d.ts'
            ],
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80
                }
            }
        },
        // Mock configurations
        server: {
            deps: {
                inline: ['vitest-canvas-mock']
            }
        },
        // Timeout configurations
        testTimeout: 10000,
        hookTimeout: 10000
    }
});
