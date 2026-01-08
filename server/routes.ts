import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { generateCalendarExcel } from "./calendarExport";

// 60갑자 계산 함수 (서버사이드)
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

function getDayGanZhi(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const baseIndex = 10;
  const ganZhiIndex = (daysDiff + baseIndex) % 60;
  const stemIndex = ganZhiIndex % 10;
  const branchIndex = ganZhiIndex % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

function getKoreanTime(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (9 * 60 * 60000));
}

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
      
      // Calculate today's 60갑자 using Korean time
      const koreanNow = getKoreanTime();
      const todayGanji = getDayGanZhi(
        koreanNow.getFullYear(),
        koreanNow.getMonth() + 1,
        koreanNow.getDate()
      );
      
      // Create post with logged-in user as author and today's ganji
      const post = await storage.createPost({
        ...req.body,
        authorId: userId,
        ganji: todayGanji,
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

  // Update post (protected - author only)
  app.put("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const updateSchema = z.object({
        title: z.string().min(1, "제목을 입력해 주세요."),
        content: z.string(),
        mediaUrls: z.array(z.string()).optional(),
        youtubeUrls: z.array(z.string()).optional(),
      });
      
      const parsed = updateSchema.parse(req.body);
      const updatedPost = await storage.updatePost(postId, userId, parsed);
      
      if (!updatedPost) {
        return res.status(403).json({ message: "수정 권한이 없습니다." });
      }
      
      res.json(updatedPost);
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

  // Delete post (protected - author only)
  app.delete("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const deleted = await storage.deletePost(postId, userId);
      
      if (!deleted) {
        return res.status(403).json({ message: "삭제 권한이 없습니다." });
      }
      
      res.json({ success: true });
    } catch (err) {
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
        parentId: z.number().optional(),
        mediaUrls: z.array(z.string()).optional(),
        youtubeUrls: z.array(z.string()).optional(),
      }).refine(
        (data) => data.content.trim().length > 0 || (data.mediaUrls && data.mediaUrls.length > 0) || (data.youtubeUrls && data.youtubeUrls.length > 0),
        { message: "답글 내용이나 미디어를 입력해 주세요." }
      );
      
      const parsed = contentSchema.parse(req.body);
      
      if (parsed.parentId) {
        const parentComment = await storage.getCommentById(parsed.parentId);
        if (!parentComment || parentComment.postId !== postId) {
          return res.status(400).json({ message: "Invalid parent comment" });
        }
      }
      
      const comment = await storage.createComment({
        postId,
        parentId: parsed.parentId,
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

  // Update comment (protected)
  app.patch("/api/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const commentId = parseInt(req.params.id);
      if (isNaN(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      
      const existingComment = await storage.getCommentById(commentId);
      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      const user = await storage.getUser(userId);
      if (existingComment.authorId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "수정 권한이 없습니다." });
      }
      
      const updateSchema = z.object({
        content: z.string(),
        mediaUrls: z.array(z.string()).optional(),
        youtubeUrls: z.array(z.string()).optional(),
      });
      
      const parsed = updateSchema.parse(req.body);
      
      const updated = await storage.updateComment(commentId, parsed.content, parsed.mediaUrls, parsed.youtubeUrls);
      res.json(updated);
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

  // Delete comment (protected)
  app.delete("/api/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const commentId = parseInt(req.params.id);
      if (isNaN(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      
      const existingComment = await storage.getCommentById(commentId);
      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      const user = await storage.getUser(userId);
      if (existingComment.authorId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "삭제 권한이 없습니다." });
      }
      
      await storage.deleteComment(commentId);
      res.json({ success: true });
    } catch (err) {
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

  // === Message Routes ===
  
  // Get unread message count
  app.get("/api/messages/unread-count", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const count = await storage.getUnreadCount(userId);
    res.json({ count });
  });

  // Get received messages
  app.get("/api/messages/received", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const messages = await storage.getReceivedMessages(userId);
    res.json(messages);
  });

  // Get sent messages
  app.get("/api/messages/sent", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const messages = await storage.getSentMessages(userId);
    res.json(messages);
  });

  // Send message
  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const messageSchema = z.object({
        receiverId: z.string().min(1, "수신자가 필요합니다."),
        content: z.string().min(1, "내용을 입력해 주세요."),
      });
      
      const parsed = messageSchema.parse(req.body);
      
      // Verify receiver exists before sending
      const receiver = await storage.getUserById(parsed.receiverId);
      if (!receiver) {
        return res.status(400).json({ message: "수신자를 찾을 수 없습니다." });
      }
      
      const message = await storage.sendMessage({
        senderId: userId,
        receiverId: parsed.receiverId,
        content: parsed.content,
      });
      
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  // Mark message as read
  app.post("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const messageId = parseInt(req.params.id);
    if (isNaN(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }
    
    const success = await storage.markAsRead(messageId, userId);
    res.json({ success });
  });

  // Get user info by ID (for messaging) - protected, only returns name
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
    const user = await storage.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'
    });
  });

  // Download calendar data as Excel (1989-2050)
  app.get("/api/calendar/export", async (req, res) => {
    try {
      const startDate = new Date(1989, 0, 1);
      const endDate = new Date(2050, 11, 31);
      
      const buffer = generateCalendarExcel(startDate, endDate);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="calendar_1989_2050.xlsx"');
      res.send(buffer);
    } catch (err) {
      console.error('Excel export error:', err);
      res.status(500).json({ message: "엑셀 생성 중 오류가 발생했습니다." });
    }
  });

  return httpServer;
}
