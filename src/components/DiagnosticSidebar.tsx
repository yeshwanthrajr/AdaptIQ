import React from 'react';
import { InsightItem, RecommendedResource, ActiveModal } from '../types';
import { AlertTriangle, Play, Sparkles, FileCode2, ExternalLink } from 'lucide-react';

interface DiagnosticSidebarProps {
  insights: InsightItem[];
  resources: RecommendedResource[];
  onOpenModal: (modal: ActiveModal) => void;
}

export const DiagnosticSidebar: React.FC<DiagnosticSidebarProps> = ({
  insights,
  resources,
  onOpenModal,
}) => {
  return (
    <aside className="space-y-5" data-purpose="diagnostic-sidebar">
      
      {/* 5-minute diagnostic Trigger Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            5-minute diagnostic
          </h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
            Adaptive Test
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Recalibrates module challenge level and lab constraints in real time based on your answers and response speed.
        </p>
        <button 
          onClick={() => onOpenModal('diagnostic')}
          className="w-full py-2.5 px-4 bg-[#15173c] hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors shadow-sm active:scale-98 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Start diagnostic</span>
        </button>
      </div>

      {/* Real-Time Insights & Telemetry */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Insights</h3>
          <p className="text-xs text-slate-500">Detected automatically from your recent lab compilations</p>
        </div>

        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              onClick={() => {
                if (insight.recommendedAction) {
                  onOpenModal(insight.recommendedAction);
                }
              }}
              className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-amber-50/50 cursor-pointer transition-colors group"
            >
              <span className="text-amber-500 text-sm mt-0.5 font-bold">▲</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-900 transition-colors">
                  {insight.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {insight.description}
                </p>
                {insight.actionPrompt && (
                  <span className="text-[10px] text-indigo-600 font-semibold inline-flex items-center gap-0.5 mt-1 group-hover:underline">
                    {insight.actionPrompt} →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modality Receptivity Gauge */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Modality receptivity</span>
            <span className="text-[10px] text-slate-400 font-medium">Kinesthetic Peak</span>
          </div>
          {/* Multi-colored segment bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: '65%' }} title="Interactive: 65%"></div>
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: '25%' }} title="Video: 25%"></div>
            <div className="bg-slate-300 h-full transition-all duration-500" style={{ width: '10%' }} title="Text: 10%"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Interactive 65% • Video 25% • Text 10%
          </p>
        </div>
      </div>

      {/* Recommended Resources Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Recommended resources</h3>
          <p className="text-xs text-slate-500">Filtered for your primary interactive modality</p>
        </div>

        <div className="space-y-2 pt-1">
          {resources.map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenModal(res.actionKey)}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center text-slate-600 text-xs flex-shrink-0 mt-0.5 font-bold transition-colors">
                {res.iconSymbol}
              </div>
              <div className="flex-grow">
                <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">
                  {res.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {res.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};
