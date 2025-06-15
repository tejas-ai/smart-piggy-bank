import { useState, useEffect } from "react";

export interface SavingsEntry {
  id: number;
  amount: number;
  timestamp: string;
  date: Date;
}

export interface SavingsStats {
  totalEntries: number;
  averageEntry: number;
  savedAmount: number;
  progress: number;
}

const GOAL = 100000;
const STORAGE_KEY_AMOUNT = "savedAmount";
const STORAGE_KEY_HISTORY = "savingsHistory";

export function useSavings() {
  const [savedAmount, setSavedAmount] = useState<number>(() => {
    return parseInt(localStorage.getItem(STORAGE_KEY_AMOUNT) || "0");
  });

  const [history, setHistory] = useState<SavingsEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AMOUNT, savedAmount.toString());
  }, [savedAmount]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  const addAmount = (amount: number) => {
    if (amount <= 0) return false;

    const newEntry: SavingsEntry = {
      id: Date.now(),
      amount,
      timestamp: new Date().toLocaleString(),
      date: new Date(),
    };

    setSavedAmount(prev => prev + amount);
    setHistory(prev => [newEntry, ...prev]);
    return true;
  };

  const deleteEntry = (id: number) => {
    const entry = history.find(h => h.id === id);
    if (!entry) return false;

    setSavedAmount(prev => prev - entry.amount);
    setHistory(prev => prev.filter(h => h.id !== id));
    return true;
  };

  const stats: SavingsStats = {
    totalEntries: history.length,
    averageEntry: history.length > 0 ? Math.round(savedAmount / history.length) : 0,
    savedAmount,
    progress: Math.min((savedAmount / GOAL) * 100, 100),
  };

  return {
    savedAmount,
    history,
    stats,
    goal: GOAL,
    addAmount,
    deleteEntry,
  };
}
