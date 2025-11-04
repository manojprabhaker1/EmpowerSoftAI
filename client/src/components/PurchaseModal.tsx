import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GlassCard } from "./GlassCard";
import { calculateCost, getTierMultiplier, getAppIcon } from "@/lib/apps";
import type { App, TierType } from "@shared/schema";
import { Cpu, DollarSign } from "lucide-react";

interface PurchaseModalProps {
  app: App | null;
  open: boolean;
  onClose: () => void;
  onPurchase: (tier: TierType, hours: number, cost: number) => void;
}

export function PurchaseModal({ app, open, onClose, onPurchase }: PurchaseModalProps) {
  const [tier, setTier] = useState<TierType>("Medium");
  const [hours, setHours] = useState(10);

  if (!app) return null;

  const cost = calculateCost(app.basePrice, tier, hours);
  const tierMultiplier = getTierMultiplier(tier);
  const AppIcon = getAppIcon(app.icon);

  const handlePurchase = () => {
    onPurchase(tier, hours, cost);
    setTier("Medium");
    setHours(10);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-2xl border-white/20 text-white p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center">
                <AppIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">{app.name}</DialogTitle>
                <p className="text-white/70 text-sm">{app.description}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tier Selection */}
            <div>
              <Label className="text-white/80 font-medium mb-3 block">
                <Cpu className="inline h-4 w-4 mr-2" />
                CPU/Memory Tier
              </Label>
              <RadioGroup value={tier} onValueChange={(value) => setTier(value as TierType)}>
                <div className="grid grid-cols-3 gap-3">
                  <GlassCard
                    className={`p-4 cursor-pointer transition-all ${
                      tier === "Low" ? "bg-white/20 border-cyan-400" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={() => setTier("Low")}
                  >
                    <RadioGroupItem value="Low" id="low" className="sr-only" />
                    <label htmlFor="low" className="cursor-pointer block text-center" data-testid="radio-tier-low">
                      <p className="font-semibold text-white mb-1">Low</p>
                      <p className="text-xs text-white/60">1x cost</p>
                      <p className="text-sm text-cyan-400 mt-2">${app.basePrice}/h</p>
                    </label>
                  </GlassCard>

                  <GlassCard
                    className={`p-4 cursor-pointer transition-all ${
                      tier === "Medium" ? "bg-white/20 border-cyan-400" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={() => setTier("Medium")}
                  >
                    <RadioGroupItem value="Medium" id="medium" className="sr-only" />
                    <label htmlFor="medium" className="cursor-pointer block text-center" data-testid="radio-tier-medium">
                      <p className="font-semibold text-white mb-1">Medium</p>
                      <p className="text-xs text-white/60">1.5x cost</p>
                      <p className="text-sm text-cyan-400 mt-2">${(app.basePrice * 1.5).toFixed(2)}/h</p>
                    </label>
                  </GlassCard>

                  <GlassCard
                    className={`p-4 cursor-pointer transition-all ${
                      tier === "High" ? "bg-white/20 border-cyan-400" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={() => setTier("High")}
                  >
                    <RadioGroupItem value="High" id="high" className="sr-only" />
                    <label htmlFor="high" className="cursor-pointer block text-center" data-testid="radio-tier-high">
                      <p className="font-semibold text-white mb-1">High</p>
                      <p className="text-xs text-white/60">2.5x cost</p>
                      <p className="text-sm text-cyan-400 mt-2">${(app.basePrice * 2.5).toFixed(2)}/h</p>
                    </label>
                  </GlassCard>
                </div>
              </RadioGroup>
            </div>

            {/* Hours Input */}
            <div>
              <Label htmlFor="hours" className="text-white/80 font-medium mb-2 block">
                Active Hours
              </Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="1000"
                value={hours}
                onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-white/10 backdrop-blur-md border-white/30 text-white text-lg"
                data-testid="input-hours"
              />
              <p className="text-xs text-white/60 mt-1">Minimum 1 hour, maximum 1000 hours</p>
            </div>

            {/* Cost Summary */}
            <GlassCard className="bg-white/15 border-cyan-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Cost</p>
                  <p className="text-xs text-white/60">
                    ${app.basePrice} × {tierMultiplier}x × {hours}h
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" data-testid="text-total-cost">
                    <DollarSign className="inline h-6 w-6" />
                    {cost.toFixed(2)}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-full bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                className="flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/50 border-0 font-semibold"
                data-testid="button-purchase"
              >
                Get App
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
