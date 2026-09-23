import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Cpu, Sparkles, Layers, Sliders } from 'lucide-react';

interface ToolsSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'loss-surface' | 'broadcast-inspector' | 'ast-visualizer';
}

export const ToolsSuiteModal: React.FC<ToolsSuiteModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'loss-surface',
}) => {
  const [activeTab, setActiveTab] = useState<'loss-surface' | 'broadcast-inspector' | 'ast-visualizer'>(initialTab);

  // Loss Surface Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lr, setLr] = useState<number>(0.05);
  const [optimizer, setOptimizer] = useState<'sgd' | 'momentum' | 'adam'>('momentum');
  const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([{ x: -1.8, y: 1.5 }]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Tensor Broadcast Tool State
  const [shapeAStr, setShapeAStr] = useState<string>('32, 1, 64');
  const [shapeBStr, setShapeBStr] = useState<string>('16, 64');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Canvas Loss Surface Renderer (Himmelblau or Beale loss landscape)
  useEffect(() => {
    if (activeTab !== 'loss-surface' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw background contour grid
    ctx.clearRect(0, 0, width, height);

    // Coordinate mapping: [-2.5, 2.5] -> [0, width]
    const toScreen = (gx: number, gy: number) => ({
      sx: ((gx + 2.5) / 5) * width,
      sy: ((2.5 - gy) / 5) * height,
    });

    // Draw concentric loss contours: L(x, y) = x^2 + 2*y^2 + 0.5*sin(3x)
    for (let r = 0.5; r <= 4.0; r += 0.5) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 + (4 - r) * 0.05})`;
      ctx.lineWidth = 1.5;
      for (let theta = 0; theta <= 2 * Math.PI; theta += 0.1) {
        const gx = r * Math.cos(theta);
        const gy = (r / 1.4) * Math.sin(theta);
        const { sx, sy } = toScreen(gx, gy);
        if (theta === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Draw center minimum
    const { sx: minX, sy: minY } = toScreen(0, 0);
    ctx.beginPath();
    ctx.fillStyle = '#10b981';
    ctx.arc(minX, minY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw optimization path
    if (trajectory.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      trajectory.forEach((pt, i) => {
        const { sx, sy } = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
    }

    // Draw current ball position
    const currentPt = trajectory[trajectory.length - 1];
    const { sx: curX, sy: curY } = toScreen(currentPt.x, currentPt.y);
    ctx.beginPath();
    ctx.fillStyle = '#f59e0b';
    ctx.arc(curX, curY, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [activeTab, trajectory]);

  // Simulation step
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTrajectory((prev) => {
        const last = prev[prev.length - 1];
        if (Math.hypot(last.x, last.y) < 0.05) {
          setIsSimulating(false);
          return prev;
        }

        // Analytical gradient for L(x, y) = x^2 + 2y^2
        const gradX = 2 * last.x;
        const gradY = 4 * last.y;

        let nextX = last.x;
        let nextY = last.y;

        if (optimizer === 'sgd') {
          nextX = last.x - lr * gradX;
          nextY = last.y - lr * gradY;
        } else if (optimizer === 'momentum') {
          const prevVelocityX = prev.length > 1 ? last.x - prev[prev.length - 2].x : 0;
          const prevVelocityY = prev.length > 1 ? last.y - prev[prev.length - 2].y : 0;
          nextX = last.x + 0.8 * prevVelocityX - lr * gradX;
          nextY = last.y + 0.8 * prevVelocityY - lr * gradY;
        } else {
          // Adam normalized step
          nextX = last.x - lr * (gradX / (Math.abs(gradX) + 1e-4));
          nextY = last.y - lr * (gradY / (Math.abs(gradY) + 1e-4));
        }

        return [...prev, { x: nextX, y: nextY }];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulating, lr, optimizer]);

  if (!isOpen) return null;

  // Tensor Broadcast Calculation
  const parseDims = (str: string) => str.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
  const dimsA = parseDims(shapeAStr);
  const dimsB = parseDims(shapeBStr);

  const checkBroadcast = () => {
    const rA = [...dimsA].reverse();
    const rB = [...dimsB].reverse();
    const maxLen = Math.max(rA.length, rB.length);
    const resultDims: number[] = [];
    let compatible = true;

    for (let i = 0; i < maxLen; i++) {
      const d1 = rA[i] !== undefined ? rA[i] : 1;
      const d2 = rB[i] !== undefined ? rB[i] : 1;

      if (d1 === d2) {
        resultDims.push(d1);
      } else if (d1 === 1) {
        resultDims.push(d2);
      } else if (d2 === 1) {
        resultDims.push(d1);
      } else {
        compatible = false;
        break;
      }
    }

    return {
      compatible,
      outputShape: compatible ? resultDims.reverse() : null,
    };
  };

  const broadcastInfo = checkBroadcast();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                Compiler &amp; Neural Hardware Toolset
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Tools &amp; Sandboxes Suite
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
            onClick={() => setActiveTab('loss-surface')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'loss-surface' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Interactive Loss Surface Explorer
          </button>
          <button
            onClick={() => setActiveTab('broadcast-inspector')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'broadcast-inspector' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tensor Broadcast Rules Inspector
          </button>
          <button
            onClick={() => setActiveTab('ast-visualizer')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'ast-visualizer' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Compiler SSA &amp; AST Visualizer
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-grow space-y-5">
          {activeTab === 'loss-surface' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                
                {/* Visualizer Canvas */}
                <div className="bg-[#15173c] p-4 rounded-xl border border-indigo-500/30 flex flex-col items-center flex-grow">
                  <div className="flex justify-between w-full text-xs text-slate-300 mb-2">
                    <span className="font-bold">Loss Contour L(w₁, w₂)</span>
                    <span className="text-emerald-400 font-mono">Global Min (0, 0)</span>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={280}
                    className="rounded-lg bg-[#0e111a] border border-indigo-900/50"
                  />
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Minima
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Optimizer Trajectory
                    </span>
                  </div>
                </div>

                {/* Optimizer Controls */}
                <div className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Optimizer Algorithm</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['sgd', 'momentum', 'adam'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setOptimizer(opt)}
                          className={`py-1.5 rounded uppercase font-bold text-[10px] transition-all ${
                            optimizer === opt
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Learning Rate (η):</span>
                      <span className="font-mono text-indigo-600">{lr}</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.2"
                      step="0.01"
                      value={lr}
                      onChange={(e) => setLr(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setIsSimulating(!isSimulating)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSimulating ? 'Pause Optimization' : 'Start Descent'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsSimulating(false);
                        setTrajectory([{ x: -1.8, y: 1.5 }]);
                      }}
                      className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Position</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'broadcast-inspector' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold">PyTorch Broadcast Standard: </span>
                When operating on two tensors, NumPy/PyTorch compares their shapes element-wise, starting with the trailing (rightmost) dimensions. Two dimensions are compatible if: (1) they are equal, or (2) one of them is 1.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="font-bold text-slate-800">Tensor A Shape (comma-separated):</label>
                  <input
                    type="text"
                    value={shapeAStr}
                    onChange={(e) => setShapeAStr(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 32, 1, 64 (Batch of 32 vectors)</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="font-bold text-slate-800">Tensor B Shape (comma-separated):</label>
                  <input
                    type="text"
                    value={shapeBStr}
                    onChange={(e) => setShapeBStr(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 16, 64</span>
                </div>
              </div>

              {/* Compatibility Result */}
              <div className="p-4 bg-[#15173c] text-white rounded-xl border border-indigo-500/20 space-y-2 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">Broadcasting Verification:</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    broadcastInfo.compatible ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {broadcastInfo.compatible ? '✓ COMPATIBLE' : '✗ DIMENSION MISMATCH'}
                  </span>
                </div>
                {broadcastInfo.compatible ? (
                  <div className="text-sm font-bold text-white pt-1">
                    Output Shape: ({broadcastInfo.outputShape?.join(', ')})
                  </div>
                ) : (
                  <div className="text-xs text-rose-300 pt-1">
                    RuntimeError: The size of tensor A must match the size of tensor B at non-singleton dimensions.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ast-visualizer' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900 text-indigo-200 rounded-xl font-mono text-[11px] leading-relaxed">
                <span className="text-amber-400 font-bold block mb-2">// Abstract Syntax Tree (AST) &amp; SSA Register Graph</span>
                {`Function: optimize_gradient(x_0, w_0, b_0):
  %1 = mul float %w_0, %x_0
  %2 = add float %1, %b_0
  %3 = call float @llvm.sigmoid(float %2)
  %4 = sub float %3, %y_target
  %5 = mul float %4, %4
  %loss = mul float 0.5, %5
  ret float %loss`}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#15173c] hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            Done &amp; Close Suite
          </button>
        </div>

      </div>
    </div>
  );
};
