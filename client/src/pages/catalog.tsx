import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { PurchaseModal } from "@/components/PurchaseModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getStoredUser } from "@/lib/auth";
import { APP_CATALOG, addPurchasedApp, getAppIcon } from "@/lib/apps";
import type { App, AppCategory, TierType, PurchasedApp } from "@shared/schema";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function Catalog() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const categories: AppCategory[] = ["Mechanical", "Visual Media", "IT Tools", "Design", "Development", "Data Science"];

  const getAppsByCategory = (category: AppCategory) => {
    return APP_CATALOG.filter(app => app.category === category);
  };

  const handlePurchase = (tier: TierType, hours: number, cost: number) => {
    if (!selectedApp || !user) return;

    const purchasedApp: PurchasedApp = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: user.id,
      appId: selectedApp.id,
      appName: selectedApp.name,
      appIcon: selectedApp.icon,
      tier,
      status: "Stopped",
      totalHours: hours,
      usedHours: 0,
      remainingActiveHours: hours,
      retentionHours: hours * 24, // Retention period is 24x the active hours
      cost,
      purchasedAt: Date.now(),
    };

    addPurchasedApp(purchasedApp);
    setSelectedApp(null);
    
    toast({
      title: "App purchased!",
      description: `${selectedApp.name} has been added to your dashboard`,
    });
    
    setLocation("/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden pb-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-600/10" />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" data-testid="link-dashboard">
                <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10" data-testid="button-back">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  App Catalog
                </h1>
                <p className="text-white/70 text-sm">Browse and purchase software</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-cyan-400" />
              <span className="text-white/80">Choose your tools</span>
            </div>
          </GlassCard>
        </div>
        
        {/* Categories */}
        <div className="max-w-7xl mx-auto space-y-12">
          {categories.map((category) => {
            const apps = getAppsByCategory(category);
            if (apps.length === 0) return null;
            
            return (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 inline-block relative">
                    {category}
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                  </h2>
                  <p className="text-white/60 text-sm mt-2">{apps.length} applications available</p>
                </div>
                
                {/* Apps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {apps.map((app) => {
                    const AppIcon = getAppIcon(app.icon);
                    return (
                    <GlassCard
                      key={app.id}
                      hover
                      className="flex flex-col items-center text-center cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                      data-testid={`card-app-${app.id}`}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center mb-4">
                        <AppIcon className="h-10 w-10 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2" data-testid={`text-app-name-${app.id}`}>
                        {app.name}
                      </h3>
                      <p className="text-sm text-white/70 mb-4 flex-1">
                        {app.description}
                      </p>
                      <div className="w-full space-y-2">
                        <p className="text-xs text-white/60">Starting from</p>
                        <p className="text-xl font-bold text-cyan-400" data-testid={`text-base-price-${app.id}`}>
                          ${app.basePrice}/hour
                        </p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 font-semibold"
                          size="sm"
                          data-testid={`button-get-app-${app.id}`}
                        >
                          Get App
                        </Button>
                      </div>
                    </GlassCard>
                  );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Purchase Modal */}
      <PurchaseModal
        app={selectedApp}
        open={selectedApp !== null}
        onClose={() => setSelectedApp(null)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
