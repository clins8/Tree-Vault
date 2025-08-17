import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  points: integer("points").notNull().default(0),
  treesPlanted: integer("trees_planted").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const plantUploads = pgTable("plant_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageHash: text("image_hash").notNull().unique(),
  fileName: text("file_name").notNull(),
  verificationStatus: text("verification_status").notNull(), // 'success', 'not_plant', 'duplicate'
  pointsAwarded: integer("points_awarded").notNull().default(0),
  location: json("location").$type<{ lat: number; lng: number }>(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const globalStats = pgTable("global_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalTrees: integer("total_trees").notNull().default(0),
  totalUsers: integer("total_users").notNull().default(0),
  totalPhotos: integer("total_photos").notNull().default(0),
  countries: integer("countries").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
});

export const insertPlantUploadSchema = createInsertSchema(plantUploads).pick({
  userId: true,
  imageHash: true,
  fileName: true,
  verificationStatus: true,
  pointsAwarded: true,
  location: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPlantUpload = z.infer<typeof insertPlantUploadSchema>;
export type PlantUpload = typeof plantUploads.$inferSelect;
export type GlobalStats = typeof globalStats.$inferSelect;
