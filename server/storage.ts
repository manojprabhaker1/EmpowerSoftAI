import { type User, type InsertUser, type PurchasedApp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Purchased apps methods
  getPurchasedApps(userId: string): Promise<PurchasedApp[]>;
  getPurchasedApp(id: string): Promise<PurchasedApp | undefined>;
  createPurchasedApp(app: PurchasedApp): Promise<PurchasedApp>;
  updatePurchasedApp(id: string, updates: Partial<PurchasedApp>): Promise<PurchasedApp | undefined>;
  deletePurchasedApp(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private purchasedApps: Map<string, PurchasedApp>;

  constructor() {
    this.users = new Map();
    this.purchasedApps = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Purchased apps methods
  async getPurchasedApps(userId: string): Promise<PurchasedApp[]> {
    return Array.from(this.purchasedApps.values()).filter(
      (app) => app.userId === userId
    );
  }

  async getPurchasedApp(id: string): Promise<PurchasedApp | undefined> {
    return this.purchasedApps.get(id);
  }

  async createPurchasedApp(app: PurchasedApp): Promise<PurchasedApp> {
    this.purchasedApps.set(app.id, app);
    return app;
  }

  async updatePurchasedApp(id: string, updates: Partial<PurchasedApp>): Promise<PurchasedApp | undefined> {
    const app = this.purchasedApps.get(id);
    if (!app) return undefined;
    
    const updatedApp = { ...app, ...updates };
    this.purchasedApps.set(id, updatedApp);
    return updatedApp;
  }

  async deletePurchasedApp(id: string): Promise<boolean> {
    return this.purchasedApps.delete(id);
  }
}

export const storage = new MemStorage();
