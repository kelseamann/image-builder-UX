// SEMANTIC-UI-LAYER REMINDER: This project uses semantic-ui-layer via npm link.
// Do NOT reinstall semantic-ui-layer dependencies - preserve the npm link for development.

import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { NamingModeProvider } from '@app/contexts/NamingModeContext';
import '@app/app.css';

const App: React.FunctionComponent = () => {
  // Determine basename based on environment and current location
  const getBasename = () => {
    if (process.env.NODE_ENV === 'production') {
      return '/image-builder-UX';
    }
    // For development, check if we're running on GitHub Pages or locally
    if (window.location.hostname.includes('github.io')) {
      return '/image-builder-UX';
    }
    return undefined; // No basename for local development
  };

  return (
    <NamingModeProvider>
      <Router basename={getBasename()}>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </NamingModeProvider>
  );
};

export default App;
