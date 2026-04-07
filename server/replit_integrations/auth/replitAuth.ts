import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import MySQLStoreFactory from "express-mysql-session";

function parseMysqlUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
  };
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const MySQLStore = MySQLStoreFactory(session);

  const dbUrl = process.env.DATABASE_URL || "";
  const dbConfig = parseMysqlUrl(dbUrl);

  const sessionStore = new MySQLStore({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "sid",
        expires: "expire",
        data: "sess",
      },
    },
  });

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
