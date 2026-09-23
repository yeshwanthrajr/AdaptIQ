import React, { useState } from 'react';
import { X, Send, Bot, User, Clock, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

interface MentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MentorshipModal: React.FC<MentorshipModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ai-tutor' | 'office-hours'>('ai-tutor');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Alex! I am your 24/7 AdaptIQ Engineering AI Tutor. Need help with backpropagation proofs, tensor broadcast rules, or Dr. Ramesh\'s midterm syllabus?',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickChips = [
    'How does tensor broadcasting work for (32, 1, 64) and (16, 64)?',
    'Why does the sigmoid derivative max out at 0.25?',
    'Explain the Jacobian outer product for dL/dW = delta * x^T',
    'What is the formula for the Kronecker product A ⊗ B?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || userInput;
    if (!query.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setUserInput('');

    // Generate intelligent academic tutor response
    setTimeout(() => {
      let reply = "Here is the conceptual breakdown:";
      if (query.includes('broadcasting') || query.includes('(32, 1, 64)')) {
        reply = "In PyTorch/NumPy broadcasting, trailing dimensions are aligned right-to-left. Tensor A is (32, 1, 64) and Tensor B is (16, 64). PyTorch prepends dimension 1 to B, making it (1, 16, 64). Comparing dimensions: 64 == 64 (match); 1 stretches to 16; 32 stretches to 32. The resulting shape is (32, 16, 64).";
      } else if (query.includes('sigmoid') || query.includes('0.25')) {
        reply = "For σ(z) = 1 / (1 + e⁻ᶻ), its derivative is σ'(z) = σ(z)(1 - σ(z)). Since 0 ≤ σ(z) ≤ 1, this quadratic function achieves its maximum when σ(z) = 0.5 (at z = 0), which gives 0.5 * 0.5 = 0.25. When chained over L layers in deep networks, gradients scale as (0.25)ᴸ, causing vanishing gradients.";
      } else if (query.includes('Jacobian') || query.includes('dL/dW')) {
        reply = "Given z = Wx + b and scalar loss L, let δ = ∂L/∂z be a column vector [m x 1]. The input x is [n x 1]. Since z_i = ∑_j W_ij x_j, ∂z_i/∂W_ij = x_j. Thus ∂L/∂W_ij = δ_i · x_j. In matrix notation, this corresponds exactly to the outer product δ · xᵀ.";
      } else if (query.includes('Kronecker')) {
        reply = "The Kronecker product A ⊗ B of an m×n matrix A and p×q matrix B is the block matrix formed by multiplying each scalar a_ij by the entire matrix B. Its dimension is (mp) × (nq). It satisfies vec(AXB) = (Bᵀ ⊗ A)vec(X).";
      } else {
        reply = `Regarding your query "${query}": The key intuition is to trace the computational graph in topological order. Let me know if you would like me to generate a code snippet or mathematical proof for this!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto h-[88vh]">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 font-bold text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded">
                Academic Mentorship &amp; Support
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Faculty Office Hours &amp; 24/7 AI Engineering Tutor
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
            onClick={() => setActiveTab('ai-tutor')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'ai-tutor' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            24/7 AI Engineering Tutor
          </button>
          <button
            onClick={() => setActiveTab('office-hours')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'office-hours' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Faculty Office Hours (Dr. K. Ramesh)
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-grow flex flex-col overflow-hidden p-5">
          {activeTab === 'ai-tutor' ? (
            <div className="flex-grow flex flex-col justify-between overflow-hidden">
              
              {/* Message scroll container */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-2 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        AC
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Prompt Chips */}
              <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-100 mt-2">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors text-left truncate max-w-xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask any question about neural networks, matrix calculus, or code labs..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-grow p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Office Hours tab */
            <div className="space-y-5 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  KR
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dr. K. Ramesh</h3>
                  <p className="text-slate-500">Professor &amp; Head, Dept of CSE • Easwari Engineering College</p>
                  <p className="text-emerald-600 font-semibold mt-0.5">Online Queue: Instant • Cabin: CSE-304</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Available 1-on-1 Consultation Slots:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Today, 03:30 PM - 04:00 PM (In-Person Cabin)',
                    'Today, 04:30 PM - 05:00 PM (Google Meet Virtual)',
                    'Tomorrow, 09:00 AM - 09:30 AM (Pre-Midterm Review)',
                    'Tomorrow, 02:00 PM - 02:30 PM (Lab Project Consult)',
                  ].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setBookedSlot(slot)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        bookedSlot === slot
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-950'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-indigo-600 mb-1" />
                      <div>{slot}</div>
                    </button>
                  ))}
                </div>
              </div>

              {bookedSlot && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Consultation confirmed for {bookedSlot}. Confirmation sent to alex.chen@easwari.edu.</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
