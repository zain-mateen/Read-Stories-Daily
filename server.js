/**
 * Custom server entry point for GoDaddy's cPanel "Setup Node.js App"
 * (Phusion Passenger). Passenger requires a plain Node.js file it can
 * `require()` directly — it doesn't invoke `next start` itself — so this
 * wraps Next.js's request handler in a standard `http` server.
 *
 * Set this file as the "Application startup file" in cPanel.
 * Passenger provides the port to listen on via process.env.PORT.
 *
 * This file is NOT processed by the Next.js compiler (see the custom
 * server guide), so it must be plain, current-Node-compatible CommonJS.
 */
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, () => {
      console.log(
        `> Read Stories Daily listening on port ${port} (${
          dev ? "development" : "production"
        })`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
