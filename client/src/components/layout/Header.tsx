import { Layers, Zap, RefreshCcw, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type PaletteMode } from '@/lib/colorUtils';

type AppMode = 'guided' | 'free';

interface HeaderProps {
  paletteMode: PaletteMode;
  onModeChange: (mode: PaletteMode) => void;
  bgColor: string;
  onGenerate: () => void;
  showWhite: boolean;
  onToggleWhite: () => void;
  appMode: AppMode;
  onSwitchToGuidedMode: () => void;
}

export function Header({
  paletteMode,
  onModeChange,
  bgColor,
  onGenerate,
  showWhite,
  onToggleWhite,
  appMode,
  onSwitchToGuidedMode,
}: HeaderProps) {

  return (
    <header 
      className="z-50 relative flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-white/5 backdrop-blur-md transition-colors duration-500"
      style={{ backgroundColor: `${bgColor}CC` }}
    >
      <div className="flex items-center gap-4 sm:gap-8">
        <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase flex items-center gap-1">
          <span>CHROMATRIX</span>
          <span className="hidden sm:inline text-xs sm:text-sm font-medium text-neutral-400 tracking-wide">Masterpieces</span>
        </h1>
        
        <div className="hidden lg:flex bg-black/30 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => onModeChange('cohesive')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              paletteMode === 'cohesive' ? "bg-white text-black shadow-lg scale-105" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            <Layers className="w-3 h-3" /> Cohesive
          </button>
          <button 
            onClick={() => onModeChange('vibrant')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              paletteMode === 'vibrant' ? "bg-white text-black shadow-lg scale-105" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            <Zap className="w-3 h-3" /> Vibrant
          </button>
        </div>

        </div>

      <div className="flex items-center gap-3">
        {appMode === 'free' && (
          <button 
            onClick={onSwitchToGuidedMode}
            className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white bg-black/20 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2"
            data-testid="button-guided-mode"
            title="Start guided tutorial"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Guided</span>
          </button>
        )}
        <button 
          onClick={onToggleWhite}
          className={cn(
            "px-4 py-2 rounded-full border transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-2",
            showWhite 
              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
              : "border-white/10 hover:border-white/30 text-neutral-400 hover:text-white bg-black/20"
          )}
          data-testid="button-toggle-white"
          title={showWhite ? "Show colors" : "Show uncolored"}
        >
          {showWhite ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="hidden sm:inline">{showWhite ? 'Show Colors' : 'Uncolored'}</span>
        </button>
        {appMode === 'free' && (
          <button 
            onClick={onGenerate}
            className="px-6 py-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-all active:scale-95 font-black text-[11px] uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] flex items-center gap-2"
            data-testid="button-generate"
          >
            <RefreshCcw className="w-3 h-3" />
            Generate
          </button>
        )}
      </div>
    </header>
  );
}
