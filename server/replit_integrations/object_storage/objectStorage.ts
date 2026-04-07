import { Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import mime from "mime-types";

export const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

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
  constructor() {}

  generateObjectId(ext?: string): string {
    const id = randomUUID();
    return ext ? `${id}.${ext}` : id;
  }

  getLocalPath(objectId: string): string {
    return path.join(UPLOADS_DIR, objectId);
  }

  async downloadObject(objectId: string, res: Response): Promise<void> {
    const filePath = this.getLocalPath(objectId);
    if (!fs.existsSync(filePath)) {
      throw new ObjectNotFoundError();
    }
    const contentType = mime.lookup(filePath) || "application/octet-stream";
    const stat = fs.statSync(filePath);
    res.set({
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Cache-Control": "public, max-age=3600",
    });
    fs.createReadStream(filePath).pipe(res);
  }

  normalizeObjectEntityPath(rawPath: string): string {
    return rawPath;
  }
}

export const objectStorageClient = null;
