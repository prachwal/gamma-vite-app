/**
 * @fileoverview Redux store configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';

/**
 * Configure and create Redux store
 */
export const store = configureStore({
    reducer: {
        app: appReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [],
            },
        }),
    devTools: import.meta.env.DEV,
});

/**
 * Root state type
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * App dispatch type
 */
export type AppDispatch = typeof store.dispatch;
