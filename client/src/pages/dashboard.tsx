import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getStoredUser, clearStoredUser } from "@/lib/auth";
import { getPurchasedApps, updatePurchasedApp, deletePurchasedApp, getAppIcon, cleanupExpiredApps, roundHours } from "@/lib/apps";
import type { PurchasedApp } from "@shared/schema";
import { Rocket, Pause, Trash2, Plus, LogOut, Clock, Hourglass, Timer, Play } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [apps, setApps] = useState<PurchasedApp[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }
    cleanupExpiredApps(); // Clean up any expired apps on load
    loadApps();
  }, [user, setLocation]);
  
  // Periodic cleanup check
  useEffect(() => {
    const interval = setInterval(() => {
      const hadChanges = cleanupExpiredApps();
      if (hadChanges) {
        loadApps();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const loadApps = () => {
    setApps(getPurchasedApps());
  };

  const handleToggleStatus = (app: PurchasedApp) => {
    const newStatus = app.status === "Running" ? "Paused" : "Running";
    updatePurchasedApp(app.id, { 
      status: newStatus,
      lastActiveAt: Date.now()
    });
    loadApps();
    toast({
      title: newStatus === "Running" ? "App resumed" : "App paused",
      description: `${app.appName} is now ${newStatus.toLowerCase()}`,
    });
  };

  const handleLaunch = (app: PurchasedApp) => {
    if (app.remainingActiveHours <= 0) {
      toast({
        title: "No hours remaining",
        description: "Please purchase more hours to continue",
        variant: "destructive",
      });
      return;
    }
    setLocation(`/workspace?app=${app.id}`);
  };

  const handleDelete = (id: string) => {
    deletePurchasedApp(id);
    loadApps();
    setDeleteConfirm(null);
    toast({
      title: "App removed",
      description: "The app has been removed from your dashboard",
    });
  };

  const handleLogout = () => {
    clearStoredUser();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully",
    });
    setLocation("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-600/10" />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                My Apps
              </h1>
              <p className="text-white/70 text-sm md:text-base">Welcome back, {user.username}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/catalog" data-testid="link-catalog">
                <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 border-0" data-testid="button-browse-catalog">
                  Browse Catalog
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </GlassCard>
        </div>
        
        {/* Apps Grid */}
        <div className="max-w-6xl mx-auto">
          {apps.length === 0 ? (
            <div className="text-center py-16">
              <GlassCard className="max-w-md mx-auto">
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <Plus className="h-10 w-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No apps yet</h3>
                  <p className="text-white/70 mb-6">Get started by browsing our catalog</p>
                  <Link href="/catalog" data-testid="link-catalog-empty">
                    <Button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500" data-testid="button-browse-catalog-empty">
                      Browse Catalog
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {apps.map((app) => {
                const AppIcon = getAppIcon(app.appIcon);
                return (
                <GlassCard key={app.id} hover className="flex flex-col" data-testid={`card-app-${app.id}`}>
                  {/* App Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
                      <AppIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1" data-testid={`text-app-name-${app.id}`}>
                        {app.appName}
                      </h3>
                      <Badge 
                        className={`rounded-full ${
                          app.status === "Running" 
                            ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/30" 
                            : "bg-amber-400/20 text-amber-400 border-amber-400/30"
                        }`}
                        data-testid={`badge-status-${app.id}`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Timer className="h-3 w-3 text-white/60" />
                        <p className="text-xs uppercase tracking-wide text-white/60 font-medium">Used</p>
                      </div>
                      <p className="text-lg font-bold text-white" data-testid={`text-used-hours-${app.id}`}>{roundHours(app.usedHours).toFixed(2)}h</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-white/60" />
                        <p className="text-xs uppercase tracking-wide text-white/60 font-medium">Active</p>
                      </div>
                      <p className="text-lg font-bold text-cyan-400" data-testid={`text-remaining-hours-${app.id}`}>{roundHours(app.remainingActiveHours).toFixed(2)}h</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Hourglass className="h-3 w-3 text-white/60" />
                        <p className="text-xs uppercase tracking-wide text-white/60 font-medium">Retain</p>
                      </div>
                      <p className="text-lg font-bold text-purple-400" data-testid={`text-retention-hours-${app.id}`}>{app.retentionHours}h</p>
                    </div>
                  </div>
                  
                  {/* Cost & Tier */}
                  <div className="mb-4">
                    <p className="text-sm text-white/60 mb-1">Tier: <span className="text-white font-medium">{app.tier}</span></p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" data-testid={`text-cost-${app.id}`}>
                      ${app.cost.toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleLaunch(app)}
                      className="flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0"
                      size="sm"
                      data-testid={`button-launch-${app.id}`}
                    >
                      <Rocket className="h-4 w-4 mr-1" />
                      Launch
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(app)}
                      variant="outline"
                      className="rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10"
                      size="sm"
                      data-testid={`button-pause-${app.id}`}
                    >
                      {app.status === "Running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm(app.id)}
                      variant="outline"
                      className="rounded-full bg-red-400/10 backdrop-blur-md border-red-400/30 text-red-400 hover:bg-red-400/20"
                      size="sm"
                      data-testid={`button-delete-${app.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              )})}
            </div>
          )}
        </div>
        
        {/* Floating Add Button */}
        <Link href="/catalog" data-testid="link-catalog-fab">
          <Button
            className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl shadow-cyan-500/50 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 hover:scale-110 transition-transform"
            size="icon"
            data-testid="button-add-app"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </Link>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove App</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to remove this app? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full bg-white/5 border-white/30 text-white hover:bg-white/10" data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="rounded-full bg-red-500 hover:bg-red-600 text-white border-0"
              data-testid="button-confirm-delete"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
