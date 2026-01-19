
export type PaletteMode = 'cohesive' | 'vibrant';

export interface ColorPalette {
  hue: number;
  saturation: number;
  colors: string[]; // Hex codes
  mode: PaletteMode;
  hues?: number[]; // Individual hues for vibrant mode
}

export enum LightnessRange {
  DARKEST_MIN = 4,
  DARKEST_MAX = 8,
  LIGHTEST_MIN = 72,
  LIGHTEST_MAX = 82
}
