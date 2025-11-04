import type { App, PurchasedApp } from "@shared/schema";
import type { LucideIcon } from "lucide-react";
import {
  Settings, Wrench, Ruler, Box,
  Film, Palette, Sparkles, Video,
  BarChart, Code, Database, Radio,
  Target, Image, Edit, Pencil,
  Globe, Terminal, Coffee, Gamepad2,
  TrendingUp, Activity, BarChart2, FileText
} from "lucide-react";

// Icon mapping for apps
export const APP_ICONS: Record<string, LucideIcon> = {
  creo: Settings,
  solidworks: Wrench,
  autocad: Ruler,
  fusion360: Box,
  premiere: Film,
  blender: Palette,
  aftereffects: Sparkles,
  davinci: Video,
  jupyter: BarChart,
  vscode: Code,
  datagrip: Database,
  postman: Radio,
  figma: Target,
  photoshop: Image,
  illustrator: Edit,
  sketch: Pencil,
  webstorm: Globe,
  pycharm: Terminal,
  intellij: Coffee,
  rider: Gamepad2,
  matlab: TrendingUp,
  rstudio: Activity,
  tableau: BarChart2,
  spss: FileText,
};

// Mock catalog of available apps
export const APP_CATALOG: App[] = [
  // Mechanical
  { id: "creo", name: "PTC Creo", category: "Mechanical", description: "Comprehensive 3D CAD modeling software", icon: "creo", basePrice: 15 },
  { id: "solidworks", name: "SolidWorks", category: "Mechanical", description: "Professional 3D CAD design and engineering", icon: "solidworks", basePrice: 18 },
  { id: "autocad", name: "AutoCAD", category: "Mechanical", description: "Industry-standard CAD drafting software", icon: "autocad", basePrice: 12 },
  { id: "fusion360", name: "Fusion 360", category: "Mechanical", description: "Cloud-based 3D modeling and CAM software", icon: "fusion360", basePrice: 10 },
  
  // Visual Media
  { id: "premiere", name: "Adobe Premiere Pro", category: "Visual Media", description: "Professional video editing software", icon: "premiere", basePrice: 20 },
  { id: "blender", name: "Blender", category: "Visual Media", description: "Open-source 3D creation suite", icon: "blender", basePrice: 8 },
  { id: "aftereffects", name: "After Effects", category: "Visual Media", description: "Motion graphics and visual effects", icon: "aftereffects", basePrice: 22 },
  { id: "davinci", name: "DaVinci Resolve", category: "Visual Media", description: "Professional color grading and editing", icon: "davinci", basePrice: 16 },
  
  // IT Tools
  { id: "jupyter", name: "Jupyter Notebook", category: "IT Tools", description: "Interactive computing environment", icon: "jupyter", basePrice: 5 },
  { id: "vscode", name: "VS Code Server", category: "IT Tools", description: "Cloud-based code editor", icon: "vscode", basePrice: 6 },
  { id: "datagrip", name: "DataGrip", category: "IT Tools", description: "Database IDE and management tool", icon: "datagrip", basePrice: 10 },
  { id: "postman", name: "Postman", category: "IT Tools", description: "API development and testing platform", icon: "postman", basePrice: 7 },
  
  // Design
  { id: "figma", name: "Figma", category: "Design", description: "Collaborative interface design tool", icon: "figma", basePrice: 12 },
  { id: "photoshop", name: "Adobe Photoshop", category: "Design", description: "Industry-standard image editing", icon: "photoshop", basePrice: 18 },
  { id: "illustrator", name: "Adobe Illustrator", category: "Design", description: "Vector graphics and illustration", icon: "illustrator", basePrice: 16 },
  { id: "sketch", name: "Sketch", category: "Design", description: "Digital design toolkit for Mac", icon: "sketch", basePrice: 14 },
  
  // Development
  { id: "webstorm", name: "WebStorm", category: "Development", description: "JavaScript and web development IDE", icon: "webstorm", basePrice: 11 },
  { id: "pycharm", name: "PyCharm", category: "Development", description: "Python development environment", icon: "pycharm", basePrice: 13 },
  { id: "intellij", name: "IntelliJ IDEA", category: "Development", description: "Java and JVM development IDE", icon: "intellij", basePrice: 15 },
  { id: "rider", name: "Rider", category: "Development", description: ".NET and game development IDE", icon: "rider", basePrice: 14 },
  
  // Data Science
  { id: "matlab", name: "MATLAB", category: "Data Science", description: "Numerical computing environment", icon: "matlab", basePrice: 25 },
  { id: "rstudio", name: "RStudio", category: "Data Science", description: "Integrated development environment for R", icon: "rstudio", basePrice: 9 },
  { id: "tableau", name: "Tableau", category: "Data Science", description: "Data visualization and analytics", icon: "tableau", basePrice: 20 },
  { id: "spss", name: "IBM SPSS", category: "Data Science", description: "Statistical analysis software", icon: "spss", basePrice: 22 },
];

const PURCHASED_APPS_KEY = "empowersoft_purchased_apps";

export function getPurchasedApps(): PurchasedApp[] {
  const stored = localStorage.getItem(PURCHASED_APPS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function savePurchasedApps(apps: PurchasedApp[]): void {
  localStorage.setItem(PURCHASED_APPS_KEY, JSON.stringify(apps));
}

export function addPurchasedApp(app: PurchasedApp): void {
  const apps = getPurchasedApps();
  apps.push(app);
  savePurchasedApps(apps);
}

export function updatePurchasedApp(id: string, updates: Partial<PurchasedApp>): void {
  const apps = getPurchasedApps();
  const index = apps.findIndex(app => app.id === id);
  if (index !== -1) {
    apps[index] = { ...apps[index], ...updates };
    savePurchasedApps(apps);
  }
}

export function deletePurchasedApp(id: string): void {
  const apps = getPurchasedApps();
  const filtered = apps.filter(app => app.id !== id);
  savePurchasedApps(filtered);
}

export function getTierMultiplier(tier: "Low" | "Medium" | "High"): number {
  switch (tier) {
    case "Low": return 1;
    case "Medium": return 1.5;
    case "High": return 2.5;
  }
}

export function calculateCost(basePrice: number, tier: "Low" | "Medium" | "High", hours: number): number {
  return basePrice * getTierMultiplier(tier) * hours;
}

// Round hours to 2 decimal places
export function roundHours(hours: number): number {
  return Math.round(hours * 100) / 100;
}

// Hour countdown simulation (consumes per minute for demo)
export function consumeHour(app: PurchasedApp): PurchasedApp {
  if (app.remainingActiveHours > 0) {
    const newUsedHours = roundHours(app.usedHours + (1/60)); // Consume 1 minute as fraction of hour
    const newRemainingHours = roundHours(app.remainingActiveHours - (1/60));
    
    return {
      ...app,
      usedHours: newUsedHours,
      remainingActiveHours: Math.max(0, newRemainingHours),
      status: newRemainingHours <= 0 ? "Paused" : app.status,
      retentionStartedAt: newRemainingHours <= 0 && !app.retentionStartedAt ? Date.now() : app.retentionStartedAt,
    };
  }
  return app;
}

// Check if app should be terminated based on retention hours
export function checkRetentionExpiry(app: PurchasedApp): { expired: boolean; shouldWarn: boolean; minutesRemaining: number } {
  // If still has active hours or no retention started, not expired
  if (app.remainingActiveHours > 0 || !app.retentionStartedAt) {
    return { expired: false, shouldWarn: false, minutesRemaining: app.retentionHours * 60 };
  }
  
  const retentionDurationMs = app.retentionHours * 60 * 60 * 1000; // Convert hours to ms
  const elapsedMs = Date.now() - app.retentionStartedAt;
  const remainingMs = retentionDurationMs - elapsedMs;
  const minutesRemaining = Math.floor(remainingMs / 60000);
  
  const expired = remainingMs <= 0;
  const shouldWarn = !app.retentionWarningSent && minutesRemaining <= 15 && minutesRemaining > 0;
  
  return { expired, shouldWarn, minutesRemaining: Math.max(0, minutesRemaining) };
}

// Clean up expired apps
export function cleanupExpiredApps(): boolean {
  const apps = getPurchasedApps();
  let hasChanges = false;
  const updated = apps.map(app => {
    const { expired } = checkRetentionExpiry(app);
    if (expired && app.status !== "Stopped") {
      hasChanges = true;
      return { ...app, status: "Stopped" as const };
    }
    return app;
  });
  
  if (hasChanges) {
    savePurchasedApps(updated);
  }
  return hasChanges;
}

export function getAppIcon(iconId: string): LucideIcon {
  return APP_ICONS[iconId] || Settings;
}
