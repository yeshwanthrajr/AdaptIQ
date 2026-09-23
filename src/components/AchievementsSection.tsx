import React, { useState } from 'react';
import { Badge, ActiveModal } from '../types';
import { 
  Award, 
  Crown, 
  Zap, 
  Target, 
  GitFork, 
  Cpu, 
  Layers, 
  Compass, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface AchievementsSectionProps {
  badges: Badge[];
  onOpenModal: (modal: ActiveModal) => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  badges,
  onOpenModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'modules'>('all');

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalBadges = badges.length;
  const totalEarnedXp = badges
    .filter((b) => b.unlocked)
    .reduce((acc, curr) => acc + curr.xpReward, 0);
  const maxPossibleXp = badges.reduce((acc, curr) => acc + curr.xpReward, 0);

  // Compute student level based on XP
  const level = Math.floor(totalEarnedXp / 300) + 1;
  const nextLevelXp = level * 300;
  const currentLevelProgress = ((totalEarnedXp % 300) / 300) * 100;

  const filteredBadges = badges.filter((badge) => {
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    if (filter === 'modules') return badge.category === 'module' || badge.category === 'diagnostic';
    return true;
  });

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? 'text-amber-400' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Crown':
        return <Crown className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'GitFork':
        return <GitFork className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Award':
      default:
        return <Award className={className} />;
    }
  };

  const getRarityBadge = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-amber-500/20 text-amber-600 border border-amber-400/40">
            Legendary
          </span>
        );
      case 'Epic':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-purple-500/20 text-purple-600 border border-purple-400/40">
            Epic
          </span>
        );
      case 'Rare':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-600 border border-indigo-400/40">
            Rare
          </span>
        );
      case 'Common':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-slate-200 text-slate-700 border border-slate-300">
            Common
          </span>
        );
    }
  };

  const getActionForBadge = (badgeId: string): { label: string; modal: ActiveModal } => {
    switch (badgeId) {
      case 'badge-backprop-master':
        return { label: 'Start Backprop Session', modal: 'backprop-session' };
      case 'badge-diag-ace':
        return { label: 'Take 5-Min Diagnostic', modal: 'diagnostic' };
      case 'badge-cuda-kernel':
        return { label: 'Open Cloud Lab IDE', modal: 'cloud-lab' };
      case 'badge-matrix-virtuoso':
        return { label: 'Open Matrix Sandbox', modal: 'matrix-calculus' };
      case 'badge-loss-explorer':
        return { label: 'Launch Loss Explorer', modal: 'tools-suite' };
      default:
        return { label: 'View Curriculum', modal: null };
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      
      {/* Header and Level Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#15173c] rounded-[14px] flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Academic Achievements &amp; Badges
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified Credentials
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited milestones earned through diagnostic excellence, calculus proofs, and lab execution
            </p>
          </div>
        </div>

        {/* Level and XP Summary Card */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 px-4 self-start lg:self-auto">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Level {level} Engineer</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {totalEarnedXp} / {maxPossibleXp} Total XP
            </span>
          </div>
          
          <div className="w-24 sm:w-32 flex flex-col gap-1">
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 text-right font-medium">
              {nextLevelXp - totalEarnedXp} XP to Level {level + 1}
            </span>
          </div>

          <div className="pl-3 border-l border-slate-200 flex flex-col text-center">
            <span className="text-base font-extrabold text-[#15173c]">
              {unlockedCount}/{totalBadges}
            </span>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 pt-4 pb-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({badges.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'unlocked'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'locked'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({totalBadges - unlockedCount})
          </button>
          <button
            onClick={() => setFilter('modules')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'modules'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modules &amp; Diagnostics
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-medium">
          Completing lab sessions and diagnostics immediately awards badges and XP
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {filteredBadges.map((badge) => {
          const action = getActionForBadge(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden group ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-white to-amber-50/20 border-amber-200/70 shadow-xs hover:border-amber-300 hover:shadow-md'
                  : 'bg-slate-50/70 border-slate-200/80 opacity-85 hover:opacity-100 hover:bg-white'
              }`}
            >
              {/* Unlocked status accent ribbon */}
              {badge.unlocked && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="bg-amber-400 text-slate-900 text-[9px] font-black py-0.5 text-center transform rotate-45 translate-x-4 translate-y-2 w-20 shadow-xs">
                    EARNED
                  </div>
                </div>
              )}

              <div>
                {/* Top Row: Icon + Rarity */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 ${
                      badge.unlocked
                        ? 'bg-[#15173c] border-amber-400/30'
                        : 'bg-slate-200/80 border-slate-300'
                    }`}
                  >
                    {badge.unlocked ? (
                      getBadgeIcon(badge.icon, true)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {getRarityBadge(badge.rarity)}
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {badge.description}
                </p>

                {/* Requirement */}
                <div className="mt-3 p-2 rounded-lg bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{badge.requirement}</span>
                </div>
              </div>

              {/* Bottom Row: Progress or Unlocked Timestamp */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Unlocked
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {badge.unlockedAt || 'Recent'}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>In Progress</span>
                      <span>{badge.progress?.label}</span>
                    </div>
                    {action.modal && (
                      <button
                        onClick={() => onOpenModal(action.modal)}
                        className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 active:scale-98"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
