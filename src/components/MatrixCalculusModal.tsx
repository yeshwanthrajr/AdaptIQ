import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, Calculator, BookOpen, Layers } from 'lucide-react';

interface MatrixCalculusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatrixCalculusModal: React.FC<MatrixCalculusModalProps> = ({
  isOpen,
  onClose,
}) => {
  // 2x2 Matrix A
  const [a00, setA00] = useState<number>(1);
  const [a01, setA01] = useState<number>(2);
  const [a10, setA10] = useState<number>(0);
  const [a11, setA11] = useState<number>(1);

  // 2x2 Matrix B
  const [b00, setB00] = useState<number>(3);
  const [b01, setB01] = useState<number>(1);
  const [b10, setB10] = useState<number>(2);
  const [b11, setB11] = useState<number>(4);

  const [activeTab, setActiveTab] = useState<'kronecker' | 'theorems'>('kronecker');

  if (!isOpen) return null;

  // Kronecker product 4x4 matrix = A ⊗ B
  const kron = [
    [a00 * b00, a00 * b01, a01 * b00, a01 * b01],
    [a00 * b10, a00 * b11, a01 * b10, a01 * b11],
    [a10 * b00, a10 * b01, a11 * b00, a11 * b01],
    [a10 * b10, a10 * b11, a11 * b10, a11 * b11],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                Recommended Micro-Module • 8 min
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Matrix Calculus &amp; Kronecker Products
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

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kronecker')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'kronecker' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Interactive Kronecker Product (A ⊗ B)
          </button>
          <button
            onClick={() => setActiveTab('theorems')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'theorems' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Essential Tensor &amp; Trace Theorems
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-grow space-y-6">
          {activeTab === 'kronecker' ? (
            <div className="space-y-6">
              
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Why this matters: </span>
                Kronecker products (A ⊗ B) arise when computing the Jacobian of matrix multiplications and vectorized backpropagation in deep neural networks: <code className="bg-amber-100 px-1 rounded font-bold">vec(A X B) = (Bᵀ ⊗ A) vec(X)</code>.
              </div>

              {/* Inputs for Matrix A and Matrix B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Matrix A */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Matrix A (2×2)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={a00}
                      onChange={(e) => setA00(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={a01}
                      onChange={(e) => setA01(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={a10}
                      onChange={(e) => setA10(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={a11}
                      onChange={(e) => setA11(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>

                {/* Matrix B */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Matrix B (2×2)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={b00}
                      onChange={(e) => setB00(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={b01}
                      onChange={(e) => setB01(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={b10}
                      onChange={(e) => setB10(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={b11}
                      onChange={(e) => setB11(parseFloat(e.target.value) || 0)}
                      className="text-center font-mono font-bold text-xs p-2 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>

              </div>

              {/* Output Kronecker Product 4x4 */}
              <div className="p-4 bg-[#15173c] text-white rounded-xl border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-amber-400">
                    Resulting Kronecker Matrix: A ⊗ B (4×4)
                  </span>
                  <span className="text-[11px] font-mono text-indigo-300">
                    Dimensions: (2·2) × (2·2) = 4×4
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center py-2 max-w-md mx-auto">
                  {kron.map((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className="p-2.5 rounded bg-[#1e224f] border border-indigo-400/20 font-bold text-white shadow-2xs"
                      >
                        {val}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* Theorems */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-indigo-900">Linear Trace Rule</h4>
                  <div className="p-2 bg-slate-900 text-amber-300 rounded font-mono text-[11px]">
                    ∇_X Tr(A X B) = Aᵀ Bᵀ
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Used when differentiating linear fully-connected layers with respect to weight tensor X.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-indigo-900">Quadratic Form Trace</h4>
                  <div className="p-2 bg-slate-900 text-amber-300 rounded font-mono text-[11px]">
                    ∇_X Tr(Xᵀ A X) = (A + Aᵀ) X
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Reduces to 2AX whenever A is symmetric (e.g., covariance or Hessian matrices).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-indigo-900">Vectorization Identity</h4>
                  <div className="p-2 bg-slate-900 text-amber-300 rounded font-mono text-[11px]">
                    vec(A X B) = (Bᵀ ⊗ A) vec(X)
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Converts matrix transformations into standard matrix-vector operations.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-indigo-900">Log-Determinant Rule</h4>
                  <div className="p-2 bg-slate-900 text-amber-300 rounded font-mono text-[11px]">
                    ∇_X ln det(X) = X⁻ᵀ
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Vital for maximum likelihood training in Gaussian processes and normalizing flows.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Micro-module completed. Hesitation flag resolved!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            Mark Complete &amp; Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
