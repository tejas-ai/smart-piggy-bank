import { useState } from "react";
import { PiggyBank, Plus, History, Trash2, Moon, Sun, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useSavings } from "@/hooks/use-savings";
import { cn, playSound, formatCurrency, formatNumber } from "@/lib/utils";

const quotes = [
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "A penny saved is a penny earned.", author: "Benjamin Franklin" },
  { text: "The habit of saving is itself an education.", author: "T.T. Munger" }
];

export default function Home() {
  const [inputAmount, setInputAmount] = useState("");
  const [currentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  
  const { theme, toggleTheme } = useTheme();
  const { savedAmount, history, stats, goal, addAmount, deleteEntry, isLoading, isCreating, isDeleting } = useSavings();

  const handleAddMoney = async () => {
    const amount = parseInt(inputAmount);
    if (amount && amount > 0) {
      const success = await addAmount(amount);
      if (success) {
        setInputAmount("");
        playSound("https://www.soundjay.com/misc/sounds/coin-drop-2.mp3");
      }
    }
  };

  const handleDeleteEntry = async (id: number) => {
    const success = await deleteEntry(id);
    if (success) {
      playSound("https://www.soundjay.com/misc/sounds/button-3.mp3");
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    playSound("https://www.soundjay.com/misc/sounds/button-4.mp3");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddMoney();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleThemeToggle}
          className="glass-card p-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group bg-transparent border-white/20 hover:bg-white/10"
          size="icon"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-gray-300 group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-float">
          <div className="inline-block p-4 rounded-3xl glass-card mb-4">
            <PiggyBank className="w-10 h-10 text-[var(--emerald-custom)]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Smart Piggy Bank</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Your journey to {formatCurrency(goal)} starts here</p>
        </div>

        {/* Add Money Card */}
        <Card className="glass-card rounded-3xl shadow-xl mb-6 transform hover:scale-[1.02] transition-all duration-300 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Plus className="text-[var(--emerald-custom)] text-xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add to Savings</h2>
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-lg">₹</span>
              </div>
              <Input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-[var(--emerald-custom)] focus:border-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              />
            </div>
            
            <Button 
              onClick={handleAddMoney}
              className="w-full bg-gradient-to-r from-[var(--emerald-custom)] to-[var(--emerald-light)] text-white py-3 px-6 rounded-2xl font-semibold hover:from-[var(--emerald-dark)] hover:to-[var(--emerald-custom)] transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Piggy Bank
            </Button>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="glass-card rounded-3xl shadow-xl mb-6 text-center border-white/20">
          <CardContent className="p-6">
            <div className="relative inline-block mb-4">
              <div 
                className="progress-ring w-40 h-40 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{ "--progress": `${stats.progress}%` } as React.CSSProperties}
              >
                <div className="absolute inset-2 bg-white/20 dark:bg-gray-800/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{Math.floor(stats.progress)}%</div>
                    <div className="text-xs text-white/80">completed</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Saved</span>
                <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(savedAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Goal</span>
                <span className="font-semibold text-[var(--emerald-custom)]">{formatCurrency(goal)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-[var(--emerald-custom)] to-[var(--emerald-light)] h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="glass-card rounded-3xl shadow-xl mb-6 border-white/20">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="text-[var(--emerald-custom)] text-xl mr-3 mt-1">"</div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                  "{currentQuote.text}"
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  - {currentQuote.author}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Card */}
        <Card className="glass-card rounded-3xl shadow-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <History className="text-[var(--emerald-custom)] mr-3" />
                Savings History
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.totalEntries} entries
              </span>
            </div>
            
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <PiggyBank className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No savings yet. Start your journey!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl group hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[var(--emerald-custom)]/20 rounded-full flex items-center justify-center mr-3">
                          <Coins className="text-[var(--emerald-custom)] text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">
                            {formatCurrency(entry.amount)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {entry.timestamp}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 bg-transparent border-none"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card className="glass-card rounded-2xl text-center border-white/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[var(--emerald-custom)]">
                {formatNumber(stats.totalEntries)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Entries</div>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-2xl text-center border-white/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-[var(--emerald-custom)]">
                {formatCurrency(stats.averageEntry)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg. Entry</div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Footer */}
        <div className="mt-6 text-center">
          <Card className="glass-card rounded-2xl border-white/20">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created by
              </div>
              <div className="text-base font-semibold text-[var(--emerald-custom)] mt-1">
                Mr Tejas.J.Handigol
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
