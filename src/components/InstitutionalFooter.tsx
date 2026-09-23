import React from 'react';

export const InstitutionalFooter: React.FC = () => {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
          <span className="font-bold text-slate-700">AdaptIQ Platform</span>
          <span>•</span>
          <span>Licensed to Easwari Engineering College (CSE Department)</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-[11px] text-slate-400">Autonomous Institution Affiliated to Anna University</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>
            Powered by <span className="font-bold text-slate-700">CodeTantra</span> Adaptive Core engine
          </span>
          <span>•</span>
          <span>© 2026 All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};
