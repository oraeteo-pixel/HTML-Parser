import { Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import mime from "mime-types";

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

export class ObjectStorageService {
  generateObjectId(ext?: string): string {
    const id = randomUUID();
    return ext ? `${id}.${ext}` : id;
  }

  getLocalPath(objectId: string): string {
    return path.join(UPLOADS_DIR, objectId);
  }

  async uploadFromBuffer(buffer: Buffer, objectId: string): Promise<void> {
    const localPath = this.getLocalPath(objectId);
    fs.writeFileSync(localPath, buffer);
  }

  async downloadObject(objectId: string, res: Response): Promise<void> {
    const localPath = this.getLocalPath(objectId);

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

    throw new ObjectNotFoundError();
  }

  normalizeObjectEntityPath(rawPath: string): string {
    return rawPath;
  }
}

export const objectStorageService = new ObjectStorageService();
