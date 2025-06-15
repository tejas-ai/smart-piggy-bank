import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type SavingsEntry, type InsertSavingsEntry } from "@shared/schema";

export interface SavingsStats {
  totalEntries: number;
  averageEntry: number;
  savedAmount: number;
  progress: number;
}

const GOAL = 100000;

export function useSavings() {
  // Fetch savings entries from the database
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/savings"],
  });

  // Create new savings entry
  const createEntryMutation = useMutation({
    mutationFn: (data: InsertSavingsEntry) => 
      apiRequest<SavingsEntry>("/api/savings", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings"] });
    },
  });

  // Delete savings entry
  const deleteEntryMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/savings/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings"] });
    },
  });

  const addAmount = async (amount: number) => {
    if (amount <= 0) return false;
    
    try {
      await createEntryMutation.mutateAsync({ amount });
      return true;
    } catch {
      return false;
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      await deleteEntryMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  // Calculate stats from entries
  const savedAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
  
  const stats: SavingsStats = {
    totalEntries: entries.length,
    averageEntry: entries.length > 0 ? Math.round(savedAmount / entries.length) : 0,
    savedAmount,
    progress: Math.min((savedAmount / GOAL) * 100, 100),
  };

  // Convert database timestamps to display format
  const history = entries.map(entry => ({
    ...entry,
    timestamp: new Date(entry.timestamp).toLocaleString(),
    date: new Date(entry.timestamp),
  }));

  return {
    savedAmount,
    history,
    stats,
    goal: GOAL,
    addAmount,
    deleteEntry,
    isLoading,
    isCreating: createEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
}
