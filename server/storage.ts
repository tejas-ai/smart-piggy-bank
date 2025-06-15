import { savingsEntries, type SavingsEntry, type InsertSavingsEntry } from "@shared/schema";

export interface IStorage {
  getSavingsEntries(): Promise<SavingsEntry[]>;
  createSavingsEntry(entry: InsertSavingsEntry): Promise<SavingsEntry>;
  deleteSavingsEntry(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private entries: Map<number, SavingsEntry>;
  private currentId: number;

  constructor() {
    this.entries = new Map();
    this.currentId = 1;
  }

  async getSavingsEntries(): Promise<SavingsEntry[]> {
    return Array.from(this.entries.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createSavingsEntry(insertEntry: InsertSavingsEntry): Promise<SavingsEntry> {
    const id = this.currentId++;
    const entry: SavingsEntry = { 
      ...insertEntry, 
      id,
      timestamp: new Date()
    };
    this.entries.set(id, entry);
    return entry;
  }

  async deleteSavingsEntry(id: number): Promise<boolean> {
    return this.entries.delete(id);
  }
}

export const storage = new MemStorage();
