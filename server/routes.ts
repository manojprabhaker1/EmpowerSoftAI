import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, purchasedAppSchema } from "@shared/schema";
import type { User, PurchasedApp } from "@shared/schema";
import { startJupyterInstance, stopJupyterInstance, getJupyterInstance } from "./jupyter/manager";
import { createProxyMiddleware } from "http-proxy-middleware";

// Mock app catalog data - matches client-side catalog
const APP_CATALOG = [
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints (mock - in real app would use proper auth)
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // App catalog endpoints
  app.get("/api/apps", async (req, res) => {
    res.json({ apps: APP_CATALOG });
  });

  app.get("/api/apps/:category", async (req, res) => {
    const { category } = req.params;
    const apps = APP_CATALOG.filter(app => app.category === category);
    res.json({ apps });
  });

  // Purchased apps endpoints
  app.get("/api/purchased-apps", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      
      const apps = await storage.getPurchasedApps(userId);
      res.json({ apps });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/purchased-apps", async (req, res) => {
    try {
      const validatedData = purchasedAppSchema.parse(req.body);
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      
      const purchasedApp: PurchasedApp = {
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        userId,
        appId: validatedData.appId,
        appName: validatedData.appName,
        appIcon: validatedData.appIcon,
        tier: validatedData.tier,
        status: "Stopped",
        totalHours: validatedData.totalHours,
        usedHours: 0,
        remainingActiveHours: validatedData.totalHours,
        retentionHours: validatedData.totalHours * 24,
        cost: validatedData.cost,
        purchasedAt: Date.now(),
      };
      
      const app = await storage.createPurchasedApp(purchasedApp);
      res.json({ app });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/purchased-apps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedApp = await storage.updatePurchasedApp(id, updates);
      
      if (!updatedApp) {
        return res.status(404).json({ error: "App not found" });
      }
      
      res.json({ app: updatedApp });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/purchased-apps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deletePurchasedApp(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "App not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Jupyter endpoints
  app.post("/api/jupyter/start/:appId", async (req, res) => {
    try {
      const { appId } = req.params;
      const { port, token } = await startJupyterInstance(appId);
      res.json({ port, token, url: `http://localhost:${port}/?token=${token}` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/jupyter/stop/:appId", async (req, res) => {
    try {
      const { appId } = req.params;
      stopJupyterInstance(appId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/jupyter/status/:appId", async (req, res) => {
    try {
      const { appId } = req.params;
      const instance = getJupyterInstance(appId);
      if (instance) {
        res.json({ 
          running: true, 
          port: instance.port, 
          token: instance.token,
          url: `http://localhost:${instance.port}/?token=${instance.token}`
        });
      } else {
        res.json({ running: false });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Proxy for Jupyter - wildcard route for all Jupyter paths
  app.use("/jupyter/:appId/*", (req, res, next) => {
    const { appId } = req.params;
    const instance = getJupyterInstance(appId);
    
    if (!instance) {
      return res.status(404).json({ error: "Jupyter instance not found" });
    }

    const proxy = createProxyMiddleware({
      target: `http://localhost:${instance.port}`,
      changeOrigin: true,
      ws: true,
      pathRewrite: (path) => {
        return path.replace(`/jupyter/${appId}`, '');
      },
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', `token ${instance.token}`);
      },
    });

    proxy(req, res, next);
  });

  const httpServer = createServer(app);
  return httpServer;
}
