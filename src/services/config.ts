/**
 * @fileoverview Application configuration service
 * 
 * Service for managing application configuration from environment variables.
 * 
 * @since 1.0.0
 */

/**
 * Application configuration interface
 */
export interface AppConfig {
    /** Application name */
    name: string;
    /** Application version */
    version: string;
    /** Application description */
    description: string;
    /** Application author */
    author: string;
    /** Build date */
    buildDate: string;
}

/**
 * Get application configuration from environment variables
 * 
 * @returns Application configuration object
 * 
 * @example
 * ```typescript
 * const config = getAppConfig();
 * console.log(config.name); // "Gamma Vite App"
 * ```
 */
export const getAppConfig = (): AppConfig => ({
    name: import.meta.env.VITE_APP_NAME || 'Gamma Vite App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'React Application',
    author: import.meta.env.VITE_APP_AUTHOR || 'Unknown',
    buildDate: import.meta.env.VITE_BUILD_DATE || new Date().toISOString().split('T')[0],
});
