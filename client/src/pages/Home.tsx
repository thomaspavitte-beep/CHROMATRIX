import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  generateLogicalPalette, 
  sanitizeAndPrepareSvg, 
  type ColorPalette, 
  type PaletteMode
} from '@/lib/colorUtils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GuidedColorWizard } from '@/components/GuidedColorWizard';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';

type AppMode = 'guided' | 'free';

const FALLBACK_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 756.9 756.9">
  <defs>
    <style>
      .st0 { fill: #319c75; }
      .st1 { fill: #12432e; }
      .st2 { fill: #2d5747; }
      .st3 { fill: #33969b; }
      .st4 { fill: #809b7c; }
      .st5 { fill: #5e3996; }
    </style>
  </defs>
  <g id="_x31_"><rect class="st1" x="40.9" y="22.8" width="161.5" height="161.5"/></g>
  <g id="_x32_"><rect class="st2" x="242" y="22.8" width="161.5" height="161.5"/></g>
  <g id="_x33_"><rect class="st0" x="448.2" y="22.8" width="161.5" height="161.5"/></g>
  <g id="_x34_"><rect class="st3" x="40.9" y="233.1" width="161.5" height="161.5"/></g>
  <g id="_x35_"><rect class="st5" x="242" y="233.1" width="161.5" height="161.5"/></g>
  <g id="_x36_"><rect class="st4" x="461.4" y="233.1" width="161.5" height="161.5"/></g>
</svg>`;

export default function Home() {
  const [svgInput, setSvgInput] = useState<string>('');
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('vibrant');
  const [palette, setPalette] = useState<ColorPalette>(generateLogicalPalette('vibrant'));
  const [bgColor] = useState<string>('#131313');
  const [zoom, setZoom] = useState(1);
  const [showWhite, setShowWhite] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('guided');
  const [guidedColors, setGuidedColors] = useState<string[]>(Array(6).fill('#FFFFFF'));
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load complex SVG on mount
  useEffect(() => {
    fetch('/default-artwork.svg')
      .then(res => res.text())
      .then(svg => setSvgInput(svg))
      .catch(() => setSvgInput(FALLBACK_SVG));
  }, []);

  useEffect(() => {
    if (svgInput) {
      setRenderedSvg(sanitizeAndPrepareSvg(svgInput));
    }
  }, [svgInput]);

  const randomize = useCallback(() => {
    setPalette(generateLogicalPalette(paletteMode));
  }, [paletteMode]);

  // Apply CSS variables for colors based on mode
  useEffect(() => {
    const root = document.documentElement;
    const colorsToApply = appMode === 'guided' ? guidedColors : palette.colors;
    
    colorsToApply.forEach((color, index) => {
      const finalColor = showWhite ? '#FFFFFF' : color;
      root.style.setProperty(`--fill-${index + 1}`, finalColor);
    });
    
    // Add black stroke when showing white fills or when in guided mode with white colors
    const hasWhiteFills = showWhite || (appMode === 'guided' && guidedColors.some(c => c === '#FFFFFF'));
    root.style.setProperty('--svg-stroke', hasWhiteFills ? '#000000' : 'transparent');
    root.style.setProperty('--svg-stroke-width', hasWhiteFills ? '0.5' : '0');
  }, [palette, showWhite, appMode, guidedColors]);

  const handleModeChange = (mode: PaletteMode) => {
    setPaletteMode(mode);
    setPalette(generateLogicalPalette(mode));
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.2, Math.min(5, prev + delta)));
  };

  const resetZoom = () => setZoom(1);

  const handleGuidedColorChange = (index: number, color: string) => {
    setGuidedColors(prev => prev.map((c, i) => i === index ? color : c));
  };

  const handleSwitchToFreeMode = () => {
    // Transfer guided colors to palette
    setPalette(prev => ({
      ...prev,
      colors: [...guidedColors]
    }));
    setAppMode('free');
  };

  const handleSwitchToGuidedMode = () => {
    setGuidedColors(Array(6).fill('#FFFFFF'));
    setAppMode('guided');
  };

  const handleGuidedComplete = () => {
    // Could show a celebration or just stay in guided mode
    // User can click "Free Mode" to fine-tune
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden flex flex-col font-sans transition-colors duration-500 ease-in-out selection:bg-white/20"
      style={{ backgroundColor: bgColor }}
    >
      <Header 
        paletteMode={paletteMode}
        onModeChange={handleModeChange}
        bgColor={bgColor}
        onGenerate={randomize}
        showWhite={showWhite}
        onToggleWhite={() => setShowWhite(!showWhite)}
        appMode={appMode}
        onSwitchToGuidedMode={handleSwitchToGuidedMode}
      />

      <main className="relative flex-grow flex items-center justify-center p-4 overflow-hidden">
        {/* SVG Container */}
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          onWheel={(e) => {
             if (e.ctrlKey) {
               e.preventDefault();
               handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
             }
          }}
        >
          <motion.div 
            layout
            className="will-change-transform flex items-center justify-center [&>svg]:w-[500px] [&>svg]:h-[500px]"
            animate={{ scale: zoom }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            dangerouslySetInnerHTML={{ __html: renderedSvg }} 
          />
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-40">
           <button 
            onClick={() => handleZoom(0.25)} 
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg active:scale-95"
            title="Zoom In"
           >
             <ZoomIn className="w-5 h-5" />
           </button>
           <button 
            onClick={resetZoom} 
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg active:scale-95"
            title="Reset Zoom"
           >
             1:1
           </button>
           <button 
            onClick={() => handleZoom(-0.25)} 
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg active:scale-95"
            title="Zoom Out"
           >
             <ZoomOut className="w-5 h-5" />
           </button>
        </div>

        </main>

      {appMode === 'guided' ? (
        <GuidedColorWizard
          colors={guidedColors}
          onColorChange={handleGuidedColorChange}
          onComplete={handleGuidedComplete}
          onSwitchToFreeMode={handleSwitchToFreeMode}
        />
      ) : (
        <Footer 
          palette={palette} 
          bgColor={bgColor} 
          onColorChange={(index, color) => {
            setPalette(prev => ({
              ...prev,
              colors: prev.colors.map((c, i) => i === index ? color : c)
            }));
          }}
        />
      )}
    </div>
  );
}
