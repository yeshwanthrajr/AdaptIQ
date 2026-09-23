import React, { useState } from 'react';
import { academicCourses } from '../data/curriculumData';
import { CourseItem, ActiveModal } from '../types';
import { X, BookOpen, Clock, FileText, CheckCircle2, ChevronRight, User } from 'lucide-react';

interface CoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLab: () => void;
}

export const CoursesModal: React.FC<CoursesModalProps> = ({
  isOpen,
  onClose,
  onOpenLab,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseItem>(academicCourses[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                Easwari CSE • Semester 6 Academic Track
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Courses, Subjects &amp; Laboratory Curriculum
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

        {/* Content Body: Course list on left, syllabus & details on right */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Course List */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-3 space-y-2 overflow-y-auto flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">
              Active Courses ({academicCourses.length})
            </span>
            <div className="space-y-1.5">
              {academicCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all text-xs flex flex-col gap-1 ${
                    selectedCourse.id === c.id
                      ? 'bg-white shadow-sm border border-indigo-300 font-bold text-slate-900'
                      : 'hover:bg-white text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-slate-500">{c.credits} Credits</span>
                  </div>
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Selected Course Detail */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 text-xs">
            <div className="space-y-2 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {selectedCourse.code}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedCourse.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCourse.title}
              </h3>
              <p className="text-slate-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Instructor: <strong className="text-slate-800">{selectedCourse.instructor}</strong>
              </p>
            </div>

            {/* Attendance & Submissions Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Attendance</span>
                <span className="text-lg font-bold text-emerald-900">{selectedCourse.attendance}%</span>
                <p className="text-[10px] text-emerald-600">Eligible for End-Sem Exam</p>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Lab Submissions</span>
                <span className="text-lg font-bold text-indigo-900">{selectedCourse.submissionsDue} Pending</span>
                <p className="text-[10px] text-indigo-600">Due before Friday 11:59 PM</p>
              </div>
            </div>

            {/* Modules / Units */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Curriculum Modules &amp; Verified Units:</h4>
              <div className="space-y-2">
                {selectedCourse.modules.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      Unit {idx + 1}: {m}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      Syllabus Synced
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenLab();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
              >
                Launch Course Cloud Lab IDE
              </button>
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
