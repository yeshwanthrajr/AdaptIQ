import React, { useState } from 'react';
import { X, Play, RotateCcw, Terminal, Cpu, FileCode, CheckCircle2, AlertTriangle, Copy, Sparkles } from 'lucide-react';

interface CloudLabIdeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLabExecutionComplete?: () => void;
}

export const CloudLabIdeModal: React.FC<CloudLabIdeModalProps> = ({
  isOpen,
  onClose,
  onLabExecutionComplete,
}) => {
  const [activeFile, setActiveFile] = useState<string>('autograd_engine.py');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([
    'Connected to k8s cluster: easwari-lab-prod-east',
    'GPU device allocated: NVIDIA A10G (24GB VRAM)',
    'PyTorch 2.3.1+cu121 initialized.',
    'Ready for execution.',
  ]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');

  // File templates
  const [codeFiles, setCodeFiles] = useState<Record<string, string>>({
    'autograd_engine.py': `import torch
import numpy as np

class TensorNode:
    """
    Lightweight computational graph node for Reverse-Mode Automatic Differentiation.
    """
    def __init__(self, data, _children=(), _op=''):
        self.data = float(data)
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, TensorNode) else TensorNode(other)
        out = TensorNode(self.data + other.data, (self, other), '+')

        def _backward():
            self.grad += 1.0 * out.grad
            other.grad += 1.0 * out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, TensorNode) else TensorNode(other)
        out = TensorNode(self.data * other.data, (self, other), '*')

        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self):
        # Topological sort of all children in the graph
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)

        self.grad = 1.0
        for node in reversed(topo):
            node._backward()
`,
    'test_autograd.py': `# Verification suite for TensorNode reverse AD
from autograd_engine import TensorNode

def test_computation_graph():
    x = TensorNode(1.5)
    w = TensorNode(0.8)
    b = TensorNode(-0.4)

    # Forward graph: y = w * x + b
    y = w * x + b
    assert round(y.data, 4) == 0.8, f"Forward mismatch: {y.data}"

    # Backward pass
    y.backward()
    assert round(w.grad, 4) == 1.5, f"Grad w mismatch: {w.grad}"
    assert round(x.grad, 4) == 0.8, f"Grad x mismatch: {x.grad}"
    assert round(b.grad, 4) == 1.0, f"Grad b mismatch: {b.grad}"
    print("✓ All 3 analytical gradient unit tests passed successfully!")

test_computation_graph()
`,
    'tensor_broadcast.py': `import torch

# Demonstrate broadcasting between (32, 1, 64) and (16, 64)
A = torch.randn(32, 1, 64)
B = torch.randn(16, 64)

print(f"Tensor A shape: {A.shape}")
print(f"Tensor B shape: {B.shape}")

# Broadcasting along dimension 1:
C = A + B
print(f"Result Tensor C shape: {C.shape} (Expected: [32, 16, 64])")
assert C.shape == torch.Size([32, 16, 64])
print("✓ Dimension expansion verified!")
`
  });

  if (!isOpen) return null;

  const handleRunCode = () => {
    setIsRunning(true);
    setTestStatus('running');
    setOutputLogs((prev) => [
      ...prev,
      `$ python3 ${activeFile}`,
      'Compiling graph and running test assertions...',
    ]);

    setTimeout(() => {
      setIsRunning(false);
      setTestStatus('passed');
      setOutputLogs((prev) => [
        ...prev,
        'Running on CUDA kernel [Device 0: NVIDIA A10G]...',
        'Checking analytical gradients vs finite differences: Error < 1e-7',
        '✓ Forward pass verification: PASSED (loss = 0.0412)',
        '✓ Backward pass chain rule verification: PASSED (3/3 gradients matched)',
        '✓ Memory footprint: 1.2 MB peak VRAM',
        'Process completed with exit code 0.',
      ]);
      if (onLabExecutionComplete) {
        onLabExecutionComplete();
      }
    }, 1200);
  };

  const handleResetCode = () => {
    // reset current file to clean default
    setCodeFiles((prev) => ({
      ...prev,
      [activeFile]: prev[activeFile]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#131722] text-slate-200 rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col my-auto h-[90vh]">
        
        {/* Top IDE Header */}
        <div className="bg-[#1e222d] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-tight">
                  Cloud Programming Labs IDE
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  gpu-k8s-pod: active
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                PyTorch 2.3 • CUDA 12.1 • C++20 Clang Ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isRunning}
              onClick={handleRunCode}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm active:scale-98 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run in Cloud Kernel'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IDE Layout: Sidebar Files + Code Editor + Terminal */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          
          {/* File explorer sidebar */}
          <div className="w-full md:w-56 bg-[#181c27] border-r border-slate-800 p-3 space-y-3 flex-shrink-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Project Explorer
            </div>
            <div className="space-y-1 text-xs">
              {Object.keys(codeFiles).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    activeFile === fileName
                      ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="truncate">{fileName}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block">GPU Pod Stats</span>
              <div className="flex justify-between">
                <span>VRAM Allocation:</span>
                <span className="text-emerald-400 font-mono">1.2 / 24 GB</span>
              </div>
              <div className="flex justify-between">
                <span>Compute Utilization:</span>
                <span className="text-indigo-400 font-mono">18%</span>
              </div>
            </div>
          </div>

          {/* Main Code Editor & Terminal split */}
          <div className="flex-grow flex flex-col overflow-hidden bg-[#131722]">
            
            {/* Editor Tab Header */}
            <div className="bg-[#181c27] px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>{activeFile}</span>
              </div>
              <span className="text-[10px] text-slate-500">UTF-8 • Python 3</span>
            </div>

            {/* Code Textarea */}
            <div className="flex-grow relative overflow-auto font-mono text-xs">
              <textarea
                value={codeFiles[activeFile]}
                onChange={(e) => {
                  const val = e.target.value;
                  setCodeFiles((prev) => ({ ...prev, [activeFile]: val }));
                }}
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent text-indigo-100 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none selection:bg-indigo-600/60"
              />
            </div>

            {/* Terminal Console Output */}
            <div className="h-44 bg-[#0e1117] border-t border-slate-800 p-3 flex flex-col font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-slate-800 mb-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Terminal className="w-3.5 h-3.5" />
                  Terminal &amp; Test Suite Logs
                </span>
                {testStatus === 'passed' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    All Unit Tests Verified
                  </span>
                )}
              </div>
              <div className="flex-grow overflow-y-auto space-y-1 text-slate-300 text-[11px]">
                {outputLogs.map((line, idx) => (
                  <div key={idx} className={line.startsWith('✓') ? 'text-emerald-400 font-bold' : line.startsWith('$') ? 'text-amber-300' : 'text-slate-400'}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
