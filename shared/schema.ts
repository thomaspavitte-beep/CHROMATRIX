import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const palettes = pgTable("palettes", {
  id: serial("id").primaryKey(),
  name: text("name").default("Untitled Palette"),
  hue: integer("hue").notNull(),
  saturation: integer("saturation").notNull(),
  colors: text("colors").array().notNull(),
  mode: text("mode").notNull(), // 'cohesive' | 'vibrant'
  hues: integer("hues").array(), // For vibrant mode
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaletteSchema = createInsertSchema(palettes).omit({ 
  id: true, 
  createdAt: true 
});

export type Palette = typeof palettes.$inferSelect;
export type InsertPalette = z.infer<typeof insertPaletteSchema>;

// Types from original project
export type PaletteMode = 'cohesive' | 'vibrant';

export interface ColorPalette {
  hue: number;
  saturation: number;
  colors: string[];
  mode: PaletteMode;
  hues?: number[];
}

// AI Response type
export const aiSuggestionSchema = z.object({
  hue: z.number(),
  saturation: z.number(),
});

export type AiSuggestion = z.infer<typeof aiSuggestionSchema>;
