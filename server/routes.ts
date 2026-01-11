import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes, objectStorageService, objectStorageClient } from "./replit_integrations/object_storage";
import { generateCalendarExcel } from "./calendarExport";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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

  // File upload endpoint
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      const objectId = randomUUID();
      const ext = file.originalname.split('.').pop() || '';
      const objectPath = `${privateObjectDir}/uploads/${objectId}${ext ? '.' + ext : ''}`;
      
      const pathParts = objectPath.startsWith('/') ? objectPath.slice(1).split('/') : objectPath.split('/');
      const bucketName = pathParts[0];
      const objectName = pathParts.slice(1).join('/');
      
      const bucket = objectStorageClient.bucket(bucketName);
      const gcsFile = bucket.file(objectName);
      
      await gcsFile.save(file.buffer, {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
        },
      });
      
      const url = `/objects/uploads/${objectId}${ext ? '.' + ext : ''}`;
      res.json({ url, objectPath });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

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

  // === Site Settings Routes ===
  
  // Get all site settings (public)
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getAllSiteSettings();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    res.json(settingsMap);
  });

  // Get specific site setting (public)
  app.get("/api/settings/:key", async (req, res) => {
    const setting = await storage.getSiteSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.json({ key: setting.key, value: setting.value });
  });

  // Update site setting (admin only)
  app.post("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 설정을 변경할 수 있습니다." });
      }

      const { key, value } = req.body;
      if (!key || typeof value !== 'string') {
        return res.status(400).json({ message: "Invalid request" });
      }

      const setting = await storage.setSiteSetting(key, value);
      res.json(setting);
    } catch (err) {
      console.error('Setting update error:', err);
      res.status(500).json({ message: "설정 저장 중 오류가 발생했습니다." });
    }
  });

  // === Madang Categories Routes ===
  
  app.get("/api/admin/categories", async (req, res) => {
    const categories = await storage.getMadangCategories();
    res.json(categories);
  });

  app.post("/api/admin/categories", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 카테고리를 생성할 수 있습니다." });
      }

      const { name, slug, description, sortOrder, isActive } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ message: "이름과 슬러그는 필수입니다." });
      }

      const category = await storage.createMadangCategory({ name, slug, description, sortOrder, isActive });
      res.json(category);
    } catch (err) {
      console.error('Category create error:', err);
      res.status(500).json({ message: "카테고리 생성 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 카테고리를 수정할 수 있습니다." });
      }

      const id = parseInt(req.params.id);
      const { name, slug, description, sortOrder, isActive } = req.body;
      const category = await storage.updateMadangCategory(id, { name, slug, description, sortOrder, isActive });
      if (!category) {
        return res.status(404).json({ message: "카테고리를 찾을 수 없습니다." });
      }
      res.json(category);
    } catch (err) {
      console.error('Category update error:', err);
      res.status(500).json({ message: "카테고리 수정 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 카테고리를 삭제할 수 있습니다." });
      }

      const id = parseInt(req.params.id);
      await storage.deleteMadangCategory(id);
      res.json({ success: true });
    } catch (err) {
      console.error('Category delete error:', err);
      res.status(500).json({ message: "카테고리 삭제 중 오류가 발생했습니다." });
    }
  });

  // === User Management Routes ===
  
  app.post("/api/admin/users", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 회원을 추가할 수 있습니다." });
      }

      const { firstName, lastName, email, isAdmin } = req.body;
      if (!firstName || firstName.trim() === '') {
        return res.status(400).json({ message: "이름은 필수입니다." });
      }

      const newUser = await storage.createUser({
        firstName: firstName.trim(),
        lastName: lastName?.trim() || undefined,
        email: email?.trim() || undefined,
        isAdmin: isAdmin || 0,
      });
      res.status(201).json(newUser);
    } catch (err) {
      console.error('User create error:', err);
      res.status(500).json({ message: "회원 추가 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error('Users get error:', err);
      res.status(500).json({ message: "회원 목록 조회 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/admin/users/:id/admin", isAuthenticated, async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.claims?.sub;
      const currentUser = await storage.getUser(currentUserId);
      if (!currentUser || currentUser.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const { isAdmin } = req.body;
      if (typeof isAdmin !== 'number' || (isAdmin !== 0 && isAdmin !== 1)) {
        return res.status(400).json({ message: "isAdmin 값은 0 또는 1이어야 합니다." });
      }

      const targetUserId = req.params.id;
      if (targetUserId === currentUserId) {
        return res.status(400).json({ message: "자신의 관리자 권한은 변경할 수 없습니다." });
      }

      const updatedUser = await storage.updateUserAdmin(targetUserId, isAdmin);
      if (!updatedUser) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
      res.json(updatedUser);
    } catch (err) {
      console.error('User admin update error:', err);
      res.status(500).json({ message: "관리자 권한 변경 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/admin/users/:id", isAuthenticated, async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.claims?.sub;
      const currentUser = await storage.getUser(currentUserId);
      if (!currentUser || currentUser.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const { firstName, lastName, phone, email } = req.body;
      const targetUserId = req.params.id;

      const updatedUser = await storage.updateUser(targetUserId, { firstName, lastName, phone, email });
      if (!updatedUser) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
      res.json(updatedUser);
    } catch (err) {
      console.error('User update error:', err);
      res.status(500).json({ message: "회원 정보 수정 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/admin/users/:id", isAuthenticated, async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.claims?.sub;
      const currentUser = await storage.getUser(currentUserId);
      if (!currentUser || currentUser.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const targetUserId = req.params.id;
      if (targetUserId === currentUserId) {
        return res.status(400).json({ message: "자신의 계정은 삭제할 수 없습니다." });
      }

      await storage.deleteUser(targetUserId);
      res.json({ success: true });
    } catch (err) {
      console.error('User delete error:', err);
      res.status(500).json({ message: "회원 삭제 중 오류가 발생했습니다." });
    }
  });

  // === Page Contents Routes ===
  
  // Public page content API (for header info)
  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getPageContent(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "페이지를 찾을 수 없습니다." });
      }
      res.json(page);
    } catch (err) {
      console.error('Public page get error:', err);
      res.status(500).json({ message: "페이지 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/pages", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const pages = await storage.getPageContents();
      res.json(pages);
    } catch (err) {
      console.error('Pages get error:', err);
      res.status(500).json({ message: "페이지 목록 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/pages/:slug", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const page = await storage.getPageContent(req.params.slug);
      if (!page) {
        return res.status(404).json({ message: "페이지를 찾을 수 없습니다." });
      }
      res.json(page);
    } catch (err) {
      console.error('Page get error:', err);
      res.status(500).json({ message: "페이지 조회 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/admin/pages", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 페이지를 수정할 수 있습니다." });
      }

      const { pageSlug, title, content, customCss, customJs } = req.body;
      if (!pageSlug || !title) {
        return res.status(400).json({ message: "페이지 슬러그와 제목은 필수입니다." });
      }

      const page = await storage.upsertPageContent({
        pageSlug,
        title,
        content,
        customCss,
        customJs,
        updatedBy: userId,
      });
      res.json(page);
    } catch (err) {
      console.error('Page save error:', err);
      res.status(500).json({ message: "페이지 저장 중 오류가 발생했습니다." });
    }
  });

  // === Page Layouts (Page Builder) Routes ===
  
  app.get("/api/admin/layouts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const layouts = await storage.getPageLayouts();
      res.json(layouts);
    } catch (err) {
      console.error('Layouts get error:', err);
      res.status(500).json({ message: "레이아웃 목록 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/layouts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const layout = await storage.getPageLayout(parseInt(req.params.id));
      if (!layout) {
        return res.status(404).json({ message: "레이아웃을 찾을 수 없습니다." });
      }
      res.json(layout);
    } catch (err) {
      console.error('Layout get error:', err);
      res.status(500).json({ message: "레이아웃 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/layouts/:slug", async (req, res) => {
    try {
      const layout = await storage.getPageLayoutBySlug(req.params.slug);
      if (!layout || layout.isPublished !== 1) {
        return res.status(404).json({ message: "레이아웃을 찾을 수 없습니다." });
      }
      res.json(layout);
    } catch (err) {
      console.error('Layout get error:', err);
      res.status(500).json({ message: "레이아웃 조회 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/admin/layouts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 레이아웃을 생성할 수 있습니다." });
      }

      const { name, slug, layoutJson, htmlContent, customCss, isPublished } = req.body;
      if (!name || !slug || !layoutJson) {
        return res.status(400).json({ message: "이름, 슬러그, 레이아웃 JSON은 필수입니다." });
      }

      const layout = await storage.createPageLayout({
        name,
        slug,
        layoutJson,
        htmlContent,
        customCss,
        isPublished: isPublished || 0,
        updatedBy: userId,
      });
      res.json(layout);
    } catch (err) {
      console.error('Layout create error:', err);
      res.status(500).json({ message: "레이아웃 생성 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/admin/layouts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 레이아웃을 수정할 수 있습니다." });
      }

      const { name, slug, layoutJson, htmlContent, customCss, isPublished } = req.body;
      const layout = await storage.updatePageLayout(parseInt(req.params.id), {
        name,
        slug,
        layoutJson,
        htmlContent,
        customCss,
        isPublished,
        updatedBy: userId,
      });
      
      if (!layout) {
        return res.status(404).json({ message: "레이아웃을 찾을 수 없습니다." });
      }
      res.json(layout);
    } catch (err) {
      console.error('Layout update error:', err);
      res.status(500).json({ message: "레이아웃 수정 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/admin/layouts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 레이아웃을 삭제할 수 있습니다." });
      }

      await storage.deletePageLayout(parseInt(req.params.id));
      res.json({ success: true });
    } catch (err) {
      console.error('Layout delete error:', err);
      res.status(500).json({ message: "레이아웃 삭제 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/code-snippets", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const snippets = await storage.getCodeSnippets();
      res.json(snippets);
    } catch (err) {
      console.error('Code snippets fetch error:', err);
      res.status(500).json({ message: "코드 스니펫 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/code-snippets/language/:language", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const snippets = await storage.getCodeSnippetsByLanguage(req.params.language);
      res.json(snippets);
    } catch (err) {
      console.error('Code snippets by language fetch error:', err);
      res.status(500).json({ message: "코드 스니펫 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/code-snippets/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 접근할 수 있습니다." });
      }

      const snippet = await storage.getCodeSnippet(parseInt(req.params.id));
      if (!snippet) {
        return res.status(404).json({ message: "코드 스니펫을 찾을 수 없습니다." });
      }
      res.json(snippet);
    } catch (err) {
      console.error('Code snippet fetch error:', err);
      res.status(500).json({ message: "코드 스니펫 조회 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/admin/code-snippets", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 코드 스니펫을 생성할 수 있습니다." });
      }

      const { name, description, language, category, code, tags, isPublic } = req.body;
      if (!name || !language || !code) {
        return res.status(400).json({ message: "이름, 언어, 코드는 필수입니다." });
      }

      const snippet = await storage.createCodeSnippet({
        name,
        description,
        language,
        category,
        code,
        tags: tags || [],
        isPublic: isPublic !== undefined ? isPublic : 1,
        createdBy: userId,
      });
      res.json(snippet);
    } catch (err) {
      console.error('Code snippet create error:', err);
      res.status(500).json({ message: "코드 스니펫 생성 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/admin/code-snippets/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 코드 스니펫을 수정할 수 있습니다." });
      }

      const { name, description, language, category, code, tags, isPublic } = req.body;
      const snippet = await storage.updateCodeSnippet(parseInt(req.params.id), {
        name,
        description,
        language,
        category,
        code,
        tags,
        isPublic,
      });
      
      if (!snippet) {
        return res.status(404).json({ message: "코드 스니펫을 찾을 수 없습니다." });
      }
      res.json(snippet);
    } catch (err) {
      console.error('Code snippet update error:', err);
      res.status(500).json({ message: "코드 스니펫 수정 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/admin/code-snippets/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 코드 스니펫을 삭제할 수 있습니다." });
      }

      await storage.deleteCodeSnippet(parseInt(req.params.id));
      res.json({ success: true });
    } catch (err) {
      console.error('Code snippet delete error:', err);
      res.status(500).json({ message: "코드 스니펫 삭제 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/admin/logos", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 로고를 조회할 수 있습니다." });
      }

      const logos = await storage.getSiteLogos();
      res.json(logos);
    } catch (err) {
      console.error('Logo fetch error:', err);
      res.status(500).json({ message: "로고 목록 조회 중 오류가 발생했습니다." });
    }
  });

  app.get("/api/active-logo", async (req, res) => {
    try {
      const logo = await storage.getActiveLogo();
      res.json(logo);
    } catch (err) {
      console.error('Active logo fetch error:', err);
      res.status(500).json({ message: "활성 로고 조회 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/admin/logos", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 로고를 등록할 수 있습니다." });
      }

      const { name, objectPath } = req.body;
      if (!name || !objectPath) {
        return res.status(400).json({ message: "로고 이름과 경로가 필요합니다." });
      }

      const logo = await storage.createSiteLogo({
        name,
        objectPath,
        createdBy: userId,
      });
      res.json(logo);
    } catch (err) {
      console.error('Logo create error:', err);
      res.status(500).json({ message: "로고 등록 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/admin/logos/:id/activate", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 로고를 활성화할 수 있습니다." });
      }

      const logo = await storage.setActiveLogo(parseInt(req.params.id));
      if (!logo) {
        return res.status(404).json({ message: "로고를 찾을 수 없습니다." });
      }
      res.json(logo);
    } catch (err) {
      console.error('Logo activate error:', err);
      res.status(500).json({ message: "로고 활성화 중 오류가 발생했습니다." });
    }
  });

  app.delete("/api/admin/logos/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      if (!user || user.isAdmin !== 1) {
        return res.status(403).json({ message: "관리자만 로고를 삭제할 수 있습니다." });
      }

      await storage.deleteSiteLogo(parseInt(req.params.id));
      res.json({ success: true });
    } catch (err) {
      console.error('Logo delete error:', err);
      res.status(500).json({ message: "로고 삭제 중 오류가 발생했습니다." });
    }
  });

  return httpServer;
}
