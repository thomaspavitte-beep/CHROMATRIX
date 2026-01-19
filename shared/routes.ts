import { z } from 'zod';
import { insertPaletteSchema, palettes, aiSuggestionSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  palettes: {
    list: {
      method: 'GET' as const,
      path: '/api/palettes',
      responses: {
        200: z.array(z.custom<typeof palettes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/palettes',
      input: insertPaletteSchema,
      responses: {
        201: z.custom<typeof palettes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  ai: {
    suggest: {
      method: 'POST' as const,
      path: '/api/ai/suggest',
      responses: {
        200: aiSuggestionSchema,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
