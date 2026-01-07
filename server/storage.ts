import { users, posts, type User, type Post } from "@shared/schema";
import type { InsertPost } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  
  createPost(post: InsertPost): Promise<Post>;
  getPosts(): Promise<(Post & { author: string })[]>;
  getPostsByGanji(ganji: string): Promise<(Post & { author: string })[]>;
  getPostsBySection(section: string): Promise<(Post & { author: string })[]>;
  getLatestPostsByGanji(): Promise<{ ganji: string; posts: (Post & { author: string })[] }[]>;
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

  async getPosts(): Promise<(Post & { author: string })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt));
    
    return result;
  }

  async getPostsByGanji(ganji: string): Promise<(Post & { author: string })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.ganji, ganji))
    .orderBy(desc(posts.createdAt));
    
    return result;
  }

  async getPostsBySection(section: string): Promise<(Post & { author: string })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.section, section))
    .orderBy(desc(posts.createdAt));
    
    return result;
  }

  async getLatestPostsByGanji(): Promise<{ ganji: string; posts: (Post & { author: string })[] }[]> {
    const allPosts = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(100);
    
    const grouped = new Map<string, (Post & { author: string })[]>();
    for (const post of allPosts) {
      const key = post.ganji || "general";
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(post);
    }
    
    return Array.from(grouped.entries()).map(([ganji, posts]) => ({ ganji, posts }));
  }
}

export const storage = new DatabaseStorage();
