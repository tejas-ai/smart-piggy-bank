import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type SavingsEntry, type InsertSavingsEntry } from "@shared/schema";

export interface SavingsStats {
  totalEntries: number;
  averageEntry: number;
  savedAmount: number;
  progress: number;
}

export function useSavings() {
  // Fetch savings entries from the database
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/savings"],
  });

  // Fetch savings goal
  const { data: goalData } = useQuery({
    queryKey: ["/api/goal"],
  });

  const goal = goalData?.goal || 100000;

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

  // Update goal
  const updateGoalMutation = useMutation({
    mutationFn: (newGoal: number) => 
      apiRequest<{goal: number}>("/api/goal", { method: "PUT", body: { goal: newGoal } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goal"] });
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

  const updateGoal = async (newGoal: number) => {
    try {
      await updateGoalMutation.mutateAsync(newGoal);
      return true;
    } catch {
      return false;
    }
  };

  // Type guard to ensure entries is an array
  const entriesArray: SavingsEntry[] = Array.isArray(entries) ? entries : [];
  
  // Calculate stats from entries
  const savedAmount = entriesArray.reduce((sum: number, entry: SavingsEntry) => sum + entry.amount, 0);
  
  const stats: SavingsStats = {
    totalEntries: entriesArray.length,
    averageEntry: entriesArray.length > 0 ? Math.round(savedAmount / entriesArray.length) : 0,
    savedAmount,
    progress: Math.min((savedAmount / goal) * 100, 100),
  };

  // Convert database timestamps to display format
  const history = entriesArray.map((entry: SavingsEntry) => ({
    ...entry,
    timestamp: new Date(entry.timestamp).toLocaleString(),
    date: new Date(entry.timestamp),
  }));

  return {
    savedAmount,
    history,
    stats,
    goal,
    addAmount,
    deleteEntry,
    updateGoal,
    isLoading,
    isCreating: createEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
    isUpdatingGoal: updateGoalMutation.isPending,
  };
}
