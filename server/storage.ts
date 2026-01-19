import { db } from "./db";
import { palettes, type InsertPalette, type Palette } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createPalette(palette: InsertPalette): Promise<Palette>;
  getPalettes(): Promise<Palette[]>;
}

export class DatabaseStorage implements IStorage {
  async createPalette(insertPalette: InsertPalette): Promise<Palette> {
    const [palette] = await db.insert(palettes).values(insertPalette).returning();
    return palette;
  }

  async getPalettes(): Promise<Palette[]> {
    return await db.select().from(palettes).orderBy(desc(palettes.createdAt));
  }
}

export const storage = new DatabaseStorage();
