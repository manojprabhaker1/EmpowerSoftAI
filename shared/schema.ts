import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// App types for the catalog
export type AppCategory = "Mechanical" | "Visual Media" | "IT Tools" | "Design" | "Development" | "Data Science";
export type TierType = "Low" | "Medium" | "High";
export type AppStatus = "Running" | "Paused" | "Stopped";

export interface App {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  icon: string;
  basePrice: number; // Base price per hour
}

export interface PurchasedApp {
  id: string;
  userId: string;
  appId: string;
  appName: string;
  appIcon: string;
  tier: TierType;
  status: AppStatus;
  totalHours: number;
  usedHours: number;
  remainingActiveHours: number;
  retentionHours: number; // How long the app is retained after hours expire
  cost: number;
  purchasedAt: number; // timestamp
  lastActiveAt?: number; // timestamp
}

export const purchasedAppSchema = z.object({
  appId: z.string(),
  appName: z.string(),
  appIcon: z.string(),
  tier: z.enum(["Low", "Medium", "High"]),
  totalHours: z.number().min(1),
  cost: z.number(),
});

export type InsertPurchasedApp = z.infer<typeof purchasedAppSchema>;
