import { type SavingsEntry, type InsertSavingsEntry } from "@shared/schema";

export interface IStorage {
  getSavingsEntries(): Promise<SavingsEntry[]>;
  createSavingsEntry(entry: InsertSavingsEntry): Promise<SavingsEntry>;
  deleteSavingsEntry(id: number): Promise<boolean>;
  getGoal(): Promise<number>;
  setGoal(amount: number): Promise<number>;
}

// In-memory storage implementation for reliable operation
export class MemoryStorage implements IStorage {
  private entries: SavingsEntry[] = [];
  private nextId = 1;
  private goal = 100000; // Default goal

  async getSavingsEntries(): Promise<SavingsEntry[]> {
    // Sort by timestamp descending (newest first)
    return [...this.entries].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createSavingsEntry(insertEntry: InsertSavingsEntry): Promise<SavingsEntry> {
    const entry: SavingsEntry = {
      id: this.nextId++,
      amount: insertEntry.amount,
      timestamp: new Date()
    };
    
    this.entries.push(entry);
    return entry;
  }

  async deleteSavingsEntry(id: number): Promise<boolean> {
    const initialLength = this.entries.length;
    this.entries = this.entries.filter(entry => entry.id !== id);
    return this.entries.length < initialLength;
  }

  async getGoal(): Promise<number> {
    return this.goal;
  }

  async setGoal(amount: number): Promise<number> {
    this.goal = amount;
    return this.goal;
  }
}

export const storage = new MemoryStorage();
