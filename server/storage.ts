import { users, posts, comments, postVotes, messages, siteSettings, madangCategories, pageContents, type User, type Post, type Comment, type PostVote, type Message, type SiteSetting, type MadangCategory, type PageContent } from "@shared/schema";
import type { InsertPost, InsertComment, InsertPostVote, InsertMessage, InsertMadangCategory, InsertPageContent } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  
  createPost(post: InsertPost): Promise<Post>;
  updatePost(postId: number, authorId: string, data: { title: string; content: string; mediaUrls?: string[]; youtubeUrls?: string[] }): Promise<Post | null>;
  deletePost(postId: number, authorId: string): Promise<boolean>;
  getPosts(): Promise<(Post & { author: string; authorEmail: string | null })[]>;
  getPostsByGanji(ganji: string): Promise<(Post & { author: string; authorEmail: string | null })[]>;
  getPostsBySection(section: string): Promise<(Post & { author: string; authorEmail: string | null; commentCount: number })[]>;
  getLatestPostsByGanji(): Promise<{ ganji: string; posts: (Post & { author: string; authorEmail: string | null })[] }[]>;
  
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPostId(postId: number): Promise<(Comment & { author: string; authorEmail: string | null })[]>;
  updateComment(commentId: number, content: string, mediaUrls?: string[], youtubeUrls?: string[]): Promise<Comment | null>;
  deleteComment(commentId: number): Promise<boolean>;
  getCommentById(commentId: number): Promise<Comment | null>;
  
  votePost(postId: number, userId: string, voteType: 'like' | 'dislike'): Promise<{ likes: number; dislikes: number }>;
  getUserVote(postId: number, userId: string): Promise<PostVote | null>;
  
  sendMessage(message: InsertMessage): Promise<Message>;
  getReceivedMessages(userId: string): Promise<(Message & { senderName: string; senderEmail: string | null })[]>;
  getSentMessages(userId: string): Promise<(Message & { receiverName: string; receiverEmail: string | null })[]>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(messageId: number, userId: string): Promise<boolean>;
  getUserById(userId: string): Promise<User | null>;
  
  getSiteSetting(key: string): Promise<SiteSetting | null>;
  setSiteSetting(key: string, value: string): Promise<SiteSetting>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  
  getMadangCategories(): Promise<MadangCategory[]>;
  getMadangCategory(id: number): Promise<MadangCategory | null>;
  createMadangCategory(category: InsertMadangCategory): Promise<MadangCategory>;
  updateMadangCategory(id: number, data: Partial<InsertMadangCategory>): Promise<MadangCategory | null>;
  deleteMadangCategory(id: number): Promise<boolean>;
  
  getPageContents(): Promise<PageContent[]>;
  getPageContent(slug: string): Promise<PageContent | null>;
  upsertPageContent(content: InsertPageContent): Promise<PageContent>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPosts(): Promise<(Post & { author: string; authorEmail: string | null })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      textStyle: posts.textStyle,
      likes: posts.likes,
      dislikes: posts.dislikes,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      authorEmail: users.email
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt));
    
    return result;
  }

  async getPostsByGanji(ganji: string): Promise<(Post & { author: string; authorEmail: string | null })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      textStyle: posts.textStyle,
      likes: posts.likes,
      dislikes: posts.dislikes,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      authorEmail: users.email
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.ganji, ganji))
    .orderBy(desc(posts.createdAt));
    
    return result;
  }

  async getPostsBySection(section: string): Promise<(Post & { author: string; authorEmail: string | null; commentCount: number })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      textStyle: posts.textStyle,
      likes: posts.likes,
      dislikes: posts.dislikes,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      authorEmail: users.email,
      commentCount: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.postId} = ${posts.id})`
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.section, section))
    .orderBy(desc(posts.createdAt));
    
    return result;
  }

  async getLatestPostsByGanji(): Promise<{ ganji: string; posts: (Post & { author: string; authorEmail: string | null })[] }[]> {
    const allPosts = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      textStyle: posts.textStyle,
      likes: posts.likes,
      dislikes: posts.dislikes,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      authorEmail: users.email
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(100);
    
    const grouped = new Map<string, (Post & { author: string; authorEmail: string | null })[]>();
    for (const post of allPosts) {
      const key = post.ganji || "general";
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(post);
    }
    
    return Array.from(grouped.entries()).map(([ganji, posts]) => ({ ganji, posts }));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getCommentsByPostId(postId: number): Promise<(Comment & { author: string; authorEmail: string | null })[]> {
    const result = await db.select({
      id: comments.id,
      postId: comments.postId,
      parentId: comments.parentId,
      content: comments.content,
      authorId: comments.authorId,
      mediaUrls: comments.mediaUrls,
      youtubeUrls: comments.youtubeUrls,
      createdAt: comments.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      authorEmail: users.email
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(comments.createdAt);
    
    return result;
  }

  async updateComment(commentId: number, content: string, mediaUrls?: string[], youtubeUrls?: string[]): Promise<Comment | null> {
    const [updated] = await db.update(comments)
      .set({ content, mediaUrls, youtubeUrls })
      .where(eq(comments.id, commentId))
      .returning();
    return updated || null;
  }

  async deleteComment(commentId: number): Promise<boolean> {
    await db.delete(comments).where(eq(comments.parentId, commentId));
    const result = await db.delete(comments).where(eq(comments.id, commentId));
    return (result.rowCount ?? 0) > 0;
  }

  async getCommentById(commentId: number): Promise<Comment | null> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);
    return comment || null;
  }

  async votePost(postId: number, userId: string, voteType: 'like' | 'dislike'): Promise<{ likes: number; dislikes: number }> {
    const existingVote = await db.select().from(postVotes)
      .where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)))
      .limit(1);

    if (existingVote.length > 0) {
      const oldVote = existingVote[0];
      if (oldVote.voteType === voteType) {
        await db.delete(postVotes).where(eq(postVotes.id, oldVote.id));
        if (voteType === 'like') {
          await db.update(posts).set({ likes: sql`GREATEST(0, ${posts.likes} - 1)` }).where(eq(posts.id, postId));
        } else {
          await db.update(posts).set({ dislikes: sql`GREATEST(0, ${posts.dislikes} - 1)` }).where(eq(posts.id, postId));
        }
      } else {
        await db.update(postVotes).set({ voteType }).where(eq(postVotes.id, oldVote.id));
        if (voteType === 'like') {
          await db.update(posts).set({ 
            likes: sql`${posts.likes} + 1`,
            dislikes: sql`GREATEST(0, ${posts.dislikes} - 1)`
          }).where(eq(posts.id, postId));
        } else {
          await db.update(posts).set({ 
            likes: sql`GREATEST(0, ${posts.likes} - 1)`,
            dislikes: sql`${posts.dislikes} + 1`
          }).where(eq(posts.id, postId));
        }
      }
    } else {
      await db.insert(postVotes).values({ postId, userId, voteType });
      if (voteType === 'like') {
        await db.update(posts).set({ likes: sql`${posts.likes} + 1` }).where(eq(posts.id, postId));
      } else {
        await db.update(posts).set({ dislikes: sql`${posts.dislikes} + 1` }).where(eq(posts.id, postId));
      }
    }

    const [post] = await db.select({ likes: posts.likes, dislikes: posts.dislikes })
      .from(posts).where(eq(posts.id, postId));
    return { likes: post.likes || 0, dislikes: post.dislikes || 0 };
  }

  async getUserVote(postId: number, userId: string): Promise<PostVote | null> {
    const [vote] = await db.select().from(postVotes)
      .where(and(eq(postVotes.postId, postId), eq(postVotes.userId, userId)));
    return vote || null;
  }

  async updatePost(postId: number, authorId: string, data: { title: string; content: string; mediaUrls?: string[]; youtubeUrls?: string[] }): Promise<Post | null> {
    const [existingPost] = await db.select().from(posts).where(eq(posts.id, postId));
    if (!existingPost || existingPost.authorId !== authorId) {
      return null;
    }
    const [updatedPost] = await db.update(posts)
      .set({
        title: data.title,
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        youtubeUrls: data.youtubeUrls || []
      })
      .where(eq(posts.id, postId))
      .returning();
    return updatedPost;
  }

  async deletePost(postId: number, authorId: string): Promise<boolean> {
    const [existingPost] = await db.select().from(posts).where(eq(posts.id, postId));
    if (!existingPost || existingPost.authorId !== authorId) {
      return false;
    }
    await db.delete(comments).where(eq(comments.postId, postId));
    await db.delete(postVotes).where(eq(postVotes.postId, postId));
    await db.delete(posts).where(eq(posts.id, postId));
    return true;
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getReceivedMessages(userId: string): Promise<(Message & { senderName: string; senderEmail: string | null })[]> {
    const result = await db.select({
      id: messages.id,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      content: messages.content,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      senderName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      senderEmail: users.email
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.receiverId, userId))
    .orderBy(desc(messages.createdAt));
    
    return result;
  }

  async getSentMessages(userId: string): Promise<(Message & { receiverName: string; receiverEmail: string | null })[]> {
    const result = await db.select({
      id: messages.id,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      content: messages.content,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      receiverName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      receiverEmail: users.email
    })
    .from(messages)
    .leftJoin(users, eq(messages.receiverId, users.id))
    .where(eq(messages.senderId, userId))
    .orderBy(desc(messages.createdAt));
    
    return result;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.isRead, 0)));
    return result[0]?.count || 0;
  }

  async markAsRead(messageId: number, userId: string): Promise<boolean> {
    const [msg] = await db.select().from(messages).where(eq(messages.id, messageId));
    if (!msg || msg.receiverId !== userId) return false;
    await db.update(messages).set({ isRead: 1 }).where(eq(messages.id, messageId));
    return true;
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user || null;
  }

  async getSiteSetting(key: string): Promise<SiteSetting | null> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || null;
  }

  async setSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const [updated] = await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    } else {
      const [newSetting] = await db.insert(siteSettings)
        .values({ key, value })
        .returning();
      return newSetting;
    }
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getMadangCategories(): Promise<MadangCategory[]> {
    return await db.select().from(madangCategories).orderBy(asc(madangCategories.sortOrder));
  }

  async getMadangCategory(id: number): Promise<MadangCategory | null> {
    const [category] = await db.select().from(madangCategories).where(eq(madangCategories.id, id));
    return category || null;
  }

  async createMadangCategory(category: InsertMadangCategory): Promise<MadangCategory> {
    const [newCategory] = await db.insert(madangCategories).values(category).returning();
    return newCategory;
  }

  async updateMadangCategory(id: number, data: Partial<InsertMadangCategory>): Promise<MadangCategory | null> {
    const [updated] = await db.update(madangCategories).set(data).where(eq(madangCategories.id, id)).returning();
    return updated || null;
  }

  async deleteMadangCategory(id: number): Promise<boolean> {
    const result = await db.delete(madangCategories).where(eq(madangCategories.id, id));
    return true;
  }

  async getPageContents(): Promise<PageContent[]> {
    return await db.select().from(pageContents);
  }

  async getPageContent(slug: string): Promise<PageContent | null> {
    const [content] = await db.select().from(pageContents).where(eq(pageContents.pageSlug, slug));
    return content || null;
  }

  async upsertPageContent(content: InsertPageContent): Promise<PageContent> {
    const existing = await this.getPageContent(content.pageSlug);
    if (existing) {
      const [updated] = await db.update(pageContents)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(pageContents.pageSlug, content.pageSlug))
        .returning();
      return updated;
    } else {
      const [newContent] = await db.insert(pageContents).values(content).returning();
      return newContent;
    }
  }
}

export const storage = new DatabaseStorage();
