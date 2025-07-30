import type { Express } from "express";
import { createServer, type Server } from "http";
import { Pool } from "pg";
import { insertSavingsEntrySchema } from "@shared/schema";
import { z } from "zod";

// Connect to your database helper
import pool from './database.js';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all savings entries
  app.get("/api/savings", async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM savings ORDER BY date DESC"
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch savings entries" });
    }
  });

  // Create new savings entry
  app.post("/api/savings", async (req, res) => {
    try {
      const data = insertSavingsEntrySchema.parse(req.body);
      const { rows } = await pool.query(
        "INSERT INTO savings (amount, description) VALUES ($1, $2) RETURNING *",
        [data.amount, data.description]
      );
      res.status(201).json(rows[0]);
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
      const { rowCount } = await pool.query(
        "DELETE FROM savings WHERE id = $1",
        [id]
      );
      if (rowCount === 0) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json({ message: "Entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete savings entry" });
    }
  });

  // Get savings goal
  app.get("/api/goal", async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT amount FROM goals ORDER BY id DESC LIMIT 1"
      );
      const goal = rows[0]?.amount || 100000;
      res.json({ goal });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goal" });
    }
  });

  // Update savings goal
  app.put("/api/goal", async (req, res) => {
    try {
      const { goal } = req.body;
      if (!goal || typeof goal !== "number" || goal <= 0) {
        return res.status(400).json({ message: "Invalid goal amount" });
      }
      await pool.query(
        "INSERT INTO goals (amount) VALUES ($1)",
        [goal]
      );
      res.json({ goal });
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
