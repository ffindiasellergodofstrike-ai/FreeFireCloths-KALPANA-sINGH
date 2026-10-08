import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import {installHostedImageFallback} from './lib/hosted-images.ts';
import './index.css';
import './storefront.css';
import './account.css';
import './presentation.css';

installHostedImageFallback();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
