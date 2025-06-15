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
    try {
      const entries = await db.select().from(savingsEntries).orderBy(desc(savingsEntries.timestamp));
      return entries;
    } catch (error) {
      console.error('Failed to fetch savings entries:', error);
      throw new Error('Database connection failed');
    }
  }

  async createSavingsEntry(insertEntry: InsertSavingsEntry): Promise<SavingsEntry> {
    try {
      const [entry] = await db
        .insert(savingsEntries)
        .values(insertEntry)
        .returning();
      return entry;
    } catch (error) {
      console.error('Failed to create savings entry:', error);
      throw new Error('Database operation failed');
    }
  }

  async deleteSavingsEntry(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(savingsEntries)
        .where(eq(savingsEntries.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Failed to delete savings entry:', error);
      throw new Error('Database operation failed');
    }
  }
}

export const storage = new DatabaseStorage();
