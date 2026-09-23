import React from 'react';
import { ActiveModal } from '../types';
import { 
  BookOpen, 
  FileCheck2, 
  Code2, 
  Cpu, 
  HelpCircle, 
  ChevronRight,
  Sparkles,
  CheckCircle,
  Radio
} from 'lucide-react';

interface AcademicWorkspacesGridProps {
  onOpenModal: (modal: ActiveModal) => void;
}

export const AcademicWorkspacesGrid: React.FC<AcademicWorkspacesGridProps> = ({
  onOpenModal,
}) => {
  return (
    <section className="space-y-3" data-purpose="academic-workspaces">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Academic Modules &amp; Workspaces
          </h2>
          <p className="text-xs text-slate-500">
            Core engineering curriculum, synchronous compiler tools, and verified department assessments
          </p>
        </div>
        <button 
          onClick={() => onOpenModal('courses')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Semester 6 Track Active</span>
          <span>→</span>
        </button>
      </div>

      {/* 5-Card High Fidelity Modern Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Courses & Subjects */}
        <article 
          onClick={() => onOpenModal('courses')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Courses &amp; Subjects
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              6 active theory &amp; laboratory courses. 2 submissions due.
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                Deep Learning
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                Compilers
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between">
            <span>View curriculum</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </article>

        {/* Card 2: Tests & Scheduled Exams */}
        <article 
          onClick={() => onOpenModal('tests')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                Tests &amp; Exams
              </h3>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Next: <span className="font-medium text-slate-700">DL Midterm II</span> tomorrow 10:00 AM
            </p>
            <div className="mt-3 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded inline-block">
              Avg Score: 91.4%
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between">
            <span>Schedule &amp; mocks</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </article>

        {/* Card 3: Cloud Programming Labs (Featured with ONLINE IDE tag) */}
        <article 
          onClick={() => onOpenModal('cloud-lab')}
          className="bg-white rounded-xl p-4 border border-indigo-200 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between group relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 bg-indigo-600 text-[9px] font-extrabold uppercase text-white px-2 py-0.5 rounded-bl">
            Online IDE
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Programming Labs
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dockerized CUDA runtime. PyTorch 2.3 &amp; GCC ready.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>gpu-k8s-pod: active</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between">
            <span>Launch Cloud Lab</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </article>

        {/* Card 4: Compiler Tools & Sandboxes */}
        <article 
          onClick={() => onOpenModal('tools-suite')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Tools &amp; Sandboxes
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              AST visualizer, gradient graph builder, and tensor inspector.
            </p>
            <div className="flex gap-1 mt-3">
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">
                AutoDiff Sim
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between">
            <span>Explore tools suite</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </article>

        {/* Card 5: Help & Academic Support */}
        <article 
          onClick={() => onOpenModal('mentorship')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              Help &amp; Mentorship
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Faculty office hours with Dr. K. Ramesh &amp; 24/7 AI tutor bot.
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                Queue: Instant
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between">
            <span>Get help &amp; support</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </article>

      </div>
    </section>
  );
};
