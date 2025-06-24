import { useState, useEffect } from "react";
import { PiggyBank, Plus, History, Trash2, Moon, Sun, Coins, Trophy, Target, Settings, RotateCcw } from "lucide-react";
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
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [newGoal, setNewGoal] = useState("100000");
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  
  const { theme, toggleTheme } = useTheme();
  const { savedAmount, history, stats, goal, addAmount, deleteEntry, updateGoal, isLoading, isCreating, isDeleting, isUpdatingGoal } = useSavings();

  useEffect(() => {
    setNewGoal(goal.toString());
  }, [goal]);

  // Track previous progress to detect milestone crossings
  const [previousProgress, setPreviousProgress] = useState(0);

  useEffect(() => {
    const currentProgress = stats.progress;
    
    // Check for milestone crossings
    const milestones = [25, 50, 75, 100];
    const milestoneSounds = {
      25: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
      50: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3", 
      75: "https://www.soundjay.com/misc/sounds/success-fanfare-trumpets-02.mp3",
      100: "https://www.soundjay.com/misc/sounds/victory-celebration-01.mp3"
    };

    milestones.forEach(milestone => {
      if (previousProgress < milestone && currentProgress >= milestone) {
        // Milestone reached! Play celebration sound and show animation
        const celebrationMessages = {
          25: "🎉 Quarter Way There! 🎉",
          50: "🔥 Halfway Champion! 🔥", 
          75: "⚡ Almost There! ⚡",
          100: "👑 GOAL ACHIEVED! 👑"
        };

        setCelebrationMessage(celebrationMessages[milestone]);
        setShowCelebration(true);
        
        setTimeout(() => {
          playSound(milestoneSounds[milestone]);
        }, 300);

        // Hide celebration after 3 seconds
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      }
    });

    setPreviousProgress(currentProgress);
  }, [stats.progress, previousProgress]);

  // Achievement system
  const achievements = [
    {
      id: "first_save",
      title: "First Steps! 🎉",
      description: "Made your first savings entry",
      unlocked: stats.totalEntries >= 1,
      icon: "🏅"
    },
    {
      id: "milestone_1k",
      title: "₹1K Milestone! 💰",
      description: "Saved your first ₹1,000",
      unlocked: savedAmount >= 1000,
      icon: "💎"
    },
    {
      id: "consistent_saver",
      title: "Consistent Saver! 🔥",
      description: "Made 5 savings entries",
      unlocked: stats.totalEntries >= 5,
      icon: "⚡"
    },
    {
      id: "halfway_hero",
      title: "Halfway Hero! 🚀",
      description: "Reached 50% of your goal",
      unlocked: stats.progress >= 50,
      icon: "🎯"
    },
    {
      id: "goal_crusher",
      title: "Goal Crusher! 👑",
      description: "Achieved your savings goal",
      unlocked: stats.progress >= 100,
      icon: "👑"
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

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

  const handleGoalUpdate = async () => {
    const goalAmount = parseInt(newGoal);
    if (goalAmount && goalAmount > 0) {
      const success = await updateGoal(goalAmount);
      if (success) {
        setShowGoalSetting(false);
        playSound("https://www.soundjay.com/misc/sounds/button-3.mp3");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddMoney();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 z-50 flex space-x-3">
        <Button
          onClick={() => setShowGoalSetting(true)}
          className="glass-card p-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group bg-transparent border-white/20 hover:bg-white/10"
          size="icon"
        >
          <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" />
        </Button>
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
          <div className="inline-block p-4 rounded-3xl glass-card mb-4 dark:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <PiggyBank className="w-10 h-10 text-[var(--emerald-custom)] dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            Smart Piggy Bank
          </h1>
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
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - stats.progress / 100)}`}
                  className="transition-all duration-1000 ease-out drop-shadow-lg dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--emerald-custom)" />
                    <stop offset="100%" stopColor="var(--emerald-light)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {Math.floor(stats.progress)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">completed</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced progress label */}
            <div className="mb-4 p-3 bg-white/30 dark:bg-gray-800/30 rounded-2xl">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatCurrency(savedAmount)} saved / {formatCurrency(goal)} goal
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Savings</span>
                <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(savedAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Target Goal</span>
                <span className="font-semibold text-[var(--emerald-custom)]">{formatCurrency(goal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="font-semibold text-orange-500">{formatCurrency(Math.max(0, goal - savedAmount))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        {unlockedAchievements.length > 0 && (
          <Card className="glass-card rounded-3xl shadow-xl mb-6 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Trophy className="text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Achievements</h3>
                <span className="ml-auto text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
                  {unlockedAchievements.length}/{achievements.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700"
                  >
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-sm">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  {history.map((entry: any, index: number) => {
                    const entryIcon = entry.amount >= 5000 ? "💰" : entry.amount >= 1000 ? "💸" : "🪙";
                    const isRecent = index < 3;
                    
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl group transition-all duration-300",
                          isRecent 
                            ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700"
                            : "bg-white/30 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-700/40"
                        )}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-[var(--emerald-custom)] to-[var(--emerald-light)] rounded-full flex items-center justify-center mr-3 text-white shadow-lg">
                            <span className="text-lg">{entryIcon}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-white flex items-center">
                              {formatCurrency(entry.amount)}
                              {isRecent && <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">New</span>}
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
                    );
                  })}
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
        <div className="mt-8 text-center">
          <Card className="glass-card rounded-3xl border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl mb-2">👑</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Created by Mr. Tejas.J.Handigol
                </div>
                <div className="text-sm italic text-gray-600 dark:text-gray-300">
                  Crafted with precision for future millionaires.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalSetting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="glass-card rounded-3xl shadow-2xl border-white/20 w-full max-w-md transform animate-in fade-in zoom-in duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--emerald-custom)] to-[var(--emerald-light)] rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Target className="text-white text-2xl" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-2">
                  Set Your Savings Goal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose an amount that motivates you to save consistently
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Target Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-xl font-semibold">₹</span>
                    </div>
                    <Input
                      type="number"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="100000"
                      min="1"
                      step="1000"
                      className="w-full pl-10 pr-4 py-4 bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-[var(--emerald-custom)]/20 focus:border-[var(--emerald-custom)] outline-none text-xl font-semibold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[50000, 100000, 200000, 500000].map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => setNewGoal(amount.toString())}
                        className="py-2 px-3 text-xs bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-[var(--emerald-custom)]/10 hover:border-[var(--emerald-custom)] hover:text-[var(--emerald-custom)] transition-all duration-300"
                      >
                        ₹{(amount / 1000)}K
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={() => setShowGoalSetting(false)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGoalUpdate}
                    disabled={!newGoal || parseInt(newGoal) <= 0 || isUpdatingGoal}
                    className="flex-1 bg-gradient-to-r from-[var(--emerald-custom)] to-[var(--emerald-light)] text-white py-4 px-6 rounded-2xl font-semibold hover:from-[var(--emerald-dark)] hover:to-[var(--emerald-custom)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  >
                    {isUpdatingGoal ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating...
                      </div>
                    ) : (
                      "Set Goal"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Celebration Animation - Subtle Toast Style */}
      {showCelebration && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-[100] animate-in slide-in-from-top duration-500">
          <Card className="glass-card rounded-2xl border-white/30 shadow-xl dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-lg max-w-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center space-x-3">
                <div className="text-2xl animate-bounce">🎉</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {celebrationMessage}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.round(stats.progress)}% Complete!
                  </div>
                </div>
                <div className="relative">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-[var(--emerald-custom)] animate-pulse"
                      strokeDasharray={`${stats.progress * 0.75} 75`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Subtle Sparkles */}
          <div className="absolute -top-2 -right-2">
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute -bottom-1 -left-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute top-1 left-1/2">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
