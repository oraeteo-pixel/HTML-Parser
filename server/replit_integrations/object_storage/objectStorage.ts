import { Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import mime from "mime-types";

// Vercel 환경에서는 /tmp 만 쓰기 가능, 그 외에는 프로젝트 루트의 uploads/
const isVercel = process.env.VERCEL === "1";
export const UPLOADS_DIR = isVercel
  ? "/tmp/uploads"
  : path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// Replit 클라우드 스토리지 클라이언트 (Replit 환경에서만 활성화)
let replitStorageClient: any = null;
try {
  const { Client } = require("@replit/object-storage");
  replitStorageClient = new Client();
} catch {
  // Replit 외 환경에서는 로컬 디스크만 사용
}

const GCS_PREFIX = ".private/uploads/";

export class ObjectStorageService {
  generateObjectId(ext?: string): string {
    const id = randomUUID();
    return ext ? `${id}.${ext}` : id;
  }

  getLocalPath(objectId: string): string {
    return path.join(UPLOADS_DIR, objectId);
  }

  // 파일 업로드: 로컬 + GCS 동시 저장
  async uploadFromBuffer(buffer: Buffer, objectId: string): Promise<void> {
    const localPath = this.getLocalPath(objectId);
    fs.writeFileSync(localPath, buffer);

    if (replitStorageClient) {
      try {
        await replitStorageClient.uploadFromBytes(GCS_PREFIX + objectId, buffer);
      } catch (err) {
        console.warn("GCS upload failed, local-only:", err);
      }
    }
  }

  // 파일 다운로드: 로컬 우선, GCS 폴백
  async downloadObject(objectId: string, res: Response): Promise<void> {
    const localPath = this.getLocalPath(objectId);

    // 1순위: 로컬 디스크
    if (fs.existsSync(localPath) && fs.statSync(localPath).size > 1) {
      const contentType = mime.lookup(localPath) || "application/octet-stream";
      const stat = fs.statSync(localPath);
      res.set({
        "Content-Type": contentType,
        "Content-Length": stat.size,
        "Cache-Control": "public, max-age=86400",
      });
      fs.createReadStream(localPath).pipe(res);
      return;
    }

    // 2순위: Replit GCS (.private/uploads/ 경로)
    if (replitStorageClient) {
      const pathsToTry = [
        GCS_PREFIX + objectId,
        `uploads/${objectId}`,
        objectId,
        `public/uploads/${objectId}`,
      ];

      for (const gcsPath of pathsToTry) {
        try {
          const result = await replitStorageClient.downloadAsBytes(gcsPath);
          if (result.ok && result.value && result.value.length > 1) {
            const buf = Buffer.from(result.value);
            fs.writeFileSync(localPath, buf); // 로컬에 캐시
            const contentType = mime.lookup(objectId) || "application/octet-stream";
            res.set({
              "Content-Type": contentType,
              "Content-Length": buf.length,
              "Cache-Control": "public, max-age=86400",
            });
            res.send(buf);
            return;
          }
        } catch {
          // 다음 경로 시도
        }
      }
    }

    throw new ObjectNotFoundError();
  }

  normalizeObjectEntityPath(rawPath: string): string {
    return rawPath;
  }
}

export const objectStorageService = new ObjectStorageService();
export const objectStorageClient = replitStorageClient;
