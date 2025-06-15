import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavingsEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all savings entries
  app.get("/api/savings", async (req, res) => {
    try {
      const entries = await storage.getSavingsEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch savings entries" });
    }
  });

  // Create new savings entry
  app.post("/api/savings", async (req, res) => {
    try {
      const data = insertSavingsEntrySchema.parse(req.body);
      const entry = await storage.createSavingsEntry(data);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create savings entry" });
      }
    }
  });

  // Delete savings entry
  app.delete("/api/savings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const deleted = await storage.deleteSavingsEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json({ message: "Entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete savings entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
