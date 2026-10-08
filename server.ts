import express from "express";
import path from "path";
import { PRODUCTS } from "./src/data/products";
import { sitemapXml, pageMetadata, privatePages } from "./src/lib/page-metadata";
import { createServer as createViteServer } from "vite";

import initiateHandler from "./api/payglocal/initiate.js";
import callbackHandler from "./api/payglocal/callback.js";
import statusHandler from "./api/payglocal/status.js";

import codConfirmationHandler from './api/cod-confirmation';
import orderConfirmationHandler from './api/order-confirmation';
import { servePrivateCheckout, isCheckoutPath, denyCheckout } from './server/private-checkout';

async function runServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Run before static serving and Vite. Bare links cannot receive the app or its code.
  app.all('/api/private-checkout', servePrivateCheckout);
  app.use((req, res, next) => {
    let pathname: string;
    try { pathname = decodeURIComponent(req.path); }
    catch { return void denyCheckout(res); }
    if (isCheckoutPath(pathname)) return void servePrivateCheckout(req, res);
    if (/garena-?checkout|(?:^|\/)(?:private|archive|build|server)(?:\/|$)|^\/@fs\/|^\/api\/.*\.(?:js|ts|map)$/i.test(pathname)) return void denyCheckout(res);
    next();
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", store: "Free Fire Store" });
  });

  // PayGlocal integration routes
  app.post("/api/payglocal/initiate", initiateHandler);
  app.all("/api/payglocal/callback", callbackHandler);
  app.get("/api/payglocal/status", statusHandler);

  app.post("/api/order-confirmation", orderConfirmationHandler);

  app.post("/api/cod-confirmation", codConfirmationHandler);

  // Crawlers receive the same catalog URLs as visitors; no user-agent branching.
  app.get("/sitemap.xml", (_req, res) => res.type("application/xml").send(sitemapXml(PRODUCTS)));

  // Serve static assets and frontend index
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { extensions: ['html'], dotfiles: 'deny' }));
    app.get("*", (req, res) => {
      const page = pageMetadata(req.path, PRODUCTS);
      // Custom products remain supported by the original browser catalog.
      if (page.found || /^\/product\/-?\d+\/?$/.test(req.path)) {
        if (privatePages[req.path] || !page.found) res.set('X-Robots-Tag', page.robots || 'noindex, follow');
        return res.sendFile(path.join(distPath, page.found ? "index.html" : "product-fallback.html"));
      }
      res.status(404).set('X-Robots-Tag', 'noindex, follow').sendFile(path.join(distPath, '404.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully on http://localhost:${PORT}`);
  });
}

runServer();
