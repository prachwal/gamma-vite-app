/**
 * @fileoverview Demo usage of AISettings component
 * @since 1.0.0
 */

import React from 'react';
import { AISettings } from './AISettings';

/**
 * Example of how to integrate AISettings component into your application
 */
export const AISettingsDemo: React.FC = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>AI Provider Settings</h1>
            <p>Configure your AI providers and manage API keys:</p>

            <AISettings className="my-custom-ai-settings" />
        </div>
    );
};

// Example usage patterns are documented in the README
// See AI_INTEGRATION_SUMMARY.md for complete integration guide
