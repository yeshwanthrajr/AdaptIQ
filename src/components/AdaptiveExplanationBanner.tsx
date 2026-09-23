import React from 'react';
import { ActiveModal } from '../types';

interface AdaptiveExplanationBannerProps {
  onOpenModal: (modal: ActiveModal) => void;
}

export const AdaptiveExplanationBanner: React.FC<AdaptiveExplanationBannerProps> = ({
  onOpenModal,
}) => {
  const steps = [
    {
      id: 'step-1',
      symbol: '◎',
      title: 'Capture',
      bgColor: 'bg-amber-50 text-amber-600',
      description: 'Logs compilation runtime errors, hesitation on proofs, and quiz response speeds.',
      action: () => onOpenModal('diagnostic'),
    },
    {
      id: 'step-2',
      symbol: '~',
      title: 'Analyze',
      bgColor: 'bg-indigo-50 text-indigo-600',
      description: 'Constructs a live concept-dependency graph mapped against ABET engineering standards.',
      action: () => onOpenModal('tools-suite'),
    },
    {
      id: 'step-3',
      symbol: '✦',
      title: 'Recommend',
      bgColor: 'bg-orange-50 text-orange-600',
      description: 'Dynamically sequences code sandboxes, lecture micro-modules, and tensor notebooks.',
      action: () => onOpenModal('matrix-calculus'),
    },
    {
      id: 'step-4',
      symbol: '↻',
      title: 'Adapt',
      bgColor: 'bg-emerald-50 text-emerald-600',
      description: 'Adjusts lab difficulty, test challenge tiers, and code scaffolding after every compilation.',
      action: () => onOpenModal('refine-path'),
    },
  ];

  return (
    <section className="space-y-2" data-purpose="how-path-is-built">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        How your path is built
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={step.action}
            className="bg-white border border-slate-200/80 hover:border-indigo-300 rounded-xl p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2 group"
          >
            <div className={`w-7 h-7 rounded-lg ${step.bgColor} flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform`}>
              {step.symbol}
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {step.title}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
