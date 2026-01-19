
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateLogicalPalette, sanitizeAndPrepareSvg, hslToHex } from './utils/colorUtils';
import { ColorPalette, PaletteMode, LightnessRange } from './types';
import { GoogleGenAI } from "@google/genai";

const DEFAULT_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 756.9 756.9">
  <g id="_x31_">
    <rect class="st1" x="40.9" y="22.8" width="161.5" height="161.5"/>
  </g>
  <g id="_x32_">
    <rect class="st2" x="242" y="22.8" width="161.5" height="161.5"/>
  </g>
  <g id="_x33_">
    <rect class="st0" x="448.2" y="22.8" width="161.5" height="161.5"/>
  </g>
  <g id="_x34_">
    <rect class="st3" x="40.9" y="233.1" width="161.5" height="161.5"/>
  </g>
  <g id="_x35_">
    <rect class="st5" x="242" y="233.1" width="161.5" height="161.5"/>
  </g>
  <g id="_x36_">
    <rect class="st4" x="461.4" y="233.1" width="161.5" height="161.5"/>
  </g>
</svg>`;

const App: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(DEFAULT_SVG);
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('cohesive');
  const [palette, setPalette] = useState<ColorPalette>(generateLogicalPalette('cohesive'));
  const [bgColor, setBgColor] = useState<string>('#252122');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRenderedSvg(sanitizeAndPrepareSvg(svgInput));
  }, [svgInput]);

  const randomize = useCallback(() => {
    setPalette(generateLogicalPalette(paletteMode));
  }, [paletteMode]);

  useEffect(() => {
    if (containerRef.current) {
      palette.colors.forEach((color, index) => {
        containerRef.current?.style.setProperty(`--fill-${index + 1}`, color);
      });
    }
  }, [palette]);

  const handleModeChange = (mode: PaletteMode) => {
    setPaletteMode(mode);
    setPalette(generateLogicalPalette(mode));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(text);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(10, prev + delta)));
  };

  const handleSuggest = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a single base Hue (0-360) and a single Saturation (0-100) for a design. Return only as JSON: {"hue": number, "saturation": number}`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text);
      
      const darkestL = (LightnessRange.DARKEST_MIN + LightnessRange.DARKEST_MAX) / 2;
      const lightestL = (LightnessRange.LIGHTEST_MIN + LightnessRange.LIGHTEST_MAX) / 2;
      const colors: string[] = [];
      const hues: number[] = [];
      const lStep = (lightestL - darkestL) / 5;
      const hStep = paletteMode === 'vibrant' ? (Math.random() * 15 + 10) : 0;
      
      for (let i = 0; i < 6; i++) {
        const curH = (data.hue + (hStep * i)) % 360;
        hues.push(curH);
        colors.push(hslToHex(curH, data.saturation, darkestL + (lStep * i)));
      }
      
      setPalette({ hue: data.hue, saturation: data.saturation, colors, mode: paletteMode, hues });
    } catch (err) {
      randomize();
    }
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden flex flex-col font-inter transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      <header 
        className="z-50 relative flex items-center justify-between px-8 py-6 border-b border-white/5 backdrop-blur-sm"
        style={{ backgroundColor: `${bgColor}CC` }}
      >
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            Chroma<span className="text-neutral-500">Scale</span>
          </h1>
          
          <div className="hidden lg:flex bg-black/30 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => handleModeChange('cohesive')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${paletteMode === 'cohesive' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Cohesive
            </button>
            <button 
              onClick={() => handleModeChange('vibrant')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${paletteMode === 'vibrant' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Vibrant
            </button>
          </div>

          <div className="flex items-center gap-2 bg-black/30 p-1 rounded-xl border border-white/5">
            <span className="pl-3 pr-1 text-[9px] font-black uppercase tracking-widest text-neutral-500">BG</span>
            <button 
              onClick={() => colorPickerRef.current?.click()}
              className="w-8 h-6 rounded-lg border border-white/20 transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: bgColor }}
            />
            <input 
              ref={colorPickerRef}
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)} 
              className="hidden"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSourceOpen(!isSourceOpen)}
            className={`px-4 py-2 rounded-full border transition-all text-[11px] font-bold uppercase tracking-wider ${isSourceOpen ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-neutral-400'}`}
          >
            {isSourceOpen ? 'View SVG' : 'Edit Source'}
          </button>
          <button 
            onClick={handleSuggest}
            className="hidden sm:block px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all text-[11px] font-bold uppercase tracking-wider text-neutral-400"
          >
            AI Assist
          </button>
          <button 
            onClick={randomize}
            className="px-6 py-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-all active:scale-95 font-black text-[11px] uppercase tracking-widest shadow-2xl"
          >
            Generate
          </button>
        </div>
      </header>

      <main className="relative flex-grow flex items-center justify-center p-4">
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onWheel={(e) => {
             if (e.ctrlKey) {
               e.preventDefault();
               handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
             }
          }}
        >
          <div 
            className="transition-transform duration-300 ease-out will-change-transform flex items-center justify-center"
            style={{ 
              transform: `scale(${zoom})`,
              minWidth: '100%',
              minHeight: '100%'
            }}
            dangerouslySetInnerHTML={{ __html: renderedSvg }} 
          />
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-32 right-8 flex flex-col gap-2 z-40">
           <button onClick={() => handleZoom(0.25)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-xl hover:bg-white/10 transition-colors">+</button>
           <button onClick={() => setZoom(1)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-xs font-bold hover:bg-white/10 transition-colors">1:1</button>
           <button onClick={() => handleZoom(-0.25)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-xl hover:bg-white/10 transition-colors">-</button>
        </div>

        {/* Editor Overlay */}
        <div 
          className={`fixed top-0 right-0 h-full w-full sm:w-[450px] border-l border-white/5 z-[60] transform transition-transform duration-500 ease-in-out shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ${isSourceOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ backgroundColor: bgColor }}
        >
          <div className="h-full flex flex-col p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">Source Editor</h2>
              <button onClick={() => setIsSourceOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              spellCheck={false}
              className="flex-grow bg-black/20 border border-white/5 rounded-2xl p-6 mono text-[11px] leading-relaxed text-neutral-400 focus:outline-none focus:border-white/10 transition-all scrollbar-hide resize-none"
              placeholder="Paste SVG code here..."
            />
          </div>
        </div>
      </main>

      <footer 
        className="relative z-50 p-6 flex flex-col items-center gap-6 border-t border-white/5"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {palette.colors.map((color, idx) => (
            <div 
              key={idx} 
              onClick={() => copyToClipboard(color)}
              className="group relative cursor-pointer"
            >
              <div 
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-white/10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-xl"
                style={{ backgroundColor: color }}
              />
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
                <span className="mono text-[10px] text-neutral-400 font-bold">{color}</span>
              </div>
              {isCopied === color && (
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] bg-white text-black px-2 py-1 rounded-md font-black uppercase tracking-tighter shadow-xl animate-bounce">
                  Copied
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-700">
           <div>Base Hue: <span className="text-neutral-400 mono tracking-normal">{palette.hue.toFixed(0)}°</span></div>
           <div>Saturation: <span className="text-neutral-400 mono tracking-normal">{palette.saturation}%</span></div>
           <div className="hidden sm:block text-neutral-800">Ctrl+Scroll to Zoom</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
