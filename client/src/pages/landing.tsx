import { Link } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { Zap, Shield, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-blue-600/30 animate-gradient bg-[length:200%_200%]" />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "6s" }} />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Hero Section */}
        <div className="max-w-4xl w-full mx-auto text-center mb-16">
          <GlassCard className="p-12 md:p-16">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                EmpowerSoft
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-medium">
                Access Professional Software On-Demand
              </p>
            </div>
            
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Browse, purchase, and manage access to industry-leading software applications. 
              Pay only for the hours you need with flexible tier options tailored to your requirements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup" data-testid="link-signup">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/50 border-0 uppercase tracking-wide"
                  data-testid="button-signup"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" data-testid="link-login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base font-semibold bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white/10"
                  data-testid="button-login"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
        
        {/* Feature Cards */}
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard hover className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
              <Zap className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Access</h3>
            <p className="text-white/70">
              Launch professional software instantly with no installation required
            </p>
          </GlassCard>
          
          <GlassCard hover className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Flexible Tiers</h3>
            <p className="text-white/70">
              Choose CPU and memory tiers that match your workload requirements
            </p>
          </GlassCard>
          
          <GlassCard hover className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pay As You Go</h3>
            <p className="text-white/70">
              Only pay for active hours used with transparent pricing
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
