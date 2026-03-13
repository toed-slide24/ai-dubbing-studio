import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const allowedEmails = sqliteTable("allowed_emails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default("(datetime('now'))"),
});
