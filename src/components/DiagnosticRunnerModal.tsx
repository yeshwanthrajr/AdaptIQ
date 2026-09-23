import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { diagnosticQuestions } from '../data/curriculumData';
import { DiagnosticQuestion, StudentProfile } from '../types';
import { X, Clock, CheckCircle2, XCircle, Sparkles, Award, ArrowRight } from 'lucide-react';

interface DiagnosticRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiagnosticComplete: (newMastery: number, newTier: string, scorePercent?: number) => void;
}

export const DiagnosticRunnerModal: React.FC<DiagnosticRunnerModalProps> = ({
  isOpen,
  onClose,
  onDiagnosticComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes (300 seconds)
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const currentQ = diagnosticQuestions[currentIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < diagnosticQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    let correctCount = 0;
    diagnosticQuestions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.correct) {
        correctCount += 1;
      }
    });

    const calculatedPercentage = Math.round((correctCount / diagnosticQuestions.length) * 100);
    const newMastery = Math.min(98, Math.max(86, 80 + Math.round(correctCount * 4.5)));
    const newTier = correctCount >= 3 ? 'L4 • Synthesis' : 'L3 • Analysis';

    setScore(calculatedPercentage);
    setIsFinished(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    onDiagnosticComplete(newMastery, newTier, calculatedPercentage);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTimeLeft(300);
    setIsFinished(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                  Adaptive Diagnostic Evaluation
                </span>
                <span className="text-xs text-slate-300">
                  Question {currentIdx + 1} of {diagnosticQuestions.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Real-Time Mastery Recalibration
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeFormatted}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-grow space-y-5">
          {!isFinished ? (
            <div className="space-y-4">
              
              {/* Question metadata badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  Topic: <strong className="text-slate-800">{currentQ.topic}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                  Bloom: {currentQ.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Optional Formula or Code block */}
              {currentQ.formula && (
                <div className="p-3 bg-slate-900 text-amber-300 rounded-lg font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                  {currentQ.formula}
                </div>
              )}

              {currentQ.codeSnippet && (
                <div className="p-3 bg-slate-900 text-indigo-200 rounded-lg font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                  <pre>{currentQ.codeSnippet}</pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === oIdx;
                  let optStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

                  if (showExplanation) {
                    if (opt.correct) {
                      optStyle = 'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-medium';
                    } else if (isSelected && !opt.correct) {
                      optStyle = 'border-rose-400 bg-rose-50/90 text-rose-950';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-600 bg-indigo-50/80 font-medium text-indigo-950';
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        {opt.label}
                      </span>
                      <span className="flex-grow">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation card after submit */}
              {showExplanation && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-slate-800">Adaptive Feedback &amp; Derivation:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentQ.options.find((o) => o.correct)?.explanation}
                  </p>
                </div>
              )}

            </div>
          ) : (
            /* Results Screen */
            <div className="py-6 px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Diagnostic Completed!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your neural systems proficiency has been calibrated across automatic differentiation, broadcasting rules, and vanishing gradients.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 block">Score</span>
                  <span className="text-2xl font-black text-indigo-900">{score}%</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">New Mastery</span>
                  <span className="text-2xl font-black text-emerald-900">88%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-w-md mx-auto">
                <span className="font-bold text-slate-800">Bloom Taxonomy Assessment: </span>
                Promoted to <span className="text-indigo-600 font-bold">L4 • Synthesis</span> tier. Module difficulty updated.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {!isFinished ? (
            <>
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex items-center gap-2">
                {!showExplanation ? (
                  <button
                    disabled={selectedAnswers[currentQ.id] === undefined}
                    onClick={handleCheckAnswer}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    Verify Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>{currentIdx < diagnosticQuestions.length - 1 ? 'Next Question' : 'Finish & Recalibrate'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Retake Diagnostic
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#15173c] hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                Apply &amp; Return to Dashboard
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
