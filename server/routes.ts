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
        content: z.string(),
        mediaUrls: z.array(z.string()).optional(),
        youtubeUrls: z.array(z.string()).optional(),
      }).refine(
        (data) => data.content.trim().length > 0 || (data.mediaUrls && data.mediaUrls.length > 0) || (data.youtubeUrls && data.youtubeUrls.length > 0),
        { message: "답글 내용이나 미디어를 입력해 주세요." }
      );
      
      const parsed = contentSchema.parse(req.body);
      
      const comment = await storage.createComment({
        postId,
        content: parsed.content,
        authorId: userId,
        mediaUrls: parsed.mediaUrls,
        youtubeUrls: parsed.youtubeUrls,
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

  // === Vote Routes ===
  
  // Vote on a post (like/dislike)
  app.post("/api/posts/:postId/vote", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const voteSchema = z.object({
        voteType: z.enum(["like", "dislike"]),
      });
      
      const parsed = voteSchema.parse(req.body);
      
      const result = await storage.votePost(postId, userId, parsed.voteType);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  // Get user's vote on a post
  app.get("/api/posts/:postId/vote", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const vote = await storage.getUserVote(postId, userId);
    res.json({ voteType: vote?.voteType || null });
  });

  return httpServer;
}
