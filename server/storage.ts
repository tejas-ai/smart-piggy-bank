import { savingsEntries, type SavingsEntry, type InsertSavingsEntry } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSavingsEntries(): Promise<SavingsEntry[]>;
  createSavingsEntry(entry: InsertSavingsEntry): Promise<SavingsEntry>;
  deleteSavingsEntry(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getSavingsEntries(): Promise<SavingsEntry[]> {
    const entries = await db.select().from(savingsEntries).orderBy(desc(savingsEntries.timestamp));
    return entries;
  }

  async createSavingsEntry(insertEntry: InsertSavingsEntry): Promise<SavingsEntry> {
    const [entry] = await db
      .insert(savingsEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async deleteSavingsEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(savingsEntries)
      .where(eq(savingsEntries.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
