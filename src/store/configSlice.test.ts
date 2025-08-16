/**
 * @fileoverview Configuration store slice tests
 * 
 * Tests for configuration Redux slice.
 * 
 * @since 1.0.0
 */

import { describe, it, expect } from 'vitest';
import configReducer, { setAppConfig, resetConfig } from './configSlice';
import type { ConfigState } from './configSlice';
import type { AppConfig } from '../services/config';

describe('configSlice', () => {
    const initialState: ConfigState = {
        appConfig: {
            name: '',
            version: '',
            description: '',
            author: '',
            buildDate: '',
        },
        isLoaded: false,
    };

    it('should return the initial state', () => {
        expect(configReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setAppConfig', () => {
        const appConfig: AppConfig = {
            name: 'Test App',
            version: '1.0.0',
            description: 'Test Description',
            author: 'Test Author',
            buildDate: '2025-08-16',
        };

        const actual = configReducer(initialState, setAppConfig(appConfig));

        expect(actual.appConfig).toEqual(appConfig);
        expect(actual.isLoaded).toBe(true);
    });

    it('should handle resetConfig', () => {
        const stateWithConfig: ConfigState = {
            appConfig: {
                name: 'Test App',
                version: '1.0.0',
                description: 'Test Description',
                author: 'Test Author',
                buildDate: '2025-08-16',
            },
            isLoaded: true,
        };

        const actual = configReducer(stateWithConfig, resetConfig());

        expect(actual).toEqual(initialState);
    });
});
