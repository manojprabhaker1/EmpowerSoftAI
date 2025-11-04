import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl",
        hover && "transition-all duration-300 hover:scale-102 hover:bg-white/15 hover:shadow-cyan-500/40 hover:shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
