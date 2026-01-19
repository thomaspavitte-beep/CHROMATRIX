import { type ColorPalette } from '@/lib/colorUtils';
import { motion } from 'framer-motion';

interface FooterProps {
  palette: ColorPalette;
  bgColor: string;
  onColorChange: (index: number, color: string) => void;
}

export function Footer({ palette, bgColor, onColorChange }: FooterProps) {

  return (
    <footer 
      className="relative z-50 p-6 sm:p-8 flex flex-col items-center gap-8 border-t border-white/5 transition-colors duration-500 backdrop-blur-md"
      style={{ backgroundColor: `${bgColor}CC` }}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
        {palette.colors.map((color, idx) => (
          <motion.div 
            key={idx}
            initial={false}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="group relative cursor-pointer"
          >
            <label 
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-white/10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-xl ring-0 group-hover:ring-2 ring-white/20 flex items-center justify-center cursor-pointer block"
              style={{ backgroundColor: color }}
            >
              <span className="text-xs md:text-sm font-bold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pointer-events-none">
                {idx + 1}
              </span>
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(idx, e.target.value)}
                className="sr-only"
                data-testid={`color-picker-${idx + 1}`}
              />
            </label>
            
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-50">
              <span className="font-mono text-[10px] text-neutral-300 font-bold bg-black/80 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                {color}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-8 sm:gap-12 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500/80 bg-black/20 px-6 py-3 rounded-full border border-white/5">
         <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
           <span>Base Hue</span>
           <span className="text-neutral-300 font-mono tracking-normal text-[11px]">{palette.hue.toFixed(0)}°</span>
         </div>
         <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
         <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
           <span>Saturation</span>
           <span className="text-neutral-300 font-mono tracking-normal text-[11px]">{palette.saturation}%</span>
         </div>
         <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
         <div className="hidden sm:block text-neutral-600">Ctrl+Scroll to Zoom</div>
      </div>
    </footer>
  );
}
