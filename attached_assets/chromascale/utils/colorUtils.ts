
import { ColorPalette, LightnessRange, PaletteMode } from '../types';

/**
 * Converts HSL values to a Hex color string.
 */
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

/**
 * Generates a palette based on strict HSL gradient logic.
 */
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

/**
 * Injects fill-n classes into an SVG string by targeting Illustrator's group ID export format.
 * This is the most reliable way to handle Illustrator files as ID markers persist across color changes.
 */
export const sanitizeAndPrepareSvg = (svgString: string): string => {
  let processed = svgString;
  
  // Illustrator uses _x31_, _x32_, etc. for groups 1-6
  for (let i = 1; i <= 6; i++) {
    const idTag = `id="_x3${i}_"`;
    // We inject the fill class into the group tag. 
    // Combined with the CSS selector ".fill-N, .fill-N *" in index.html, this overrides all children.
    if (processed.includes(idTag)) {
       // Only add the class if it's not already there
       if (!processed.includes(`${idTag} class="fill-${i}"`)) {
         processed = processed.replace(idTag, `${idTag} class="fill-${i}"`);
       }
    }
  }
  
  return processed;
};
