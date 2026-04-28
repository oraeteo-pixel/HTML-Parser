import { Store } from "express-session";
import { neon } from "@neondatabase/serverless";

// Neon HTTP 기반 세션 스토어 - Vercel 서버리스 호환
// TCP 연결 없이 HTTP 쿼리로 세션을 PostgreSQL에 저장

export class NeonSessionStore extends Store {
  private sql: ReturnType<typeof neon>;
  private ttl: number;

  constructor(databaseUrl: string, ttl = 7 * 24 * 60 * 60 * 1000) {
    super();
    this.sql = neon(databaseUrl);
    this.ttl = ttl;
    this.ensureTable();
  }

  private async ensureTable() {
    try {
      await this.sql.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          sid VARCHAR NOT NULL PRIMARY KEY,
          sess JSONB NOT NULL,
          expire TIMESTAMP NOT NULL
        )
      `);
      await this.sql.query(`
        CREATE INDEX IF NOT EXISTS sessions_expire_idx ON sessions (expire)
      `);
    } catch (e) {
      console.error("[NeonSessionStore] ensureTable error:", e);
    }
  }

  get(sid: string, callback: (err: any, session?: any) => void) {
    this.sql.query(
      "SELECT sess FROM sessions WHERE sid = $1 AND expire > NOW()",
      [sid]
    )
      .then((result: any) => {
        const rows = result?.rows ?? result;
        if (!rows || rows.length === 0) return callback(null, null);
        callback(null, rows[0].sess);
      })
      .catch((err: any) => callback(err));
  }

  set(sid: string, session: any, callback?: (err?: any) => void) {
    const expire = new Date(Date.now() + this.ttl).toISOString();
    const sess = JSON.stringify(session);
    this.sql.query(
      `INSERT INTO sessions (sid, sess, expire)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (sid) DO UPDATE SET sess = $2::jsonb, expire = $3`,
      [sid, sess, expire]
    )
      .then(() => callback && callback())
      .catch((err: any) => callback && callback(err));
  }

  destroy(sid: string, callback?: (err?: any) => void) {
    this.sql.query("DELETE FROM sessions WHERE sid = $1", [sid])
      .then(() => callback && callback())
      .catch((err: any) => callback && callback(err));
  }

  touch(sid: string, session: any, callback?: (err?: any) => void) {
    const expire = new Date(Date.now() + this.ttl).toISOString();
    this.sql.query(
      "UPDATE sessions SET expire = $1 WHERE sid = $2",
      [expire, sid]
    )
      .then(() => callback && callback())
      .catch((err: any) => callback && callback(err));
  }
}
