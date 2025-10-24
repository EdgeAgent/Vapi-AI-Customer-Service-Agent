import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const vapiAgents = mysqlTable("vapi_agents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentName: varchar("agentName", { length: 255 }).notNull(),
  agentId: varchar("agentId", { length: 255 }).notNull(),
  apiKey: text("apiKey").notNull(),
  publicKey: text("publicKey"),
  assistantId: varchar("assistantId", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  description: text("description"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VapiAgent = typeof vapiAgents.$inferSelect;
export type InsertVapiAgent = typeof vapiAgents.$inferInsert;

export const vapiCallLogs = mysqlTable("vapi_call_logs", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  callId: varchar("callId", { length: 255 }).notNull(),
  callerNumber: varchar("callerNumber", { length: 20 }),
  duration: int("duration"),
  status: varchar("status", { length: 50 }),
  transcript: text("transcript"),
  recordingUrl: text("recordingUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VapiCallLog = typeof vapiCallLogs.$inferSelect;
export type InsertVapiCallLog = typeof vapiCallLogs.$inferInsert;