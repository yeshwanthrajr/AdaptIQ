import React from 'react';
import { Badge, ActiveModal } from '../types';
import { AchievementsSection } from './AchievementsSection';
import { X, Award } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  onOpenModal: (modal: ActiveModal) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  badges,
  onOpenModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded inline-block">
                Academic Credentialing
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Engineering Badges &amp; Mastery Achievements
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
        <div className="p-4 sm:p-6 overflow-y-auto">
          <AchievementsSection
            badges={badges}
            onOpenModal={(modal) => {
              onClose();
              if (modal) onOpenModal(modal);
            }}
          />
        </div>
      </div>
    </div>
  );
};
