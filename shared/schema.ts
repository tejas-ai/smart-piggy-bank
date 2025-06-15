import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const savingsEntries = pgTable("savings_entries", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSavingsEntrySchema = createInsertSchema(savingsEntries).omit({
  id: true,
  timestamp: true,
});

export type InsertSavingsEntry = z.infer<typeof insertSavingsEntrySchema>;
export type SavingsEntry = typeof savingsEntries.$inferSelect;
