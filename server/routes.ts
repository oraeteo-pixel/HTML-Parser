import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Replit authentication (passport, session, OIDC)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // === Posts Routes ===
  
  // List Posts
  app.get("/api/posts", async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  // Get posts by ganji
  app.get("/api/posts/ganji/:ganji", async (req, res) => {
    const { ganji } = req.params;
    const posts = await storage.getPostsByGanji(ganji);
    res.json(posts);
  });

  // Get latest posts grouped by ganji
  app.get("/api/madang/latest", async (req, res) => {
    const grouped = await storage.getLatestPostsByGanji();
    res.json(grouped);
  });

  // Get posts by section (ebook, madang, etc.)
  app.get("/api/posts/section/:section", async (req, res) => {
    const { section } = req.params;
    const posts = await storage.getPostsBySection(section);
    res.json(posts);
  });

  // Create Post (protected)
  app.post("/api/posts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Create post with logged-in user as author
      const post = await storage.createPost({
        ...req.body,
        authorId: userId,
      });
      
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Comments Routes ===
  
  // Get comments for a post
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const comments = await storage.getCommentsByPostId(postId);
    res.json(comments);
  });

  // Create comment (protected)
  app.post("/api/posts/:postId/comments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const contentSchema = z.object({
        content: z.string().min(1, "답글 내용을 입력해 주세요."),
      });
      
      const parsed = contentSchema.parse(req.body);
      
      const comment = await storage.createComment({
        postId,
        content: parsed.content,
        authorId: userId,
      });
      
      res.status(201).json(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
