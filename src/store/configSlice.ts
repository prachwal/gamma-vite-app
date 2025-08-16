/**
 * @fileoverview Configuration store slice
 * 
 * Redux slice for managing application configuration state.
 * 
 * @since 1.0.0
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppConfig } from '../services/config';

/**
 * Configuration state interface
 */
export interface ConfigState {
    /** Application configuration */
    appConfig: AppConfig;
    /** Whether configuration is loaded */
    isLoaded: boolean;
}

/**
 * Initial configuration state
 */
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

/**
 * Configuration slice
 */
const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        /**
         * Set application configuration
         */
        setAppConfig: (state, action: PayloadAction<AppConfig>) => {
            state.appConfig = action.payload;
            state.isLoaded = true;
        },
        /**
         * Reset configuration state
         */
        resetConfig: (state) => {
            state.appConfig = initialState.appConfig;
            state.isLoaded = false;
        },
    },
});

export const { setAppConfig, resetConfig } = configSlice.actions;
export default configSlice.reducer;
