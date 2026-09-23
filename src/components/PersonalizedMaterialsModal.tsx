import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FacultyNote } from '../types';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Target, 
  BrainCircuit, 
  Lightbulb, 
  AlertTriangle, 
  GraduationCap, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTest: (note: FacultyNote) => void;
}

export const PersonalizedMaterialsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLaunchTest,
}) => {
  const { facultyNotes } = useAuth();
  const [selectedNote, setSelectedNote] = useState<FacultyNote>(facultyNotes[0] || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh] animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                  AI Personalized Study Materials
                </span>
                <span className="text-xs text-indigo-200">Anna University CS8601</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Faculty Lecture Notes • Cognitive Visual Models &amp; Prioritization
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-grow overflow-hidden">
          
          {/* Note selector column */}
          <div className="md:col-span-1 border-r border-slate-200 p-4 space-y-2 overflow-y-auto bg-slate-50/50">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
              Available Units &amp; Courseware ({facultyNotes.length}):
            </span>

            {facultyNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  selectedNote?.id === note.id
                    ? 'bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-500/20'
                    : 'bg-white/80 hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 uppercase">
                  <span>{note.unit}</span>
                  <span className="text-slate-400">{note.uploadDate}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{note.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">By {note.facultyName}</p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    AI Picturized
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 p-5 overflow-y-auto space-y-6">
            {selectedNote?.aiData ? (
              <div className="space-y-6">
                
                {/* Note Header & Action button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase">
                      {selectedNote.unit} • {selectedNote.unitName}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedNote.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Uploaded by {selectedNote.facultyName}</p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onLaunchTest(selectedNote);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Launch Adaptive Practice Test</span>
                  </button>
                </div>

                {/* AI Summary */}
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-950 leading-relaxed">
                  <strong>Cognitive Synthesis:</strong> {selectedNote.aiData.summary}
                </div>

                {/* Priority Concepts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-rose-600" />
                    <span>Unit-Wise Concept Priority &amp; University Exam Weights</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedNote.aiData.priorityConcepts.map((concept, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                            concept.priority === 'CRITICAL_EXAM'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : concept.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {concept.priority}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {concept.bloomLevel} • ~{concept.estimatedMinutes}m
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">{concept.name}</h5>
                        <p className="text-[11px] text-slate-600 leading-snug">{concept.importanceReason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Mental Models */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    <span>Concept Picturization &amp; Computation Graph Flows</span>
                  </h4>

                  {selectedNote.aiData.visualMentalModels.map((model, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{model.concept}</span>
                        </h5>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {model.visualType}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-700 italic">
                        "{model.headline}"
                      </p>

                      <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                        <pre>{model.representation}</pre>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] font-extrabold text-amber-700 uppercase block mb-0.5">
                            💡 Physical Analogy
                          </span>
                          <p className="text-[11px] text-slate-700 leading-snug">{model.analogy}</p>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] font-extrabold text-rose-700 uppercase block mb-0.5">
                            ⚠️ Common Exam Pitfall
                          </span>
                          <p className="text-[11px] text-slate-700 leading-snug">{model.commonPitfall}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adaptive Recommendations */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Personalized Cognitive Guidance</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Recommended Strategy
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {selectedNote.aiData.adaptiveAdjustments.forStrugglingStudents}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Anna University Exam Tip
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {selectedNote.aiData.adaptiveAdjustments.examTip}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No AI decomposed data available for this note.</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by AdaptIQ Cognitive AI Engine • Synchronized with Faculty Syllabus
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
