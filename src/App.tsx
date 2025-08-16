/**
 * @fileoverview Main application component
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App as AntApp, Spin } from 'antd';
import { store } from './store';
// ...existing code...
import { ThemeProvider } from './components';
import { MainLayout } from './layouts';
import './styles/globals.css';

// Lazy load layouts
const AILayout = React.lazy(() => import('./layouts').then(module => ({ default: module.AILayout })));

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const AIOverviewPage = React.lazy(() => import('./pages/ai-overview').then(module => ({ default: module.AIOverviewPage })));
const ChatPage = React.lazy(() => import('./pages/chat').then(module => ({ default: module.ChatPage })));
const ModelBrowser = React.lazy(() => import('./pages/model-browser').then(module => ({ default: module.ModelBrowser })));
const ProviderManagementPage = React.lazy(() => import('./pages/provider-management').then(module => ({ default: module.ProviderManagementPage })));
const NotFoundPage = React.lazy(() => import('./pages/error').then(module => ({ default: module.NotFoundPage })));

/**
 * Loading fallback component
 */
const LoadingFallback: React.FC = () => (
  <Spin size="large" tip="Loading application...">
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      minHeight: '200px'
    }} />
  </Spin>
);/**
 * Main application component
 * Sets up routing, state management, theming, and internationalization
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <AntApp>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="settings" element={<SettingsPage />} />

                  {/* AI Section */}
                  <Route path="ai" element={<AILayout />}>
                    <Route index element={<AIOverviewPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="models" element={<ModelBrowser />} />
                    <Route path="providers" element={<ProviderManagementPage />} />
                  </Route>

                  {/* Catch all 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </AntApp>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
