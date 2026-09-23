import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FacultyNote, PracticeQuestion } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  note: FacultyNote | null;
}

export const PracticeTestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  note,
}) => {
  const { studentProfile, updateStudentData, addActivityLog } = useAuth();

  const questions: PracticeQuestion[] = note?.aiData?.practiceAssessment || [
    {
      id: 'q1',
      question: 'In deep learning backpropagation, why does reverse-mode automatic differentiation execute with O(1) computational passes for scalar losses?',
      options: [
        'Because forward mode requires allocating GPU SRAM buffers for every weight tensor',
        'Because reverse mode evaluates Vector-Jacobian Products from the scalar loss backward to all parameters in a single topological sweep',
        'Because automatic differentiation ignores non-convex activations',
        'Because reverse mode converts floating point numbers into 8-bit integers',
      ],
      correctAnswer: 1,
      explanation: 'Reverse-mode AD traverses the computation graph in reverse topological order, accumulating gradients for all parameters simultaneously against a single scalar objective.',
      bloomLevel: 'L4 • Synthesis',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  if (!isOpen || !note) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));

    if (selectedOption === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed!
      setIsCompleted(true);
      const finalScore = score + (selectedOption === currentQ.correctAnswer ? 1 : 0);
      const percentage = Math.round((finalScore / questions.length) * 100);

      // Trigger Confetti for passing score
      if (percentage >= 65) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Update student mastery and XP
      const masteryBump = percentage >= 80 ? 2 : 1;
      const newMastery = Math.min(100, (studentProfile.masteryIndex || 84) + masteryBump);
      const newXp = (studentProfile.totalXp || 800) + 150;

      updateStudentData({
        masteryIndex: newMastery,
        totalXp: newXp,
      });

      addActivityLog({
        userName: studentProfile.name,
        userEmail: studentProfile.email,
        userRole: 'student',
        action: `Completed Practice Assessment on "${note.title}" with score ${finalScore}/${questions.length} (${percentage}%). Mastery boosted to ${newMastery}%.`,
        status: 'SUCCESS',
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
    setUserAnswers({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                  Adaptive AI Practice Test
                </span>
                <span className="text-xs text-indigo-200">{note.unit}</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5 line-clamp-1">
                {note.title}
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

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6 space-y-5">
            
            {/* Progress Bar & Bloom Tier */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800">
                  Cognitive Target: {currentQ.bloomLevel}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = isAnswerSubmitted && idx === currentQ.correctAnswer;
                const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctAnswer;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                        : isWrong
                        ? 'bg-rose-50 border-rose-500 text-rose-950 font-semibold'
                        : isSelected
                        ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed flex-grow">{option}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {isWrong && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1 animate-fadeIn">
                <span className="font-extrabold uppercase text-[10px] text-indigo-700 block">
                  Step-by-Step Educational Solution:
                </span>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-medium">
                Current Score: {score}/{currentIndex + (isAnswerSubmitted && selectedOption === currentQ.correctAnswer ? 1 : 0)}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-98"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Test Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Test Complete Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Practice Assessment Completed!
              </h3>
              <p className="text-xs text-slate-500">
                Unit Test on: <strong>{note.title}</strong>
              </p>
            </div>

            {/* Score Ring */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto space-y-2">
              <div className="text-3xl font-black text-indigo-600">
                {score} / {questions.length}
              </div>
              <div className="text-xs font-bold text-slate-700">
                Mastery Score: {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-[11px] text-slate-500">
                Your profile has been credited with <strong>+150 XP</strong> and your mastery index increased.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Assessment</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Return to Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
