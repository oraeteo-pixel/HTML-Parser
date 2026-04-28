import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const secret = process.env.SESSION_SECRET || "orae-default-dev-secret-change-in-production";

  if (!process.env.SESSION_SECRET) {
    console.warn("[auth] SESSION_SECRET not set. Using default secret (unsafe for production).");
  }

  // connect-pg-simple uses TCP/WebSocket which doesn't work in Vercel serverless.
  // Only use pg session store in non-Vercel environments.
  const isVercel = process.env.VERCEL === "1";

  if (!isVercel && process.env.DATABASE_URL) {
    try {
      const pg = require("pg");

      function cleanPgUrl(url: string): string {
        try {
          const u = new URL(url);
          u.searchParams.delete("channel_binding");
          return u.toString();
        } catch {
          return url;
        }
      }

      const connectPg = require("connect-pg-simple");
      const pgStore = connectPg(session);
      const sessionStore = new pgStore({
        conString: cleanPgUrl(process.env.DATABASE_URL!),
        createTableIfMissing: true,
        ttl: sessionTtl,
        tableName: "sessions",
      });
      console.log("[auth] Using PostgreSQL session store.");
      return session({
        secret,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: sessionTtl,
        },
      });
    } catch (err) {
      console.error("[auth] Failed to init PostgreSQL session store, falling back to memory store:", err);
    }
  } else if (isVercel) {
    console.log("[auth] Vercel environment detected. Using in-memory session store.");
  } else {
    console.warn("[auth] DATABASE_URL not set. Using in-memory session store.");
  }

  const MemoryStore = require("memorystore")(session);
  return session({
    secret,
    store: new MemoryStore({ checkPeriod: sessionTtl }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const sessionData = req.session as any;
  if (sessionData?.userId && sessionData?.provider) {
    (req as any).oauthUser = {
      id: sessionData.userId,
      provider: sessionData.provider,
    };
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
