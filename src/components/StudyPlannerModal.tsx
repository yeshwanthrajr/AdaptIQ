import React from 'react';
import { StudyTask, ActiveModal } from '../types';
import { WeeklyStudyPlanner } from './WeeklyStudyPlanner';
import { X, Calendar } from 'lucide-react';

interface StudyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const StudyPlannerModal: React.FC<StudyPlannerModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onOpenModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded inline-block">
                Academic Schedule &amp; Milestones
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Weekly Study Planner &amp; Lab Agenda
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

        {/* Body containing WeeklyStudyPlanner */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <WeeklyStudyPlanner
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
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
