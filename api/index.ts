import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initError: Error | null = null;
let initialized = false;

const initPromise = (async () => {
  try {
    const { registerRoutes } = await import("../server/routes");
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    initialized = true;
  } catch (err: any) {
    initError = err;
    console.error("[api] Init error:", err?.message, err?.stack);
  }
})();

export default async function handler(req: Request, res: Response) {
  await initPromise;
  if (initError) {
    return res.status(500).json({
      message: "Server initialization failed",
      error: initError.message,
      stack: (initError.stack || "").split("\n").slice(0, 8).join("\n"),
    });
  }
  return app(req, res);
}
