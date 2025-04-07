import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  profilePicture: text("profile_picture"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  eventCount: integer("event_count").default(0).notNull(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  eventCount: integer("event_count").default(0).notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  mediaType: text("media_type").default("image").notNull(), // "image" ou "video"
  categoryId: integer("category_id").notNull().references(() => categories.id),
  // Campos de localização mais detalhados
  city: text("city").notNull(),
  street: text("street").notNull(),
  number: text("number").notNull(),
  venue: text("venue").notNull(),
  complement: text("complement"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  totalTickets: integer("total_tickets").notNull(),
});

export const ticketCategories = pgTable("ticket_categories", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  name: text("name").notNull(), // "Meia", "Inteira", "VIP", etc.
  description: text("description"),
});

export const ticketBatches = pgTable("ticket_batches", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  categoryId: integer("category_id").notNull().references(() => ticketCategories.id),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  name: text("name").notNull(), // "1º Lote", "2º Lote", etc.
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull(),
  available: integer("available").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  batchId: integer("batch_id").notNull().references(() => ticketBatches.id),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  price: doublePrecision("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull().references(() => users.id),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id),
  quantity: integer("quantity").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertTicketCategorySchema = createInsertSchema(ticketCategories).omit({
  id: true,
});

export const insertTicketBatchSchema = createInsertSchema(ticketBatches).omit({
  id: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertTicketCategory = z.infer<typeof insertTicketCategorySchema>;
export type TicketCategory = typeof ticketCategories.$inferSelect;

export type InsertTicketBatch = z.infer<typeof insertTicketBatchSchema>;
export type TicketBatch = typeof ticketBatches.$inferSelect;

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;
