import { useState } from "react";
import { PiggyBank, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Default password - in a real app, this would be handled securely
  const CORRECT_PASSWORD = "piggybank123";

  const handleLogin = async () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for authentication
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        localStorage.setItem("piggybank_authenticated", "true");
        onLogin();
        toast({
          title: "Welcome!",
          description: "Access granted to your Smart Piggy Bank.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card rounded-3xl shadow-2xl border-white/20">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-3xl glass-card mb-4">
              <PiggyBank className="w-12 h-12 text-[var(--emerald-custom)]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Smart Piggy Bank
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Enter your password to access your savings
            </p>
          </div>

          {/* Password Input */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-[var(--emerald-custom)] focus:border-transparent outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[var(--emerald-custom)] to-[var(--emerald-light)] text-white py-3 px-6 rounded-2xl font-semibold hover:from-[var(--emerald-dark)] hover:to-[var(--emerald-custom)] transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Authenticating...
                </div>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Access Piggy Bank
                </>
              )}
            </Button>
          </div>

          {/* Hint */}
          <div className="mt-6 text-center">
            <div className="glass-card rounded-2xl p-4 border-white/20">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Demo Password Hint:
              </p>
              <p className="text-sm font-medium text-[var(--emerald-custom)]">
                piggybank123
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure access to your savings tracker
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}