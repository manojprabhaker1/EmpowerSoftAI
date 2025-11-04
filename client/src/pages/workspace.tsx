import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getStoredUser } from "@/lib/auth";
import { getPurchasedApps, updatePurchasedApp, consumeHour, getAppIcon } from "@/lib/apps";
import type { PurchasedApp } from "@shared/schema";
import { Pause, Power, Play, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Workspace() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [app, setApp] = useState<PurchasedApp | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const user = getStoredUser();

  // Hour countdown timer
  useEffect(() => {
    if (!app || isPaused || app.remainingActiveHours <= 0) return;

    const interval = setInterval(() => {
      const apps = getPurchasedApps();
      const currentApp = apps.find(a => a.id === app.id);
      if (!currentApp) return;

      const updatedApp = consumeHour(currentApp);
      updatePurchasedApp(updatedApp.id, updatedApp);
      setApp(updatedApp);

      if (updatedApp.remainingActiveHours === 0) {
        setIsPaused(true);
        toast({
          title: "Hours depleted",
          description: "Your active hours have been used up. The app has been paused.",
          variant: "destructive",
        });
      }
    }, 60000); // Consume 1 hour every minute (for demo purposes)

    return () => clearInterval(interval);
  }, [app, isPaused, toast]);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    // Get app ID from URL query
    const searchParams = new URLSearchParams(window.location.search);
    const appId = searchParams.get("app");
    
    if (!appId) {
      setLocation("/dashboard");
      return;
    }

    const apps = getPurchasedApps();
    const foundApp = apps.find(a => a.id === appId);
    
    if (!foundApp) {
      toast({
        title: "App not found",
        description: "The requested app could not be found",
        variant: "destructive",
      });
      setLocation("/dashboard");
      return;
    }

    setApp(foundApp);
    setIsPaused(foundApp.status === "Paused");

    // Update app to Running status
    if (foundApp.status !== "Running") {
      updatePurchasedApp(foundApp.id, { 
        status: "Running",
        lastActiveAt: Date.now()
      });
    }
  }, [user, location, setLocation, toast]);

  const handlePause = () => {
    if (!app) return;
    const newStatus = isPaused ? "Running" : "Paused";
    updatePurchasedApp(app.id, { status: newStatus });
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "App resumed" : "App paused",
      description: `${app.appName} is now ${newStatus.toLowerCase()}`,
    });
  };

  const handleTerminate = () => {
    if (!app) return;
    updatePurchasedApp(app.id, { status: "Stopped" });
    toast({
      title: "Session terminated",
      description: "Returning to dashboard",
    });
    setLocation("/dashboard");
  };

  if (!user || !app) return null;

  const AppIcon = getAppIcon(app.appIcon);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-600/10" />
      </div>
      
      {/* Pulsing glow for active state */}
      {!isPaused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
      )}
      
      {/* Header Bar */}
      <div className="relative z-10 p-4">
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" data-testid="link-dashboard">
              <Button variant="outline" size="sm" className="rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
                <AppIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" data-testid="text-app-name">{app.appName}</h1>
                <p className="text-sm text-white/60">Tier: {app.tier}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/60">Active Hours Remaining</p>
              <p className="text-2xl font-bold text-cyan-400" data-testid="text-remaining-hours">
                {app.remainingActiveHours}h
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} data-testid="indicator-status" />
          </div>
        </GlassCard>
      </div>
      
      {/* Workspace Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <GlassCard className="max-w-4xl w-full p-12 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
              <AppIcon className="h-12 w-12 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Workspace Active
            </h2>
            <p className="text-xl text-white mb-1">{app.appName}</p>
            <p className="text-white/70">
              {isPaused ? "Session paused" : "Session running"}
            </p>
          </div>
          
          {/* Simulated Workspace Area */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 mb-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/80 text-lg mb-4">
                {isPaused 
                  ? "Application is paused. Resume to continue working." 
                  : "Application is running. This would be your workspace interface."}
              </p>
              <p className="text-white/50 text-sm">
                In production, this would display the actual application interface or remote desktop.
              </p>
            </div>
          </div>
          
          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Used</p>
              <p className="text-xl font-bold text-white" data-testid="text-used-hours">{app.usedHours}h</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Remaining</p>
              <p className="text-xl font-bold text-cyan-400" data-testid="text-active-hours">{app.remainingActiveHours}h</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Status</p>
              <p className={`text-xl font-bold ${isPaused ? 'text-amber-400' : 'text-emerald-400'}`} data-testid="text-status">
                {isPaused ? "Paused" : "Running"}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Control Strip */}
      <div className="relative z-10 p-4">
        <GlassCard className="flex items-center justify-center gap-4">
          <Button
            onClick={handlePause}
            className={`rounded-full px-8 py-6 font-semibold ${
              isPaused
                ? "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500"
                : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500"
            } border-0 shadow-lg`}
            data-testid="button-toggle-pause"
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-5 w-5" />
                Resume
              </>
            ) : (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            )}
          </Button>
          
          <Button
            onClick={handleTerminate}
            variant="outline"
            className="rounded-full px-8 py-6 font-semibold bg-red-400/10 backdrop-blur-md border-red-400/30 text-red-400 hover:bg-red-400/20"
            data-testid="button-terminate"
          >
            <Power className="mr-2 h-5 w-5" />
            Terminate
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
