import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Badge } from '../types';
import { Award, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AchievementUnlockedToastProps {
  badge: Badge | null;
  onClose: () => void;
}

export const AchievementUnlockedToast: React.FC<AchievementUnlockedToastProps> = ({
  badge,
  onClose,
}) => {
  useEffect(() => {
    if (badge) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899', '#3b82f6'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className="bg-[#15173c] text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400 flex flex-col gap-3 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md animate-pulse">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Achievement Unlocked!</span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">{badge.title}</h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pl-1">
          {badge.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
          <span className="text-amber-400 font-bold bg-amber-400/20 px-2 py-0.5 rounded text-[11px]">
            +{badge.xpReward} XP Earned
          </span>
          <button
            onClick={onClose}
            className="text-indigo-300 hover:text-indigo-200 text-xs font-semibold flex items-center gap-1"
          >
            <span>Awesome</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
