import React from 'react';
import { CurriculumModule, ActiveModal } from '../types';
import { Check, Lock, ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';

interface CurriculumTimelineProps {
  modules: CurriculumModule[];
  onOpenModal: (modal: ActiveModal) => void;
}

export const CurriculumTimeline: React.FC<CurriculumTimelineProps> = ({
  modules,
  onOpenModal,
}) => {
  return (
    <section className="space-y-4" data-purpose="curriculum-timeline">
      
      {/* Header with Course Context and Path Refinement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Deep learning and neural architectures
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequenced for you based on algorithmic calculus &amp; linear algebra proficiency
          </p>
        </div>
        <button 
          onClick={() => onOpenModal('refine-path')}
          className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Refine path</span>
        </button>
      </div>

      <div className="space-y-3.5">
        
        {/* Module Item 1: Mastered Item (Green Check) */}
        <div 
          onClick={() => onOpenModal('loss-explorer')}
          className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Gradient descent and loss landscapes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Stochastic gradients, momentum vectors, and convex optimization criteria
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">96% mastery</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline-block">
              Review
            </span>
          </div>
        </div>

        {/* Module Item 2: CURRENT FOCUS (Hero Dark Card with Gold Button) */}
        <div 
          className="bg-[#15173c] rounded-xl p-5 text-white shadow-lg border border-indigo-500/30 relative overflow-hidden group" 
          data-purpose="current-focus-card"
        >
          {/* Accent highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-400 to-indigo-600" />
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide text-amber-400 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Current focus • level 4 • about 24 min left
              </span>
              <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700">
                Unit 3 of 8
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Backpropagation mechanics and computation graphs
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Reverse-mode algorithmic differentiation, Jacobian chain rules, and tensor gradient memory layouts. Difficulty raised after a fast quiz turnaround.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button 
                onClick={() => onOpenModal('backprop-session')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-98"
              >
                <span>Continue session</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onOpenModal('cloud-lab')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>Open PyTorch Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Module Item 3: Recommended Now Refresher Card (Subtle Gold background) */}
        <div className="bg-amber-50/70 hover:bg-amber-50/90 rounded-xl border border-amber-200/80 p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              Recommended now
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Matrix calculus refresher
            </h3>
            <p className="text-xs text-slate-600">
              An 8-minute micro-module to clear up logged hesitation on Kronecker products and transpose gradients.
            </p>
          </div>
          <button 
            onClick={() => onOpenModal('matrix-calculus')}
            className="self-start sm:self-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300 transition-colors shadow-2xs whitespace-nowrap active:scale-98"
          >
            Open module • 8 min
          </button>
        </div>

        {/* Module Item 4: Locked Dependent Module */}
        <div className="bg-slate-50/90 rounded-xl border border-dashed border-slate-200 p-4 flex items-center gap-3.5 opacity-80">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-600">
              Convolutional neural networks and feature maps
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlocks once the backpropagation module &amp; cloud lab kernel are verified complete
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
