import { useState } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setStoredUser } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication - in real app would call API
    setTimeout(() => {
      if (username && password) {
        const mockUser = {
          id: Math.random().toString(36).substring(7),
          username,
          password: "", // Never store password in user object
        };
        setStoredUser(mockUser);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${username}`,
        });
        setLocation("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Please enter both username and password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-blue-600/20" />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      
      {/* Back to home */}
      <Link href="/" className="absolute top-8 left-8 z-20" data-testid="link-home">
        <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10" data-testid="button-back">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-white/70">Sign in to your EmpowerSoft account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80 font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 backdrop-blur-md border-white/30 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                placeholder="Enter your username"
                required
                data-testid="input-username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 backdrop-blur-md border-white/30 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                placeholder="Enter your password"
                required
                data-testid="input-password"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full rounded-full py-6 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/50 border-0"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium" data-testid="link-signup-from-login">
                Sign up
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
