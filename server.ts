import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function runServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", store: "Garena Official Free Fire Store" });
  });

  // PayGlocal integration routes
  app.post("/api/payglocal/initiate", async (req, res) => {
    const handler = (await import("./api/payglocal/initiate.js")).default;
    return handler(req, res);
  });
  app.post("/api/payglocal/callback", async (req, res) => {
    const handler = (await import("./api/payglocal/callback.js")).default;
    return handler(req, res);
  });
  app.get("/api/payglocal/status", async (req, res) => {
    const handler = (await import("./api/payglocal/status.js")).default;
    return handler(req, res);
  });

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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully on http://localhost:${PORT}`);
  });
}

runServer();
