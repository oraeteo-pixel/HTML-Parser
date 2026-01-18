import { pgTable, text, serial, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Import users from auth model for foreign key reference
import { users } from "./models/auth";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  ganji: text("ganji"),
  section: text("section").default("madang"),
  mediaUrls: text("media_urls").array(),
  youtubeUrls: text("youtube_urls").array(),
  textStyle: text("text_style"), // JSON: { fontFamily, fontSize, lineHeight }
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  parentId: integer("parent_id"),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  mediaUrls: text("media_urls").array(),
  youtubeUrls: text("youtube_urls").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export const postVotes = pgTable("post_votes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type").notNull(), // 'like' or 'dislike'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPostVoteSchema = createInsertSchema(postVotes).omit({ id: true, createdAt: true });

export type PostVote = typeof postVotes.$inferSelect;
export type InsertPostVote = z.infer<typeof insertPostVoteSchema>;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: integer("is_read").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, isRead: true });

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true, updatedAt: true });

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

export const madangCategories = pgTable("madang_categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  level: integer("level").default(1), // 1: 카테고리, 2: 서브카테고리, 3: 서브서브카테고리
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMadangCategorySchema = createInsertSchema(madangCategories).omit({ id: true, createdAt: true });

export type MadangCategory = typeof madangCategories.$inferSelect;
export type InsertMadangCategory = z.infer<typeof insertMadangCategorySchema>;

export const pageContents = pgTable("page_contents", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

export const insertPageContentSchema = createInsertSchema(pageContents).omit({ id: true, updatedAt: true });

export type PageContent = typeof pageContents.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;

export const pageLayouts = pgTable("page_layouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  layoutJson: text("layout_json").notNull(), // JSON structure for blocks
  htmlContent: text("html_content"), // Generated or custom HTML
  customCss: text("custom_css"),
  isPublished: integer("is_published").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

export const insertPageLayoutSchema = createInsertSchema(pageLayouts).omit({ id: true, createdAt: true, updatedAt: true });

export type PageLayout = typeof pageLayouts.$inferSelect;
export type InsertPageLayout = z.infer<typeof insertPageLayoutSchema>;

export const codeSnippets = pgTable("code_snippets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  language: text("language").notNull(), // html, css, javascript, python, etc.
  category: text("category"), // ui, data, api, utility
  code: text("code").notNull(),
  tags: text("tags").array(),
  isPublic: integer("is_public").default(1),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({ id: true, createdAt: true, updatedAt: true });

export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;

export const siteLogos = pgTable("site_logos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  objectPath: text("object_path").notNull(),
  isActive: integer("is_active").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSiteLogoSchema = createInsertSchema(siteLogos).omit({ id: true, createdAt: true });

export type SiteLogo = typeof siteLogos.$inferSelect;
export type InsertSiteLogo = z.infer<typeof insertSiteLogoSchema>;

// Block types for page builder
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
