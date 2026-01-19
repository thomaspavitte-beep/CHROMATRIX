import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Palette Routes
  app.get(api.palettes.list.path, async (req, res) => {
    const palettes = await storage.getPalettes();
    res.json(palettes);
  });

  app.post(api.palettes.create.path, async (req, res) => {
    try {
      const input = api.palettes.create.input.parse(req.body);
      const palette = await storage.createPalette(input);
      res.status(201).json(palette);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // AI Suggestion Route
  app.post(api.ai.suggest.path, async (req, res) => {
    try {
      // Use gemini-3-flash-preview as per original app preference
      const model = "gemini-3-flash-preview"; 
      
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          role: "user",
          parts: [{ 
            text: `Suggest a single base Hue (0-360) and a single Saturation (0-100) for a design. Return only as JSON: {"hue": number, "saturation": number}` 
          }]
        },
        config: { 
          responseMimeType: "application/json" 
        }
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("No response from AI");
      }

      const data = JSON.parse(text);
      
      // Validate response
      if (typeof data.hue !== 'number' || typeof data.saturation !== 'number') {
        throw new Error("Invalid AI response format");
      }

      res.json(data);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      res.status(500).json({ message: "Failed to generate suggestion" });
    }
  });

  return httpServer;
}
