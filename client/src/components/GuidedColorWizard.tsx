import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, RotateCcw, Palette } from 'lucide-react';
import { GUIDED_STEPS } from '@/lib/guidedSwatches';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GuidedColorWizardProps {
  colors: string[];
  onColorChange: (index: number, color: string) => void;
  onComplete: () => void;
  onSwitchToFreeMode: () => void;
}

export function GuidedColorWizard({ 
  colors, 
  onColorChange, 
  onComplete,
  onSwitchToFreeMode 
}: GuidedColorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const step = GUIDED_STEPS[currentStep];
  const isLastStep = currentStep === GUIDED_STEPS.length - 1;
  const allStepsCompleted = completedSteps.size === GUIDED_STEPS.length;

  const handleSwatchSelect = (color: string) => {
    onColorChange(currentStep, color);
    setCompletedSteps(prev => new Set([...prev, currentStep]));
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    for (let i = 0; i < 6; i++) {
      onColorChange(i, '#FFFFFF');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl"
          >
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    {GUIDED_STEPS.map((_, idx) => (
                      <Button
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "rounded-full text-xs font-bold",
                          idx === currentStep 
                            ? 'bg-white text-black' 
                            : completedSteps.has(idx)
                            ? 'bg-green-500/80 text-white'
                            : 'bg-white/10 text-white/50'
                        )}
                        data-testid={`step-indicator-${idx + 1}`}
                      >
                        {completedSteps.has(idx) ? <Check className="w-4 h-4" /> : idx + 1}
                      </Button>
                    ))}
                  </div>
                  <span className="text-white/40 text-sm hidden sm:block">
                    Step {currentStep + 1} of {GUIDED_STEPS.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleReset}
                    size="icon"
                    variant="ghost"
                    className="text-white/60"
                    title="Start Over"
                    data-testid="button-reset-wizard"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={onSwitchToFreeMode}
                    variant="ghost"
                    size="sm"
                    className="text-white/60"
                    data-testid="button-free-mode"
                  >
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">Free Mode</span>
                  </Button>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    size="icon"
                    variant="ghost"
                    className="text-white/60"
                    data-testid="button-collapse-wizard"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    Fill {step.level}: {step.role}
                  </h3>
                  <span className="text-white/40 text-sm font-mono">
                    {step.lightnessRange} lightness
                  </span>
                </div>
                <p className="text-white/60 text-sm">
                  {step.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                  {step.swatches.map((swatch, idx) => {
                    const isSelected = colors[currentStep] === swatch;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSwatchSelect(swatch)}
                        className={cn(
                          "relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200 hover-elevate active-elevate-2",
                          isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900'
                        )}
                        style={{ backgroundColor: swatch }}
                        title={swatch}
                        data-testid={`swatch-${currentStep + 1}-${idx}`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  variant="ghost"
                  className="text-white"
                  data-testid="button-back"
                >
                  Back
                </Button>

                <div className="flex gap-3">
                  {allStepsCompleted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Button
                        onClick={onSwitchToFreeMode}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400"
                        data-testid="button-fine-tune"
                      >
                        Fine Tune Colors
                      </Button>
                    </motion.div>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={!completedSteps.has(currentStep)}
                    variant={completedSteps.has(currentStep) ? "default" : "ghost"}
                    className={cn(
                      completedSteps.has(currentStep)
                        ? 'bg-white text-black'
                        : 'text-white/50'
                    )}
                    data-testid="button-next"
                  >
                    {isLastStep ? 'Complete' : 'Next'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <Button
            onClick={() => setIsExpanded(true)}
            variant="outline"
            className="rounded-full bg-neutral-900/90 backdrop-blur-xl border-white/10 text-white shadow-xl"
            data-testid="button-expand-wizard"
          >
            <ChevronUp className="w-5 h-5" />
            <span className="font-semibold">Step {currentStep + 1}: {step.role}</span>
            <div className="flex gap-1 ml-2">
              {GUIDED_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    idx === currentStep 
                      ? 'bg-white' 
                      : completedSteps.has(idx) 
                      ? 'bg-green-500' 
                      : 'bg-white/20'
                  )}
                />
              ))}
            </div>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
