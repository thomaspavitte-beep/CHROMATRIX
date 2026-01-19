export type PaletteMode = 'cohesive' | 'vibrant';

export interface ColorPalette {
  hue: number;
  saturation: number;
  colors: string[];
  mode: PaletteMode;
  hues?: number[];
}

export enum LightnessRange {
  DARKEST_MIN = 4,
  DARKEST_MAX = 8,
  LIGHTEST_MIN = 72,
  LIGHTEST_MAX = 82
}

export const hslToHex = (h: number, s: number, l: number): string => {
  const hue = ((h % 360) + 360) % 360; 
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

export const generateLogicalPalette = (mode: PaletteMode = 'cohesive'): ColorPalette => {
  const baseH = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 40; 
  const darkestL = Math.floor(Math.random() * (LightnessRange.DARKEST_MAX - LightnessRange.DARKEST_MIN + 1)) + LightnessRange.DARKEST_MIN;
  const lightestL = Math.floor(Math.random() * (LightnessRange.LIGHTEST_MAX - LightnessRange.LIGHTEST_MIN + 1)) + LightnessRange.LIGHTEST_MIN;
  const colors: string[] = [];
  const hues: number[] = [];
  const lStep = (lightestL - darkestL) / 5;
  const hStep = mode === 'vibrant' ? (Math.random() * 15 + 10) : 0;
  for (let i = 0; i < 6; i++) {
    const currentH = (baseH + (hStep * i)) % 360;
    const currentL = darkestL + (lStep * i);
    hues.push(currentH);
    colors.push(hslToHex(currentH, s, currentL));
  }
  return { hue: baseH, saturation: s, colors, mode, hues };
};

export const sanitizeAndPrepareSvg = (svgString: string): string => {
  let processed = svgString;
  for (let i = 1; i <= 6; i++) {
    const idTag = `id="_x3${i}_"`;
    if (processed.includes(idTag)) {
       if (!processed.includes(`${idTag} class="fill-${i}"`)) {
         processed = processed.replace(idTag, `${idTag} class="fill-${i}"`);
       }
    }
  }
  return processed;
};
