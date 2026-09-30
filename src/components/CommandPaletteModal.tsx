import React, { useState, useEffect } from 'react';
import { ActiveModal, ViewMode } from '../types';
import { Search, X, BookOpen, Terminal, Cpu, FileCheck2, Bot, Layers, ArrowRight, Award, Calendar } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (modal: ActiveModal) => void;
  onToggleViewMode: () => void;
  viewMode: ViewMode;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onToggleViewMode,
  viewMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('command-palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const allItems = [
    { title: 'Backpropagation Mechanics & Computation Graphs', desc: 'Current Focus session • Level 4 reverse AD', icon: Layers, action: () => onSelectAction('backprop-session') },
    { title: '5-Minute Adaptive Diagnostic', desc: 'Recalibrate challenge level and lab constraints', icon: FileCheck2, action: () => onSelectAction('diagnostic') },
    { title: 'Cloud Programming Lab (gpu-k8s-pod)', desc: 'Online IDE with PyTorch 2.3 & CUDA runtime', icon: Terminal, action: () => onSelectAction('cloud-lab') },
    { title: 'Matrix Calculus Refresher (8 min)', desc: 'Kronecker products, transpose trace theorems', icon: BookOpen, action: () => onSelectAction('matrix-calculus') },
    { title: 'Interactive Loss Surface Explorer', desc: 'Contour plot with SGD, Momentum, Adam optimization', icon: Cpu, action: () => onSelectAction('tools-suite') },
    { title: 'Weekly Study Planner & Lab Schedule', desc: 'Schedule module reviews, cloud labs, and track weekly goals', icon: Calendar, action: () => onSelectAction('study-planner') },
    { title: 'Academic Achievements & Badges', desc: 'Earned badges, verified credentials, and XP progress', icon: Award, action: () => onSelectAction('achievements') },
    { title: 'Courses & Curriculum Modules', desc: 'Deep Learning, Compilers, Distributed Systems', icon: BookOpen, action: () => onSelectAction('courses') },
    { title: 'Scheduled Tests & Exams (DL Midterm II)', desc: 'Exam syllabus, mock tests, and historical scores', icon: FileCheck2, action: () => onSelectAction('tests') },
    { title: 'Faculty Mentorship & 24/7 AI Tutor', desc: 'Consult Dr. K. Ramesh or ask the AI Tutor questions', icon: Bot, action: () => onSelectAction('mentorship') },
    { title: `Switch student layout: ${viewMode === 'modern' ? 'Classic CodeTantra View' : 'Modern AdaptIQ LMS'}`, desc: 'Change the layout of the current student portal', icon: ArrowRight, action: () => { onToggleViewMode(); onClose(); } },
  ];

  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Search Input */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, subject, lab, or shortcut..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow text-xs text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-300 rounded shadow-2xs">
            ESC
          </kbd>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-950 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-indigo-900">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching modules or tools found for "{searchQuery}"
            </div>
          )}
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Navigate using click or keyboard shortcuts</span>
          <span>AdaptIQ Intelligence</span>
        </div>

      </div>
    </div>
  );
};
