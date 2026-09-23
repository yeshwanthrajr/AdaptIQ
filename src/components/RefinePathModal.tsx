import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

interface RefinePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPace: number;
  onUpdateSettings: (newPace: number, newPaceDesc: string) => void;
}

export const RefinePathModal: React.FC<RefinePathModalProps> = ({
  isOpen,
  onClose,
  currentPace,
  onUpdateSettings,
}) => {
  const [selectedPace, setSelectedPace] = useState<number>(currentPace);
  const [selectedGoal, setSelectedGoal] = useState<string>('dl-systems');
  const [primaryModality, setPrimaryModality] = useState<string>('interactive');
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    let desc = 'Optimal load calibration sustained';
    if (selectedPace > 3) desc = 'Accelerated honors velocity calibrated';
    else if (selectedPace < 2.2) desc = 'Foundational mastery depth sustained';

    onUpdateSettings(selectedPace, desc);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                Personalized Learning Pathway
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Refine Academic Trajectory
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Pace Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block text-xs">
              Weekly Learning Velocity (Pace Factor)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { pace: 1.8, label: 'Steady', sub: '1.8 mods/wk' },
                { pace: 2.6, label: 'Optimal', sub: '2.6 mods/wk' },
                { pace: 3.4, label: 'Accelerated', sub: '3.4 mods/wk' },
              ].map((p) => (
                <button
                  key={p.pace}
                  onClick={() => setSelectedPace(p.pace)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedPace === p.pace
                      ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-950 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-500">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Specialization Target */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block text-xs">
              Target Technical Specialization
            </label>
            <div className="space-y-2">
              {[
                { id: 'dl-systems', title: 'Deep Learning & Neural Hardware Systems', desc: 'Focus on CUDA tensor acceleration and computation graphs' },
                { id: 'compilers', title: 'Compilers & Intermediate Representations', desc: 'Focus on LLVM passes, SSA form, and register allocation' },
                { id: 'cloud-k8s', title: 'Distributed Systems & Cloud Orchestration', desc: 'Focus on consensus protocols and high-throughput microservices' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedGoal === g.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{g.title}</div>
                  <div className="text-[11px] text-slate-500">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Modality */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block text-xs">
              Primary Modality Bias
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'interactive', label: 'Interactive IDE Labs (65%)' },
                { id: 'video', label: 'Visual Lectures (25%)' },
                { id: 'papers', label: 'Papers & Math (10%)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPrimaryModality(m.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all text-[11px] ${
                    primaryModality === m.id
                      ? 'border-amber-500 bg-amber-50 font-bold text-amber-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Curriculum pathway recalibrated and saved!</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            Save &amp; Recalibrate
          </button>
        </div>

      </div>
    </div>
  );
};
