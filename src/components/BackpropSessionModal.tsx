import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Play, RotateCcw, ArrowRight, CheckCircle2, AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react';

interface BackpropSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete?: () => void;
}

export const BackpropSessionModal: React.FC<BackpropSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  // Input parameters for computation graph
  const [x, setX] = useState<number>(1.5);
  const [w, setW] = useState<number>(0.8);
  const [b, setB] = useState<number>(-0.4);
  const [yTarget, setYTarget] = useState<number>(1.0);
  const [learningRate, setLearningRate] = useState<number>(0.5);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'graph' | 'quiz' | 'proof'>('graph');

  // Mini quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Forward Pass Calculations
  const z = w * x + b;
  const sigmoid = (val: number) => 1 / (1 + Math.exp(-val));
  const a = sigmoid(z);
  const loss = 0.5 * Math.pow(yTarget - a, 2);

  // Backward Pass Calculations (Analytical Gradients)
  const dL_da = a - yTarget;
  const da_dz = a * (1 - a); // sigmoid derivative
  const dz_dw = x;
  const dz_db = 1.0;
  const dz_dx = w;

  const dL_dz = dL_da * da_dz; // local error delta
  const dL_dw = dL_dz * dz_dw;
  const dL_db = dL_dz * dz_db;
  const dL_dx = dL_dz * dz_dx;

  // Perform single SGD step
  const handleGradientStep = () => {
    setW((prevW) => parseFloat((prevW - learningRate * dL_dw).toFixed(4)));
    setB((prevB) => parseFloat((prevB - learningRate * dL_db).toFixed(4)));
  };

  const handleReset = () => {
    setX(1.5);
    setW(0.8);
    setB(-0.4);
    setYTarget(1.0);
  };

  const handleFinish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCompleted(true);
    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                  Level 4 • Computation Graphs
                </span>
                <span className="text-xs text-slate-300">Unit 3 of 8</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Backpropagation Mechanics &amp; Computational Graphs
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('graph')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'graph' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Computation Graph &amp; Gradients
          </button>
          <button
            onClick={() => setActiveTab('proof')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'proof' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mathematical Chain Rule Proof
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'quiz' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Checkpoint Challenge
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-grow space-y-6">
          
          {activeTab === 'graph' && (
            <div className="space-y-6">
              
              {/* Sliders Control Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Input x:</span>
                    <span className="font-mono text-indigo-600">{x.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.1"
                    value={x}
                    onChange={(e) => setX(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Weight w:</span>
                    <span className="font-mono text-indigo-600">{w.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.05"
                    value={w}
                    onChange={(e) => setW(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Bias b:</span>
                    <span className="font-mono text-indigo-600">{b.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.05"
                    value={b}
                    onChange={(e) => setB(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Target y:</span>
                    <span className="font-mono text-amber-600">{yTarget.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={yTarget}
                    onChange={(e) => setYTarget(parseFloat(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>

              {/* Visual Computation Graph */}
              <div className="relative bg-[#15173c] text-white p-6 rounded-2xl border border-indigo-500/20 overflow-x-auto shadow-inner">
                <div className="min-w-[620px] flex items-center justify-between gap-4 py-2">
                  
                  {/* Stage 1: Inputs */}
                  <div className="flex flex-col gap-4">
                    {/* Node x */}
                    <div className="bg-[#1e224f] border border-indigo-400/30 rounded-xl p-3 text-center w-28">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Input</span>
                      <div className="text-base font-bold text-white">x = {x.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">∂L/∂x = {dL_dx.toFixed(3)}</div>
                    </div>
                    {/* Node w */}
                    <div className="bg-[#1e224f] border border-amber-400/30 rounded-xl p-3 text-center w-28">
                      <span className="text-[10px] text-amber-400 uppercase font-semibold">Weight</span>
                      <div className="text-base font-bold text-amber-300">w = {w.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">∂L/∂w = {dL_dw.toFixed(3)}</div>
                    </div>
                    {/* Node b */}
                    <div className="bg-[#1e224f] border border-slate-600 rounded-xl p-3 text-center w-28">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Bias</span>
                      <div className="text-base font-bold text-white">b = {b.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">∂L/∂b = {dL_db.toFixed(3)}</div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center text-xs text-indigo-300 font-mono">
                    <span className="text-[10px] text-slate-400">w·x + b</span>
                    <span>→→→</span>
                    <span className="text-[9px] text-emerald-400">←←← δ</span>
                  </div>

                  {/* Stage 2: Affine Sum Node z */}
                  <div className="bg-[#1e224f] border border-indigo-400/50 rounded-xl p-3.5 text-center w-36 shadow-lg">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold">Affine Sum (z)</span>
                    <div className="text-sm font-semibold text-slate-300 mt-0.5">z = w·x + b</div>
                    <div className="text-lg font-extrabold text-white font-mono mt-1">{z.toFixed(3)}</div>
                    <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-emerald-400 font-mono">
                      δ = ∂L/∂z = {dL_dz.toFixed(4)}
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center text-xs text-indigo-300 font-mono">
                    <span className="text-[10px] text-slate-400">σ(z)</span>
                    <span>→→→</span>
                    <span className="text-[9px] text-emerald-400">←←← ∂L/∂a</span>
                  </div>

                  {/* Stage 3: Activation Node a */}
                  <div className="bg-[#1e224f] border border-indigo-400/50 rounded-xl p-3.5 text-center w-36 shadow-lg">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold">Sigmoid Act (a)</span>
                    <div className="text-sm font-semibold text-slate-300 mt-0.5">a = σ(z)</div>
                    <div className="text-lg font-extrabold text-amber-300 font-mono mt-1">{a.toFixed(3)}</div>
                    <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-emerald-400 font-mono">
                      ∂L/∂a = {dL_da.toFixed(4)}
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center text-xs text-indigo-300 font-mono">
                    <span className="text-[10px] text-slate-400">½(y - a)²</span>
                    <span>→→→</span>
                    <span className="text-[9px] text-emerald-400">loss</span>
                  </div>

                  {/* Stage 4: Loss Node L */}
                  <div className="bg-[#2a1700] border border-amber-500/50 rounded-xl p-4 text-center w-36 shadow-lg">
                    <span className="text-[10px] text-amber-400 uppercase font-extrabold tracking-wide">
                      Loss (L)
                    </span>
                    <div className="text-xs text-amber-200 mt-0.5">Target y = {yTarget}</div>
                    <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                      {loss.toFixed(4)}
                    </div>
                    <span className="text-[9px] text-amber-300/80 block mt-1">½(y - a)²</span>
                  </div>

                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span>Forward Pass: Input to Loss</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2"></span>
                    <span>Backward Pass: Chain Rule Gradients</span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400">
                    Grad norm ‖∇w‖: {Math.abs(dL_dw).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Action Controls & Interactive Optimizer Step */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    Interactive Gradient Descent (SGD)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Click "Apply Gradient Step" to update weights: w ← w - η(∂L/∂w) with η = {learningRate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleGradientStep}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 active:scale-98"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Apply Gradient Step (SGD)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'proof' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <h3 className="font-bold text-indigo-900 text-sm">
                  Reverse-Mode Algorithmic Differentiation Breakdown
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  In deep computation graphs, evaluating derivatives from outputs back to inputs (Reverse Mode) requires computing intermediate Jacobian-vector products (adjoints/deltas) in topological order.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 font-mono">
                  <h4 className="font-bold text-slate-900 font-sans text-xs">1. Loss Adjoint</h4>
                  <p className="text-slate-600">L = ½ (y - a)²</p>
                  <p className="text-indigo-600 font-bold">∂L/∂a = -(y - a) = (a - y)</p>
                  <p className="text-[11px] text-slate-500 font-sans">Current value: {dL_da.toFixed(4)}</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 font-mono">
                  <h4 className="font-bold text-slate-900 font-sans text-xs">2. Sigmoid Local Derivative</h4>
                  <p className="text-slate-600">a = σ(z) = 1 / (1 + e⁻ᶻ)</p>
                  <p className="text-indigo-600 font-bold">∂a/∂z = a(1 - a)</p>
                  <p className="text-[11px] text-slate-500 font-sans">Current value: {da_dz.toFixed(4)}</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 font-mono">
                  <h4 className="font-bold text-slate-900 font-sans text-xs">3. Node Error (Delta)</h4>
                  <p className="text-slate-600">δ = ∂L/∂z = (∂L/∂a) · (∂a/∂z)</p>
                  <p className="text-indigo-600 font-bold">δ = (a - y) · a(1 - a)</p>
                  <p className="text-[11px] text-slate-500 font-sans">Current value: {dL_dz.toFixed(4)}</p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 font-mono">
                  <h4 className="font-bold text-slate-900 font-sans text-xs">4. Parameter Gradients</h4>
                  <p className="text-slate-600">∂L/∂w = δ · (∂z/∂w) = δ · x</p>
                  <p className="text-slate-600">∂L/∂b = δ · (∂z/∂b) = δ · 1</p>
                  <p className="text-emerald-600 font-bold">∂L/∂w = {dL_dw.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-100 px-2 py-0.5 rounded">
                  Checkpoint Concept Check
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  What causes the vanishing gradient problem in deep networks using sigmoid activations?
                </h3>

                <div className="space-y-2 pt-1 text-xs">
                  {[
                    { id: 0, text: 'The sigmoid derivative σ\'(z) = σ(1 - σ) is strictly bounded by 0.25, causing backpropagated gradients to exponentially shrink across L layers as (0.25)^L.' },
                    { id: 1, text: 'Sigmoid functions do not support floating point arithmetic on GPU tensor cores.' },
                    { id: 2, text: 'The loss function L always converges to zero before the first backprop step finishes.' },
                    { id: 3, text: 'The bias term b cancels out all weight gradients when x is negative.' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setSelectedQuizAnswer(option.id); setQuizSubmitted(false); }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedQuizAnswer === option.id
                          ? 'border-indigo-600 bg-indigo-50/80 font-medium text-indigo-950'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    disabled={selectedQuizAnswer === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    Verify Answer
                  </button>

                  {quizSubmitted && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Correct! +15 Mastery Points Earned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {completed ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Session Verified &amp; Progress Recorded!
              </span>
            ) : (
              <span>Session progress: 3 of 8 modules verified</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleFinish}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Session &amp; Recalibrate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
