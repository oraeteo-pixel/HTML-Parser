import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json({
  verify: (req: any, _res, buf) => { req.rawBody = buf; },
}));
app.use(express.urlencoded({ extended: false }));

let initError: Error | null = null;

const initPromise = (async () => {
  try {
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
  } catch (err: any) {
    initError = err;
    console.error("[api] Init error:", err?.message, "\n", err?.stack);
  }
})();

export default async function handler(req: Request, res: Response) {
  await initPromise;
  if (initError) {
    return res.status(500).json({
      message: "Server initialization failed",
      error: initError.message,
      stack: (initError.stack || "").split("\n").slice(0, 5).join("\n"),
    });
  }
  return app(req, res);
}
