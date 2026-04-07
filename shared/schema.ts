import { mysqlTable, text, int, datetime, varchar, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

import { users } from "./models/auth";

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: 36 }).references(() => users.id).notNull(),
  ganji: text("ganji"),
  section: text("section").default("madang"),
  mediaUrls: json("media_urls").$type<string[]>(),
  youtubeUrls: json("youtube_urls").$type<string[]>(),
  textStyle: text("text_style"),
  likes: int("likes").default(0),
  dislikes: int("dislikes").default(0),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
});

export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").references(() => posts.id).notNull(),
  parentId: int("parent_id"),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: 36 }).references(() => users.id).notNull(),
  mediaUrls: json("media_urls").$type<string[]>(),
  youtubeUrls: json("youtube_urls").$type<string[]>(),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
});

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export const postVotes = mysqlTable("post_votes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").references(() => posts.id).notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id).notNull(),
  voteType: text("vote_type").notNull(),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
});

export const insertPostVoteSchema = createInsertSchema(postVotes).omit({ id: true, createdAt: true });

export type PostVote = typeof postVotes.$inferSelect;
export type InsertPostVote = z.infer<typeof insertPostVoteSchema>;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: varchar("sender_id", { length: 36 }).references(() => users.id).notNull(),
  receiverId: varchar("receiver_id", { length: 36 }).references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: int("is_read").default(0),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, isRead: true });

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: datetime("updated_at").$defaultFn(() => new Date()),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true, updatedAt: true });

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

export const madangCategories = mysqlTable("madang_categories", {
  id: int("id").autoincrement().primaryKey(),
  parentId: int("parent_id"),
  level: int("level").default(1),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  sortOrder: int("sort_order").default(0),
  isActive: int("is_active").default(1),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
});

export const insertMadangCategorySchema = createInsertSchema(madangCategories).omit({ id: true, createdAt: true });

export type MadangCategory = typeof madangCategories.$inferSelect;
export type InsertMadangCategory = z.infer<typeof insertMadangCategorySchema>;

export const pageContents = mysqlTable("page_contents", {
  id: int("id").autoincrement().primaryKey(),
  pageSlug: varchar("page_slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  updatedAt: datetime("updated_at").$defaultFn(() => new Date()),
  updatedBy: varchar("updated_by", { length: 36 }).references(() => users.id),
});

export const insertPageContentSchema = createInsertSchema(pageContents).omit({ id: true, updatedAt: true });

export type PageContent = typeof pageContents.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;

export const pageLayouts = mysqlTable("page_layouts", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  layoutJson: text("layout_json").notNull(),
  htmlContent: text("html_content"),
  customCss: text("custom_css"),
  isPublished: int("is_published").default(0),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").$defaultFn(() => new Date()),
  updatedBy: varchar("updated_by", { length: 36 }).references(() => users.id),
});

export const insertPageLayoutSchema = createInsertSchema(pageLayouts).omit({ id: true, createdAt: true, updatedAt: true });

export type PageLayout = typeof pageLayouts.$inferSelect;
export type InsertPageLayout = z.infer<typeof insertPageLayoutSchema>;

export const codeSnippets = mysqlTable("code_snippets", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  language: text("language").notNull(),
  category: text("category"),
  code: text("code").notNull(),
  tags: json("tags").$type<string[]>(),
  isPublic: int("is_public").default(1),
  createdBy: varchar("created_by", { length: 36 }).references(() => users.id),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").$defaultFn(() => new Date()),
});

export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({ id: true, createdAt: true, updatedAt: true });

export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;

export const siteLogos = mysqlTable("site_logos", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  objectPath: text("object_path").notNull(),
  isActive: int("is_active").default(0),
  createdBy: varchar("created_by", { length: 36 }).references(() => users.id),
  createdAt: datetime("created_at").$defaultFn(() => new Date()),
});

export const insertSiteLogoSchema = createInsertSchema(siteLogos).omit({ id: true, createdAt: true });

export type SiteLogo = typeof siteLogos.$inferSelect;
export type InsertSiteLogo = z.infer<typeof insertSiteLogoSchema>;

export interface LayoutBlock {
  id: string;
  type: 'header' | 'sidebar-left' | 'sidebar-right' | 'body' | 'footer' | 'table' | 'text' | 'image' | 'button' | 'html' | 'container' |
        'madang-posts' | 'ebook-posts' | 'recent-posts' | 'popular-posts' | 'categories' | 'calendar-widget' | 'banner' | 'youtube-embed' | 'divider' |
        'search-widget' | 'social-links' | 'tag-cloud' | 'notice' | 'spacer' | 'quote' | 'stats' | 'member-profile' | 'slider' | 'tabs' | 'accordion' | 'gallery' | 'login-widget' | 'navigation' | 'editor' | 'google-map';
  props: Record<string, any>;
  children?: LayoutBlock[];
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
