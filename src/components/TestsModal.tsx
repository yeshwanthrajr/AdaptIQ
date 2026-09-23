import React from 'react';
import { academicTests } from '../data/curriculumData';
import { TestItem } from '../types';
import { X, FileCheck2, Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface TestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchMockDiagnostic: () => void;
}

export const TestsModal: React.FC<TestsModalProps> = ({
  isOpen,
  onClose,
  onLaunchMockDiagnostic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 font-bold text-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                Department Assessment Schedule
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Tests, Examinations &amp; Adaptive Mocks
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
        <div className="p-5 overflow-y-auto flex-grow space-y-6 text-xs">
          
          {/* Featured Urgent Test */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px] uppercase animate-pulse">
                Imminent Exam
              </span>
              <span className="text-purple-800 font-semibold text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Tomorrow • 10:00 AM (90 mins)
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Deep Learning Midterm Examination II (CS801)
              </h3>
              <p className="text-slate-600 mt-1">
                Syllabus: Reverse-mode automatic differentiation, Jacobian matrices, Hessian conditioning, batch normalization, and Adam optimizer convergence.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onLaunchMockDiagnostic();
                }}
                className="px-4 py-2 bg-[#15173c] hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Launch Adaptive Mock Exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Test Schedule List */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Examination History &amp; Timetable</h4>
            <div className="space-y-2.5">
              {academicTests.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{t.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                        {t.course}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {t.date}
                      </span>
                      <span>•</span>
                      <span>Total Marks: {t.totalMarks}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {t.status === 'completed' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600">
                          Scored: {t.score} / {t.totalMarks}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
