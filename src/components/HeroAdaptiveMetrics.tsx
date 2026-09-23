import React from 'react';
import { StudentProfile, ActiveModal } from '../types';
import { ArrowUpRight, Sparkles, Activity, Layers, Terminal } from 'lucide-react';

interface HeroAdaptiveMetricsProps {
  profile: StudentProfile;
  onOpenModal: (modal: ActiveModal) => void;
}

export const HeroAdaptiveMetrics: React.FC<HeroAdaptiveMetricsProps> = ({
  profile,
  onOpenModal,
}) => {
  return (
    <section 
      className="bg-[#15173c] rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden" 
      data-purpose="hero-adaptive-status"
    >
      {/* Background subtle atmospheric radial glow */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Top row: Status indicator & Welcome title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome back, {profile.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal leading-relaxed">
              Your neural systems &amp; compiler design track is trending{' '}
              <span className="text-emerald-400 font-semibold">8% ahead</span> of schedule. Next milestone checkpoint is scheduled in 2 days.
            </p>
          </div>

          <div 
            onClick={() => onOpenModal('diagnostic')}
            className="flex items-center gap-2 self-start md:self-auto bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 cursor-pointer transition-all hover:border-indigo-400/50"
            title="Click to trigger dynamic recalibration diagnostic"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 glow-amber animate-pulse"></span>
            <span>Recalibrated {profile.lastRecalibrated}</span>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded ml-1">
              Recalibrate
            </span>
          </div>
        </div>

        {/* Metric Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Stat 1: Mastery Index */}
          <div 
            onClick={() => onOpenModal('diagnostic')}
            className="bg-[#1e224f]/90 hover:bg-[#1e224f] border border-indigo-400/20 hover:border-indigo-400/40 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Mastery index
              </span>
              <Activity className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white">
                {profile.masteryIndex}%
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                ↑ {profile.masteryDelta}% this week
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${profile.masteryIndex}%` }} 
              />
            </div>
          </div>

          {/* Stat 2: Pace Factor */}
          <div 
            onClick={() => onOpenModal('refine-path')}
            className="bg-[#1e224f]/90 hover:bg-[#1e224f] border border-indigo-400/20 hover:border-indigo-400/40 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Pace factor
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-white">
                {profile.paceFactor}
              </span>
              <span className="text-xs text-indigo-300">modules / week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-normal">
              {profile.paceDescription}
            </p>
          </div>

          {/* Stat 3: Primary Style */}
          <div 
            onClick={() => onOpenModal('cloud-lab')}
            className="bg-[#1e224f]/90 hover:bg-[#1e224f] border border-indigo-400/20 hover:border-indigo-400/40 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Primary style
              </span>
              <Terminal className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {profile.primaryStyle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>{profile.primaryStyleStat}</span>
            </div>
          </div>

          {/* Stat 4: Bloom Tier */}
          <div 
            onClick={() => onOpenModal('diagnostic')}
            className="bg-[#1e224f]/90 hover:bg-[#1e224f] border border-indigo-400/20 hover:border-indigo-400/40 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Bloom tier
              </span>
              <Layers className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-300">
                {profile.bloomTier}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-3 flex items-center gap-1 font-medium">
              <span className="text-emerald-400 font-semibold">↑</span> {profile.bloomTierNote}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
