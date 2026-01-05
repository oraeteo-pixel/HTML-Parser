import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication (passport, session)
  setupAuth(app);

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // === Posts Routes ===
  
  // List Posts
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  // Create Post
  app.post(api.posts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Validate input
      const input = api.posts.create.input.parse(req.body);
      
      // Create post with logged-in user as author
      const post = await storage.createPost({
        ...input,
        authorId: (req.user as { id: number }).id,
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

  // Seed Data (optional, for initial populate)
  // Call this manually or on startup if needed
  // await seed();

  return httpServer;
}

// Seed function
async function seed() {
  const existingPosts = await storage.getPosts();
  if (existingPosts.length === 0) {
    // Check if we have a user
    let user = await storage.getUserByUsername("admin");
    if (!user) {
      // Create admin user if not exists (hashed password should be handled, but for seed simple is ok)
      // Note: In real app, create via auth flow to hash password.
      // Here we assume manual creation or just skipping if no user.
      console.log("No users found to seed posts.");
      return;
    }
    
    await storage.createPost({
      title: "Welcome to Orie Alter Dot Com",
      content: "This is the first post on the new community board.",
      authorId: user.id,
    });
  }
}
