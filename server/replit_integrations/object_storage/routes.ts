import type { Express } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { objectStorageService, ObjectNotFoundError, UPLOADS_DIR } from "./objectStorage";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).replace(".", "");
    const id = randomUUID();
    cb(null, ext ? `${id}.${ext}` : id);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

async function backupToGCS(filename: string): Promise<void> {
  try {
    const localPath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(localPath)) {
      const buf = fs.readFileSync(localPath);
      await objectStorageService.uploadFromBuffer(buf, filename);
    }
  } catch {
    // GCS 백업 실패 시 무시 (로컬만 사용)
  }
}

export function registerObjectStorageRoutes(app: Express): void {
  app.post("/api/uploads/request-url", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      await backupToGCS(req.file.filename);
      const objectPath = `/objects/uploads/${req.file.filename}`;
      res.json({
        uploadURL: objectPath,
        objectPath,
        metadata: {
          name: req.file.originalname,
          size: req.file.size,
          contentType: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.post("/api/uploads", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      await backupToGCS(req.file.filename);
      const objectPath = `/objects/uploads/${req.file.filename}`;
      res.json({
        uploadURL: objectPath,
        objectPath,
        metadata: {
          name: req.file.originalname,
          size: req.file.size,
          contentType: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const fullPath = req.path;
      const objectId = fullPath
        .replace(/^\/objects\/uploads\//, "")
        .replace(/^\/objects\//, "");
      await objectStorageService.downloadObject(objectId, res);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      console.error("Error serving object:", error);
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });
}
