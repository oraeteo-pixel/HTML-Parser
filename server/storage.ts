import { users, posts, comments, postVotes, type User, type Post, type Comment, type PostVote } from "@shared/schema";
import type { InsertPost, InsertComment, InsertPostVote } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  
  createPost(post: InsertPost): Promise<Post>;
  getPosts(): Promise<(Post & { author: string; authorEmail: string | null })[]>;
  getPostsByGanji(ganji: string): Promise<(Post & { author: string; authorEmail: string | null })[]>;
  getPostsBySection(section: string): Promise<(Post & { author: string; authorEmail: string | null })[]>;
  getLatestPostsByGanji(): Promise<{ ganji: string; posts: (Post & { author: string; authorEmail: string | null })[] }[]>;
  
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPostId(postId: number): Promise<(Comment & { author: string; authorEmail: string | null })[]>;
  
  votePost(postId: number, userId: string, voteType: 'like' | 'dislike'): Promise<{ likes: number; dislikes: number }>;
  getUserVote(postId: number, userId: string): Promise<PostVote | null>;
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

  async getPostsBySection(section: string): Promise<(Post & { author: string; authorEmail: string | null })[]> {
    const result = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      ganji: posts.ganji,
      section: posts.section,
      mediaUrls: posts.mediaUrls,
      youtubeUrls: posts.youtubeUrls,
      likes: posts.likes,
      dislikes: posts.dislikes,
      createdAt: posts.createdAt,
      author: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email}, 'Unknown')`,
      authorEmail: users.email
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
}

export const storage = new DatabaseStorage();
