import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getStoredUser } from "@/lib/auth";
import { getPurchasedApps, updatePurchasedApp, consumeHour, getAppIcon, checkRetentionExpiry, roundHours } from "@/lib/apps";
import type { PurchasedApp } from "@shared/schema";
import { Pause, Play, ArrowLeft, PlayCircle, Code, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Workspace() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [app, setApp] = useState<PurchasedApp | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [jupyterLoading, setJupyterLoading] = useState(false);
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const user = getStoredUser();

  // Hour countdown and retention timer
  useEffect(() => {
    if (!app) return;

    const interval = setInterval(() => {
      const apps = getPurchasedApps();
      const currentApp = apps.find(a => a.id === app.id);
      if (!currentApp) return;

      // Check retention status (always check, even when paused)
      const { expired, shouldWarn, minutesRemaining } = checkRetentionExpiry(currentApp);
      
      if (expired) {
        updatePurchasedApp(currentApp.id, { status: "Stopped" });
        toast({
          title: "App terminated",
          description: "Your retention period has expired. The app has been terminated.",
          variant: "destructive",
        });
        setLocation("/dashboard");
        return;
      }

      if (shouldWarn) {
        updatePurchasedApp(currentApp.id, { retentionWarningSent: true });
        toast({
          title: "Warning: App will terminate soon",
          description: `Your app will be terminated in ${minutesRemaining} minutes. Please save your work.`,
          variant: "destructive",
        });
      }

      // Consume hours only if not paused and active hours remain
      if (!isPaused && currentApp.remainingActiveHours > 0) {
        const updatedApp = consumeHour(currentApp);
        updatePurchasedApp(updatedApp.id, updatedApp);
        setApp(updatedApp);

        if (updatedApp.remainingActiveHours === 0) {
          setIsPaused(true);
          toast({
            title: "Active hours depleted",
            description: "Your active hours have been used. The app is now in retention mode.",
            variant: "destructive",
          });
        }
      } else {
        setApp(currentApp);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [app, isPaused, toast, setLocation]);

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

  // Start/stop Jupyter when app is Jupyter
  useEffect(() => {
    if (!app || app.appId !== "jupyter") return;

    const startJupyter = async () => {
      setJupyterLoading(true);
      try {
        const response = await fetch(`/api/jupyter/start/${app.id}`, {
          method: 'POST',
        });
        const data = await response.json();
        if (data.port && data.token) {
          setJupyterUrl(`/jupyter/${app.id}/tree`);
        }
      } catch (error) {
        toast({
          title: "Failed to start Jupyter",
          description: "Could not start Jupyter notebook server",
          variant: "destructive",
        });
      } finally {
        setJupyterLoading(false);
      }
    };

    startJupyter();

    return () => {
      // Stop Jupyter when leaving workspace
      fetch(`/api/jupyter/stop/${app.id}`, { method: 'POST' });
    };
  }, [app, toast]);

  if (!user || !app) return null;

  const AppIcon = getAppIcon(app.appIcon);
  
  // Check if this is Jupyter notebook
  const isJupyter = app.appId === "jupyter";

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
              <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/30" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
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
                {roundHours(app.remainingActiveHours).toFixed(2)}h
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} data-testid="indicator-status" />
          </div>
        </GlassCard>
      </div>
      
      {/* Workspace Content */}
      <div className="relative z-10 flex-1 px-4 py-4 overflow-hidden">
        {isJupyter ? (
          <GlassCard className="h-full flex flex-col overflow-hidden">
            {jupyterLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
                  <p className="text-white text-lg">Starting Jupyter Notebook...</p>
                  <p className="text-white/60 text-sm mt-2">This may take a moment</p>
                </div>
              </div>
            ) : jupyterUrl ? (
              <>
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="h-4 w-px bg-white/20 mx-2" />
                    <span className="text-xs text-white/70">Jupyter Notebook</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/60">
                      {isPaused ? "Paused" : "Running"}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src={jupyterUrl}
                    className="w-full h-full border-0"
                    title="Jupyter Notebook"
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
                <div className="flex items-center justify-between p-2 border-t border-white/10 text-xs text-white/60">
                  <div className="flex items-center gap-4">
                    <span>Used: <span className="text-white font-mono" data-testid="text-used-hours">{roundHours(app.usedHours).toFixed(2)}h</span></span>
                    <span>Remaining: <span className="text-cyan-400 font-mono" data-testid="text-active-hours">{roundHours(app.remainingActiveHours).toFixed(2)}h</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${isPaused ? 'text-amber-400' : 'text-emerald-400'}`} data-testid="text-status">
                      {isPaused ? "Paused" : "Running"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-lg">Failed to start Jupyter</p>
                  <p className="text-white/60 text-sm mt-2">Please try again</p>
                </div>
              </div>
            )}
          </GlassCard>
        ) : (
          <GlassCard className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
              <AppIcon className="h-12 w-12 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {app.appName}
            </h2>
            <p className="text-white/70 mb-8">
              {isPaused ? "Application paused" : "Application running"}
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Used</p>
                <p className="text-xl font-bold text-white" data-testid="text-used-hours">{roundHours(app.usedHours).toFixed(2)}h</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Remaining</p>
                <p className="text-xl font-bold text-cyan-400" data-testid="text-active-hours">{roundHours(app.remainingActiveHours).toFixed(2)}h</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Status</p>
                <p className={`text-xl font-bold ${isPaused ? 'text-amber-400' : 'text-emerald-400'}`} data-testid="text-status">
                  {isPaused ? "Paused" : "Running"}
                </p>
              </div>
            </div>
            <p className="text-white/50 text-sm mt-8">
              In production, this would display the actual {app.appName} interface.
            </p>
          </GlassCard>
        )}
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
        </GlassCard>
      </div>
    </div>
  );
}
