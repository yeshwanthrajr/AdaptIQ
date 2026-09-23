import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FacultyNote, AIPersonalizedNotes } from '../types';
import { 
  Briefcase, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Layers, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Send, 
  BookOpen, 
  Users, 
  Lightbulb, 
  Target, 
  HelpCircle,
  Eye,
  PlusCircle,
  FileCheck,
  RefreshCw,
  GraduationCap
} from 'lucide-react';

export const FacultyPortalView: React.FC<{ 
  onSwitchToStudent?: () => void;
  onOpenPracticeTest?: (note: FacultyNote) => void;
}> = ({
  onSwitchToStudent,
  onOpenPracticeTest,
}) => {
  const { 
    studentProfile, 
    facultyNotes, 
    uploadFacultyNote, 
    personalizeNoteWithAi,
    createAnnouncement,
    allUsers,
    loginAsDemoUser
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'upload' | 'decomposed' | 'students' | 'announcements'>('upload');
  
  // Note Upload Form
  const [subject, setSubject] = useState('CS8601 Deep Learning & Neural Computation');
  const [unit, setUnit] = useState('Unit 2');
  const [unitName, setUnitName] = useState('Backpropagation & Computational Graphs');
  const [noteTitle, setNoteTitle] = useState('Multivariate Backpropagation Mechanics & Automatic Differentiation');
  const [notesContent, setNotesContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [selectedNoteForInspection, setSelectedNoteForInspection] = useState<FacultyNote>(facultyNotes[0] || null);

  // Faculty Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Sample notes loader for quick testing
  const loadSampleNotes = (unitNum: string) => {
    if (unitNum === 'Unit 2') {
      setUnit('Unit 2');
      setUnitName('Backpropagation & Computational Graphs');
      setNoteTitle('Multivariate Backpropagation & Vector Jacobian Products');
      setSelectedFileName('Unit2_Backpropagation_Mechanics_Lectures.pdf');
      setNotesContent(`LMS LECTURE NOTES - UNIT II: NEURAL BACKPROPAGATION & TOPOLOGICAL AD
1. COMPUTATION GRAPH TOPOLOGY:
A neural layer consists of affine transformation z = Wx + b followed by non-linear elementwise activation a = f(z).
In a computation graph G = (V, E), nodes V represent tensor states and directed edges E represent mathematical operations.
Forward evaluation traverses G in topological order. Reverse automatic differentiation (reverse AD) traverses G in reverse topological order.

2. MULTIVARIATE CHAIN RULE DERIVATION:
Let L be a scalar objective (Loss). For node v_i with child nodes Parent(v_i), the total derivative is:
dL/dv_i = sum_{j in Parent(v_i)} (dL/dv_j) * (dv_j / dv_i)
In matrix form for weight matrix W in R^{M x N}, with incoming adjoint delta = dL/dz in R^M and input x in R^N:
dL/dW = delta * x^T
dL/db = delta
dL/dx = W^T * delta

3. NUMERICAL PITFALLS:
- Exploding Gradients: When spectral norm of weight matrices ||W||_2 > 1, gradient norms scale as ||W||^L, leading to NaN loss. Solution: Gradient norm clipping ||g||_2 <= threshold.
- Vanishing Gradients: With sigmoid or tanh activations, derivative saturates near 0 (|z| > 4), preventing weight updates in early layers. Solution: ReLU / LeakyReLU activations, He Kaiming initialization.
- Softmax Overflow: Compute exp(z_i - max(z)) / sum(exp(z_j - max(z))) to prevent float32 inf representation.`);
    } else if (unitNum === 'Unit 4') {
      setUnit('Unit 4');
      setUnitName('Convolutional Architectures & Spatial Invariance');
      setNoteTitle('Convolutional Filters, Receptive Fields & Residual Connections');
      setSelectedFileName('Unit4_CNN_Residual_Networks.pdf');
      setNotesContent(`LMS LECTURE NOTES - UNIT IV: CONVOLUTIONAL OPERATORS & DEEP RESNETS
1. 2D CONVOLUTION MECHANICS:
Given input tensor X in R^{C_in x H x W} and kernel K in R^{C_out x C_in x k x k}:
Output spatial dimension is H_out = floor((H - k + 2*p) / s) + 1.
Parameter sharing enforces translational equivariance: f(g(x)) = g(f(x)).

2. RECEPTIVE FIELD CALCULATION:
The effective receptive field grows linearly with depth:
RF_{l} = RF_{l-1} + (k_l - 1) * S_{l-1}, where S is cumulative stride.
Dilated (atrous) convolutions expand RF exponentially without increasing parameter count.

3. RESIDUAL BOTTLENECK DYNAMICS:
He et al. ResNet formulates identity mapping: y = F(x, {W_i}) + x.
In backpropagation, gradient dL/dx = dL/dy * (dF/dx + I).
The identity operator I guarantees uninterrupted gradient highway back to early layers, eliminating vanishing gradients.`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setNoteTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      // Read text content
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setNotesContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadAndPersonalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesContent.trim()) {
      alert('Please enter or upload lecture notes content.');
      return;
    }

    setIsProcessingAi(true);

    try {
      // 1. Upload note
      const uploaded = await uploadFacultyNote({
        title: noteTitle.trim(),
        subject,
        unit,
        unitName,
        facultyName: studentProfile.name || 'Dr. K. Ramesh',
        facultyEmail: studentProfile.email || 'prof.ramesh@easwari.edu',
        fileName: selectedFileName || `${unit.replace(/\s+/g, '_')}_Lecture_Notes.txt`,
        rawContent: notesContent,
      });

      // 2. Trigger AI Personalization
      const aiResult = await personalizeNoteWithAi(uploaded.id);

      const updatedNote: FacultyNote = {
        ...uploaded,
        isAiPersonalized: true,
        aiData: aiResult,
      };

      setSelectedNoteForInspection(updatedNote);
      setActiveTab('decomposed');
    } catch (err: any) {
      console.error('Error uploading/personalizing:', err);
      alert('AI Personalization failed: ' + err.message);
    } finally {
      setIsProcessingAi(false);
    }
  };

  const handlePostFacultyAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    await createAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      authorName: studentProfile.name || 'Dr. K. Ramesh (Faculty)',
      authorRole: 'faculty',
      targetRole: 'student',
      isUrgent: false,
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header Banner */}
      <div className="bg-[#0f241d] text-white rounded-2xl p-6 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-extrabold shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  Faculty Curriculum &amp; AI Engine
                </span>
                <span className="text-xs text-emerald-200/80 font-medium">• Department of CSE</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Courseware Decomposition &amp; Adaptive Assessment Hub
              </h1>
              <p className="text-xs text-emerald-200 mt-0.5">
                Instructor: <strong>{studentProfile.name}</strong> ({studentProfile.designation || 'Associate Professor'}) • Easwari Engineering College
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-emerald-500/30">
            <span className="text-[11px] text-slate-400 px-2 font-medium hidden lg:inline">Switch Persona:</span>
            <button
              onClick={() => loginAsDemoUser('student')}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
            <button
              onClick={() => loginAsDemoUser('admin')}
              className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Admin View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-emerald-600" />
          <span>Upload Course Notes &amp; Synthesize</span>
        </button>

        <button
          onClick={() => setActiveTab('decomposed')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'decomposed'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <span>AI Decomposed Notes &amp; Mental Models</span>
          <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-black">
            {facultyNotes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-slate-600" />
          <span>Student Cohort Performance</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4 text-amber-600" />
          <span>Post Class Announcements</span>
        </button>
      </div>

      {/* TAB 1: UPLOAD & TRIGGER AI PERSONALIZATION */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Upload Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Lecture Material for AI Personalization</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When you upload lecture notes or slide transcripts, the AI decomposes the material: it categorizes concepts by exam priority, generates mental models &amp; ASCII computation flows, adjusts recommendations for struggling vs advanced students, and formulates practice tests.
              </p>
            </div>

            {/* Quick Demo Pre-load buttons */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="text-xs font-bold text-emerald-900">
                  Pre-load Academic Lecture Notes for Instant AI Synthesis:
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadSampleNotes('Unit 2')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 transition-colors shadow-2xs"
                >
                  Unit 2 (Backpropagation)
                </button>
                <button
                  type="button"
                  onClick={() => loadSampleNotes('Unit 4')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 transition-colors shadow-2xs"
                >
                  Unit 4 (CNNs &amp; ResNets)
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadAndPersonalize} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Number</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    <option value="Unit 1">Unit 1 - Optimization</option>
                    <option value="Unit 2">Unit 2 - Backpropagation</option>
                    <option value="Unit 3">Unit 3 - Loss Surfaces</option>
                    <option value="Unit 4">Unit 4 - CNNs &amp; ResNets</option>
                    <option value="Unit 5">Unit 5 - Transformers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Name</label>
                  <input
                    type="text"
                    required
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="e.g. Backpropagation & Computational Graphs"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Document Title</label>
                  <input
                    type="text"
                    required
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Vector Jacobian Products & Tensor Contractions"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* File Attachment Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Notes File (.pdf, .txt, .docx, .md)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center transition-colors bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-700">
                    {selectedFileName ? (
                      <span className="text-emerald-700 font-extrabold flex items-center justify-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Attached: {selectedFileName}</span>
                      </span>
                    ) : (
                      <span>Drag &amp; drop document, or click to browse</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts University Lecture Notes, Syllabus Sheets, or Slide Transcripts
                  </p>
                  <label className="mt-3 inline-block cursor-pointer px-4 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs">
                    Choose Local File
                    <input
                      type="file"
                      accept=".txt,.pdf,.docx,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Raw Text Notes Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lecture Notes Content / Formulae
                </label>
                <textarea
                  required
                  rows={8}
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Paste lecture text, derivations, code fragments, or formula sheet here..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingAi}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                {isProcessingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>AI Engine Decomposing &amp; Personalizing Notes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Upload &amp; Trigger AI Cognitive Personalization</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar: How AI Personalizes Courseware */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>AI Personalization Pipeline</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                How our adaptive neural engine translates raw faculty notes for students:
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>1. Unit-Wise Priority Calibration</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Identifies critical exam weighting, formulas, and required Bloom cognitive levels (L2 to L4).
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Multi-Format Picturization</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Generates ASCII computation graph blueprints, step-by-step math breakdowns, and real-world industrial analogies.
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Adaptive Cognitive Adjustments</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Generates customized scaffolds for struggling learners and GPU-accelerated stretch challenges for advanced students.
                </p>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1">
                <div className="font-bold text-purple-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>4. Automated Practice Assessments</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Formulates rigorous engineering practice questions with step-by-step solution keys and Bloom taxonomy ratings.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium">
                Integrated with Gemini AI Curriculum Synthesis via server-side proxy
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AI DECOMPOSED NOTES & PICTURIZED MENTAL MODELS */}
      {activeTab === 'decomposed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Note Selector Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Personalized Courseware ({facultyNotes.length})</h3>
            <p className="text-xs text-slate-500">Select a course module to review AI decomposition:</p>

            <div className="space-y-2">
              {facultyNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteForInspection(note)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedNoteForInspection?.id === note.id
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800 uppercase mb-1">
                    <span>{note.unit}</span>
                    <span className="text-slate-400">{note.uploadDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{note.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{note.unitName}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {note.isAiPersonalized ? 'AI Synthesized' : 'Raw Notes'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Decomposed Note Display */}
          <div className="lg:col-span-2 space-y-5">
            {selectedNoteForInspection?.aiData ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                
                {/* Header */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full">
                      {selectedNoteForInspection.unit} • AI Cognitive Synthesis
                    </span>
                    <button
                      onClick={() => onOpenPracticeTest?.(selectedNoteForInspection)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Take Practice Assessment</span>
                    </button>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedNoteForInspection.title}</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {selectedNoteForInspection.aiData.summary}
                  </p>
                </div>

                {/* 1. Unit-Wise Priority Concepts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-rose-600" />
                    <span>1. Unit-Wise Priority Hierarchy &amp; Exam Weight</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedNoteForInspection.aiData.priorityConcepts.map((concept, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
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

                {/* 2. Visual Mental Models & Picturization */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    <span>2. Concept Picturization &amp; Computation Graph Flows</span>
                  </h4>

                  {selectedNoteForInspection.aiData.visualMentalModels.map((model, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900">{model.concept}</h5>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {model.visualType}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-indigo-950 italic">
                        "{model.headline}"
                      </p>

                      {/* Visual Flow / ASCII diagram */}
                      <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                        <pre>{model.representation}</pre>
                      </div>

                      {/* Real-World Analogy & Common Pitfall */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] font-extrabold text-amber-700 uppercase block mb-0.5">
                            💡 Real-World Industrial Analogy
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

                {/* 3. Adaptive Adjustments */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Adaptive Recommendations by Mastery Level</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        For Foundational Learners
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {selectedNoteForInspection.aiData.adaptiveAdjustments.forStrugglingStudents}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        For Advanced Scholars
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {selectedNoteForInspection.aiData.adaptiveAdjustments.forAdvancedStudents}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        University Exam Tip
                      </span>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {selectedNoteForInspection.aiData.adaptiveAdjustments.examTip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Practice Assessment Questions Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>3. Generated Practice Assessment ({selectedNoteForInspection.aiData.practiceAssessment.length} Questions)</span>
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {selectedNoteForInspection.aiData.practiceAssessment.map((q, qIndex) => (
                      <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900">Question {qIndex + 1}</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                            {q.bloomLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">{q.question}</p>

                        <div className="space-y-1 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                                optIdx === q.correctAnswer
                                  ? 'bg-emerald-50 border border-emerald-300 font-semibold text-emerald-900'
                                  : 'bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                              {optIdx === q.correctAnswer && (
                                <span className="ml-auto text-[10px] font-bold text-emerald-700">✓ Correct Key</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 leading-snug">
                          <strong>Solution Rationale:</strong> {q.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Select a note from the left to view the AI Decomposed Mental Models.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: STUDENT COHORT PERFORMANCE */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Enrolled Student Performance on Courseware</h3>
            <p className="text-xs text-slate-500">
              Real-time analytics on student assessment scores, cognitive pacing, and adaptive learning adjustments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Class Mastery Average</span>
              <h4 className="text-2xl font-black text-emerald-900 mt-1">84.2%</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Top 5% statewide for Anna University DL curriculum</p>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Unit 2 Completion Rate</span>
              <h4 className="text-2xl font-black text-indigo-900 mt-1">91%</h4>
              <p className="text-[11px] text-indigo-700 mt-0.5">Vector Jacobian Products &amp; Backpropagation</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Active Practice Tests</span>
              <h4 className="text-2xl font-black text-amber-900 mt-1">2 Tests Active</h4>
              <p className="text-[11px] text-amber-700 mt-0.5">Adaptive Bloom L3-L4 questions live</p>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Register Number</th>
                  <th className="py-3 px-3">Mastery Index</th>
                  <th className="py-3 px-3">Preferred Modality</th>
                  <th className="py-3 px-3">Bloom Tier</th>
                  <th className="py-3 px-3 text-right">Practice Test Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allUsers
                  .filter((u) => u.role === 'student' && u.status === 'active')
                  .map((student) => (
                    <tr key={student.uid || student.email} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500">{student.email}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {student.rollOrEmpNumber || '310621104089'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${student.masteryIndex}%` }} />
                          </div>
                          <span className="font-bold text-slate-900">{student.masteryIndex}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{student.primaryStyle}</td>
                      <td className="py-3 px-3 font-semibold text-indigo-700">{student.bloomTier}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          Completed Unit 2 Test
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: POST CLASS ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Post Course Announcement to Students</h3>
            <p className="text-xs text-slate-500">
              Send notifications regarding lecture materials, lab schedules, or practice test availability.
            </p>
          </div>

          {annSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Announcement published to students' portal!</span>
            </div>
          )}

          <form onSubmit={handlePostFacultyAnnouncement} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g., Unit II Practice Test & Vector Jacobian Notes Live"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
              <textarea
                required
                rows={5}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Write message to students..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement to Class</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
