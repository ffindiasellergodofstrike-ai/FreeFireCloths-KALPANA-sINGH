import { build } from 'esbuild';
import { rm } from 'node:fs/promises';

// Never put this output in dist: it is served through the gated API handler.
await rm('build/private-checkout', { recursive: true, force: true });
await build({
  entryPoints: ['private/checkout/main.tsx'],
  outfile: 'build/private-checkout/checkout.js',
  bundle: true, platform: 'browser', format: 'iife', jsx: 'automatic',
  minify: true, sourcemap: false, target: 'es2015',
  define: { 'process.env.NODE_ENV': '"production"' },
});
console.log('Built checkout asset outside the public static directory.');
