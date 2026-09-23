import { StudentProfile, CurriculumModule, InsightItem, RecommendedResource, DiagnosticQuestion, CourseItem, TestItem } from '../types';

export const initialStudentProfile: StudentProfile = {
  name: 'Yashwanth Raj',
  email: 'student@easwari.edu',
  mobile: '+91 98403 45678',
  role: 'student',
  status: 'active',
  institution: 'Easwari Engineering College',
  department: 'Computer Science and Engineering',
  semester: 'Semester 6',
  designation: 'Undergraduate Scholar',
  rollOrEmpNumber: '310621104089',
  otpVerified: true,
  emailVerified: true,
  masteryIndex: 84,
  masteryDelta: 6,
  paceFactor: 2.6,
  paceDescription: 'Optimal load calibration sustained',
  primaryStyle: 'Interactive Labs',
  primaryStyleStat: '68% of sessions (Cloud IDE)',
  bloomTier: 'L4 • Synthesis',
  bloomTierNote: 'Top 4% of engineering cohort',
  lastRecalibrated: '12m ago',
};

export const curriculumModules: CurriculumModule[] = [
  {
    id: 'module-1',
    title: 'Gradient descent and loss landscapes',
    subtitle: 'Stochastic gradients, momentum vectors, and convex optimization criteria',
    status: 'mastered',
    masteryScore: 96,
    description: 'Stochastic gradient descent (SGD), momentum algorithms, AdaGrad, RMSProp, and Adam dynamics across ill-conditioned Hessian surfaces.',
    buttonLabel: 'Review mastery',
    actionKey: 'loss-explorer',
  },
  {
    id: 'module-2',
    title: 'Backpropagation mechanics and computation graphs',
    subtitle: 'Reverse-mode algorithmic differentiation, Jacobian chain rules, and tensor gradient memory layouts. Difficulty raised after a fast quiz turnaround.',
    status: 'current',
    level: 4,
    duration: 'about 24 min left',
    unitLabel: 'Unit 3 of 8',
    description: 'Reverse-mode algorithmic differentiation, Jacobian chain rules, and tensor gradient memory layouts. Difficulty raised after a fast quiz turnaround.',
    buttonLabel: 'Continue session →',
    actionKey: 'backprop-session',
  },
  {
    id: 'module-3',
    title: 'Matrix calculus refresher',
    subtitle: 'An 8-minute micro-module to clear up logged hesitation on Kronecker products and transpose gradients.',
    status: 'recommended',
    duration: '8 min',
    description: 'An 8-minute micro-module to clear up logged hesitation on Kronecker products and transpose gradients.',
    buttonLabel: 'Open module • 8 min',
    actionKey: 'matrix-calculus',
  },
  {
    id: 'module-4',
    title: 'Convolutional neural networks and feature maps',
    subtitle: 'Unlocks once the backpropagation module & cloud lab kernel are verified complete',
    status: 'locked',
    description: 'Receptive fields, dilated convolutions, strided cross-correlations, and channel pooling dynamics.',
  },
];

export const initialInsights: InsightItem[] = [
  {
    id: 'insight-1',
    title: 'Vanishing gradient concept',
    description: 'Hesitation logged on sigmoid non-linearity derivation',
    severity: 'warning',
    actionPrompt: 'Launch AutoDiff Derivation',
    recommendedAction: 'backprop-session',
  },
  {
    id: 'insight-2',
    title: 'Tensor broadcast rules',
    description: 'Dimension mismatch failure on 4D batch tensors in Lab 2',
    severity: 'warning',
    actionPrompt: 'Open Tensor Inspector',
    recommendedAction: 'tools-suite',
  },
];

export const recommendedResources: RecommendedResource[] = [
  {
    id: 'res-1',
    title: 'Interactive loss surface explorer',
    meta: '15 min • WebGL sandbox',
    type: 'sandbox',
    iconSymbol: '✦',
    actionKey: 'loss-explorer',
  },
  {
    id: 'res-2',
    title: 'Vectorized backprop breakdown',
    meta: '11 min • Visual lecture',
    type: 'video',
    iconSymbol: '▶',
    actionKey: 'backprop-video',
  },
  {
    id: 'res-3',
    title: 'PyTorch autograd from scratch',
    meta: 'Hands-on Jupyter notebook',
    type: 'notebook',
    iconSymbol: '≡',
    actionKey: 'cloud-lab',
  },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    topic: 'Computational Graphs & Reverse AD',
    difficulty: 'L3 Apply',
    question: 'Consider intermediate node z = Wx + b followed by activation a = σ(z). If the loss is L, what is the exact gradient ∂L/∂W represented as an outer product?',
    formula: 'z = Wx + b, \\quad a = \\sigma(z), \\quad \\delta = \\frac{\\partial L}{\\partial z}',
    options: [
      {
        label: 'A',
        text: '∂L/∂W = δ · xᵀ  (where δ is the upstream error vector and x is input)',
        correct: true,
        explanation: 'By the vector-matrix chain rule, ∂L/∂W_ij = (∂L/∂z_i) * (∂z_i/∂W_ij) = δ_i * x_j, which in matrix form is the outer product δxᵀ.'
      },
      {
        label: 'B',
        text: '∂L/∂W = Wᵀ · δ',
        correct: false,
        explanation: 'Wᵀδ represents ∂L/∂x, the gradient propagated backward to the preceding layer, not with respect to the weights W.'
      },
      {
        label: 'C',
        text: '∂L/∂W = x · δᵀ',
        correct: false,
        explanation: 'This transposes the dimensions incorrectly, producing an incompatible shape for the weight matrix W.'
      },
      {
        label: 'D',
        text: '∂L/∂W = δ ⊙ x  (Hadamard elementwise product)',
        correct: false,
        explanation: 'Weight matrices have dimensions [dim_out, dim_in], whereas an elementwise product requires identical vector shapes.'
      },
    ]
  },
  {
    id: 2,
    topic: 'Vanishing Gradients in Sigmoid Activation',
    difficulty: 'L2 Understand',
    question: 'For the standard logistic sigmoid activation σ(z) = 1 / (1 + e⁻ᶻ), what is the maximum achievable value of its derivative σ\'(z)?',
    formula: '\\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))',
    options: [
      {
        label: 'A',
        text: '0.25 (occurs when z = 0, where σ(0) = 0.5)',
        correct: true,
        explanation: 'Since σ\'(z) = σ(1 - σ), the quadratic reaches its maximum when σ = 0.5, yielding 0.5 * 0.5 = 0.25. In deep networks, multiplying numbers ≤ 0.25 causes exponential decay (vanishing gradient).'
      },
      {
        label: 'B',
        text: '1.0 (occurs as z → +∞)',
        correct: false,
        explanation: 'As z → +∞, σ(z) → 1, so σ\'(z) → 1 * (1 - 1) = 0, not 1.0.'
      },
      {
        label: 'C',
        text: '0.50 (occurs at z = 1)',
        correct: false,
        explanation: '0.5 is the function value σ(0), but the derivative evaluated there is 0.5 * (1 - 0.5) = 0.25.'
      },
      {
        label: 'D',
        text: '0.0 (constant everywhere)',
        correct: false,
        explanation: 'The derivative varies with z and vanishes only in saturation regimes.'
      },
    ]
  },
  {
    id: 3,
    topic: 'NumPy / PyTorch Tensor Broadcasting',
    difficulty: 'L4 Synthesis',
    question: 'Tensor A has shape (32, 1, 64) and Tensor B has shape (16, 64). Under NumPy/PyTorch broadcasting rules, can they be added (A + B)? If so, what is the resulting shape?',
    codeSnippet: 'A = torch.randn(32, 1, 64)\nB = torch.randn(16, 64)\nC = A + B  # What is C.shape?',
    options: [
      {
        label: 'A',
        text: 'Yes: Resulting shape is (32, 16, 64)',
        correct: true,
        explanation: 'Right-aligning dimensions: A has (32, 1, 64), B is prepended with 1 to become (1, 16, 64). Comparing dimensions: 64 matches 64; 1 stretches to 16; 32 stretches from 1. Broadcast result: (32, 16, 64).'
      },
      {
        label: 'B',
        text: 'No: Dimension mismatch error at dimension 0',
        correct: false,
        explanation: 'Tensors of different ranks are automatically left-padded with 1s, so B behaves as shape (1, 16, 64).'
      },
      {
        label: 'C',
        text: 'Yes: Resulting shape is (32, 64)',
        correct: false,
        explanation: 'Broadcasting expands dimensions; it does not squeeze or collapse non-singleton axes.'
      },
      {
        label: 'D',
        text: 'No: Requires explicit torch.unsqueeze(B, 0)',
        correct: false,
        explanation: 'PyTorch handles trailing dimension alignment implicitly without requiring explicit unsqueeze.'
      },
    ]
  },
  {
    id: 4,
    topic: 'Matrix Calculus & Trace Derivations',
    difficulty: 'L4 Synthesis',
    question: 'Given scalar objective f(W) = Tr(Wᵀ A W) where A is a symmetric matrix, what is the matrix derivative ∇_W f(W)?',
    formula: 'f(W) = \\text{Tr}(W^T A W), \\quad A = A^T',
    options: [
      {
        label: 'A',
        text: '∇_W f(W) = 2 A W',
        correct: true,
        explanation: 'Using standard differential calculus: d Tr(Wᵀ A W) = Tr(dWᵀ A W) + Tr(Wᵀ A dW) = 2 Tr(Wᵀ A dW) due to symmetry of A. Therefore ∇_W f = 2 A W.'
      },
      {
        label: 'B',
        text: '∇_W f(W) = A W',
        correct: false,
        explanation: 'This misses the factor of 2 arising from the quadratic dependence on W.'
      },
      {
        label: 'C',
        text: '∇_W f(W) = 2 Wᵀ A',
        correct: false,
        explanation: 'The dimension of the gradient must match the dimension of W, which is A W rather than transposed Wᵀ A.'
      },
      {
        label: 'D',
        text: '∇_W f(W) = Tr(A) · W',
        correct: false,
        explanation: 'The trace does not factor out as a scalar coefficient of W.'
      },
    ]
  }
];

export const academicCourses: CourseItem[] = [
  {
    id: 'cs801',
    code: 'CS801',
    title: 'Deep Learning & Neural Architectures',
    type: 'Theory & Lab',
    instructor: 'Dr. K. Ramesh, Professor',
    credits: 4,
    attendance: 94,
    submissionsDue: 1,
    modules: ['Loss Landscapes & Optimization', 'Backpropagation & Computational Graphs', 'CNNs & Vision Transformers', 'Recurrent & Attention Mechanisms'],
    status: 'Enrolled',
    color: 'indigo',
  },
  {
    id: 'cs802',
    code: 'CS802',
    title: 'Compiler Design & Intermediate Representations',
    type: 'Theory & Lab',
    instructor: 'Dr. M. Sangeetha, Assoc. Prof',
    credits: 4,
    attendance: 91,
    submissionsDue: 1,
    modules: ['Lexical Analysis & LLVM Lexer', 'LR/LALR Parsing & Syntax Trees', 'Static Single Assignment (SSA)', 'Target Code Generation & Register Allocation'],
    status: 'Enrolled',
    color: 'purple',
  },
  {
    id: 'cs803',
    code: 'CS803',
    title: 'Distributed Cloud Computing & Kubernetes',
    type: 'Theory',
    instructor: 'Prof. S. Venkatesh',
    credits: 3,
    attendance: 88,
    submissionsDue: 0,
    modules: ['Consensus Protocols (Raft & Paxos)', 'Containerization & Cgroups', 'K8s Pod Scheduling & Ingress', 'Eventual Consistency & CAP Theorem'],
    status: 'Enrolled',
    color: 'blue',
  },
  {
    id: 'cs804',
    code: 'CS804',
    title: 'High-Performance GPU Computing (CUDA)',
    type: 'Lab',
    instructor: 'Dr. R. Anand',
    credits: 2,
    attendance: 98,
    submissionsDue: 0,
    modules: ['CUDA Thread Hierarchy & Warp Scheduling', 'Shared Memory Bank Conflicts', 'Parallel Reduction & Prefix Sums', 'cuBLAS & Tensor Cores'],
    status: 'Enrolled',
    color: 'amber',
  },
  {
    id: 'cs805',
    code: 'CS805',
    title: 'Quantum Computing & Algorithms',
    type: 'Theory',
    instructor: 'Dr. Priya Sundaram',
    credits: 3,
    attendance: 92,
    submissionsDue: 0,
    modules: ['Qubits & Bloch Sphere Representations', 'Quantum Entanglement & Teleportation', 'Deutsch-Jozsa & Grover Algorithm', 'Shor Factoring & Qiskit Labs'],
    status: 'Enrolled',
    color: 'emerald',
  },
  {
    id: 'cs806',
    code: 'CS806',
    title: 'Capstone Engineering Project - Phase I',
    type: 'Lab',
    instructor: 'Project Committee Board',
    credits: 3,
    attendance: 100,
    submissionsDue: 0,
    modules: ['Problem Formulation & Literature Review', 'Architecture & System Design', 'Prototype Sprint I', 'Mid-Term Department Review'],
    status: 'Enrolled',
    color: 'teal',
  }
];

export const academicTests: TestItem[] = [
  {
    id: 'test-1',
    title: 'Deep Learning Midterm Examination II',
    course: 'CS801 Deep Learning',
    date: 'Tomorrow, Sep 23',
    time: '10:00 AM - 11:30 AM',
    duration: '90 mins',
    status: 'upcoming',
    totalMarks: 50,
    topics: ['Computational Graphs', 'Reverse AD', 'Hessian Conditioning', 'Batch Normalization', 'Adam Optimizer Convergence']
  },
  {
    id: 'test-2',
    title: 'Compiler Design Lab Assessment: SSA Optimization',
    course: 'CS802 Compiler Design',
    date: 'Friday, Sep 25',
    time: '02:00 PM - 04:00 PM',
    duration: '120 mins',
    status: 'upcoming',
    totalMarks: 40,
    topics: ['Dominator Trees', 'Phi-Node Placement', 'Dead Code Elimination', 'Graph Coloring Register Alloc']
  },
  {
    id: 'test-3',
    title: 'Deep Learning Midterm Examination I',
    course: 'CS801 Deep Learning',
    date: 'Aug 28, 2026',
    time: '10:00 AM',
    duration: '90 mins',
    status: 'completed',
    score: 46.5,
    totalMarks: 50,
    topics: ['Gradient Descent', 'Convex Optimization', 'Loss Landscapes']
  },
  {
    id: 'test-4',
    title: 'CUDA Parallel Architecture Quiz',
    course: 'CS804 GPU Computing',
    date: 'Sep 05, 2026',
    time: '11:15 AM',
    duration: '45 mins',
    status: 'completed',
    score: 29.0,
    totalMarks: 30,
    topics: ['Warp Divergence', 'Coalesced Memory Access', 'Shared Memory']
  }
];
