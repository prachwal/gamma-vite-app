import type { Preview } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/store';
import { ThemeProvider } from '../src/components/ThemeProvider';
import '../src/index.css';

// Global decorator that wraps all stories with necessary providers
import type { StoryFn, StoryContext } from '@storybook/react';

const withProviders = (Story: StoryFn, context: StoryContext) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        {Story(context.args, context)}
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // Show a11y violations in the test UI only
      test: 'todo'
    }
  },
};

export default preview;