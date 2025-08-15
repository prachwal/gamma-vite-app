/**
 * @fileoverview Main application component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
// ...existing code...
import { ThemeProvider } from './components/ThemeProvider';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';
import './styles/globals.css';

/**
 * Main application component
 * Sets up routing, state management, theming, and internationalization
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
