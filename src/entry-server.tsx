import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppShell } from './App';
import ErrorBoundary from './components/ErrorBoundary';

export function renderRoute(url: string): string {
  return renderToString(
    <ErrorBoundary>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </ErrorBoundary>,
  );
}
