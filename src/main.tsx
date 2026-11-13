import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import {installHostedImageFallback} from './lib/hosted-images.ts';
import './index.css';
import './storefront.css';
import './account.css';
import './presentation.css';

installHostedImageFallback();

const rootElement = document.getElementById('root')!;
const appTree = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, appTree);
} else {
  createRoot(rootElement).render(appTree);
}
