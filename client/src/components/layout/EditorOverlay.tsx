import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface EditorOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  svgInput: string;
  onSvgChange: (value: string) => void;
  bgColor: string;
}

export function EditorOverlay({
  isOpen,
  onClose,
  svgInput,
  onSvgChange,
  bgColor,
}: EditorOverlayProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(svgInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] border-l border-white/5 z-[60] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex-none p-6 sm:p-8 flex items-center justify-between border-b border-white/5 bg-black/10">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Source Editor
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 text-neutral-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  title="Copy SVG"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button 
                  onClick={onClose} 
                  className="p-2 text-neutral-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow p-6 sm:p-8 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none h-8" />
              <textarea
                value={svgInput}
                onChange={(e) => onSvgChange(e.target.value)}
                spellCheck={false}
                className="flex-grow bg-black/20 border border-white/5 rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-neutral-400 focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all scrollbar-hide resize-none shadow-inner"
                placeholder="Paste your SVG code here. Ensure groups have ids like _x31_, _x32_, etc. for auto-coloring."
              />
              <div className="mt-4 text-[10px] text-neutral-500 font-medium">
                Tip: Group IDs <span className="text-neutral-300 font-mono">_x31_</span> through <span className="text-neutral-300 font-mono">_x36_</span> will be automatically colored.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
