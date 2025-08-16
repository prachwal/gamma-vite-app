/**
 * @fileoverview Configuration service tests
 * 
 * Tests for application configuration service.
 * 
 * @since 1.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAppConfig } from './config';

// Mock import.meta.env
const mockEnv = vi.hoisted(() => ({
    VITE_APP_NAME: 'Test App',
    VITE_APP_VERSION: '2.0.0',
    VITE_APP_DESCRIPTION: 'Test Description',
    VITE_APP_AUTHOR: 'Test Author',
    VITE_BUILD_DATE: '2025-08-16',
}));

vi.stubGlobal('import', {
    meta: {
        env: mockEnv,
    },
});

describe('config service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAppConfig', () => {
        it('should return configuration from environment variables', () => {
            const config = getAppConfig();

            expect(config).toEqual({
                name: 'Gamma Vite App',
                version: '1.0.0',
                description: 'Advanced React 19 + TypeScript Application with AI Integration',
                author: 'Gamma Team',
                buildDate: '2025-08-16',
            });
        });

        it('should return default values when env vars are missing', () => {
            // Mock empty environment
            vi.stubGlobal('import', {
                meta: {
                    env: {},
                },
            });

            const config = getAppConfig();

            expect(config.name).toBe('Gamma Vite App');
            expect(config.version).toBe('1.0.0');
            expect(config.description).toBe('Advanced React 19 + TypeScript Application with AI Integration');
            expect(config.author).toBe('Gamma Team');
            expect(config.buildDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });
});
