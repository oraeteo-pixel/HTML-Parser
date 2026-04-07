import type { Express } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { ObjectStorageService, ObjectNotFoundError, UPLOADS_DIR } from "./objectStorage";

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

export function registerObjectStorageRoutes(app: Express): void {
  const objectStorageService = new ObjectStorageService();

  app.post("/api/uploads/request-url", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
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
      const objectId = fullPath.replace(/^\/objects\/uploads\//, "").replace(/^\/objects\//, "");
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
