import { FacultyNote, Announcement, SystemActivityLog, StudentProfile } from '../types';

export const initialUsersList: StudentProfile[] = [
  {
    uid: 'admin-001',
    name: 'Dr. S. K. Narayanan',
    email: 'admin@easwari.edu',
    mobile: '+91 98401 23456',
    role: 'admin',
    status: 'active',
    institution: 'Easwari Engineering College',
    department: 'Deanery of Academic Affairs',
    semester: 'Staff',
    designation: 'Dean & Chief Academic Administrator',
    rollOrEmpNumber: 'EEC-ADM-042',
    otpVerified: true,
    emailVerified: true,
    approvedAt: '2026-01-10',
    approvedBy: 'Governing Council',
    masteryIndex: 98,
    masteryDelta: 0,
    paceFactor: 1.0,
    paceDescription: 'Full Administrator Privileges',
    primaryStyle: 'System Oversight',
    primaryStyleStat: '100% Platform Access',
    bloomTier: 'L6 • Evaluation & Policy',
    bloomTierNote: 'Chief System Administrator',
    lastRecalibrated: 'Active Now',
    totalXp: 5000,
  },
  {
    uid: 'faculty-001',
    name: 'Dr. K. Ramesh',
    email: 'prof.ramesh@easwari.edu',
    mobile: '+91 98402 34567',
    role: 'faculty',
    status: 'active',
    institution: 'Easwari Engineering College',
    department: 'Computer Science and Engineering',
    semester: 'Faculty',
    designation: 'Associate Professor & AI Lab Incharge',
    rollOrEmpNumber: 'FAC-CSE-118',
    otpVerified: true,
    emailVerified: true,
    approvedAt: '2026-01-12',
    approvedBy: 'Dr. S. K. Narayanan',
    masteryIndex: 96,
    masteryDelta: 2,
    paceFactor: 1.0,
    paceDescription: 'Curriculum Director & Evaluator',
    primaryStyle: 'Lecture & Lab Notes',
    primaryStyleStat: '14 Units Decomposed',
    bloomTier: 'L5 • Synthesis & Creation',
    bloomTierNote: 'Senior Faculty Member',
    lastRecalibrated: '10 mins ago',
    totalXp: 3800,
  },
  {
    uid: 'student-001',
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
    approvedAt: '2026-02-01',
    approvedBy: 'Dr. K. Ramesh',
    masteryIndex: 84,
    masteryDelta: 6,
    paceFactor: 2.6,
    paceDescription: 'Optimal load calibration sustained',
    primaryStyle: 'Interactive Labs',
    primaryStyleStat: '68% of sessions (Cloud IDE)',
    bloomTier: 'L4 • Synthesis',
    bloomTierNote: 'Top 4% of engineering cohort',
    lastRecalibrated: 'Just now',
    earnedBadgeIds: ['badge-bloom-l4', 'badge-hyper-pace', 'badge-backprop-master'],
    totalXp: 1050,
  },
  {
    uid: 'student-002',
    name: 'Ananya S. Iyer',
    email: 'ananya.iyer@easwari.edu',
    mobile: '+91 98404 56789',
    role: 'student',
    status: 'active',
    institution: 'Easwari Engineering College',
    department: 'Computer Science and Engineering',
    semester: 'Semester 6',
    designation: 'Undergraduate Scholar',
    rollOrEmpNumber: '310621104012',
    otpVerified: true,
    emailVerified: false,
    approvedAt: '2026-02-01',
    approvedBy: 'Dr. K. Ramesh',
    masteryIndex: 89,
    masteryDelta: 4,
    paceFactor: 2.4,
    paceDescription: 'Consistent linear mastery',
    primaryStyle: 'Matrix Proofs & Theory',
    primaryStyleStat: '82% Theory Mastery',
    bloomTier: 'L4 • Synthesis',
    bloomTierNote: 'Top 3% of cohort',
    lastRecalibrated: '1 hr ago',
    totalXp: 950,
  },
  {
    uid: 'student-pending-01',
    name: 'Karthik Raja M.',
    email: 'karthik.raja@easwari.edu',
    mobile: '+91 98405 67890',
    role: 'student',
    status: 'pending_approval',
    institution: 'Easwari Engineering College',
    department: 'Information Technology',
    semester: 'Semester 6',
    designation: 'Student Applicant',
    rollOrEmpNumber: '310621205044',
    otpVerified: true,
    emailVerified: false,
    createdAt: '2026-03-21',
    masteryIndex: 65,
    masteryDelta: 0,
    paceFactor: 1.0,
    paceDescription: 'Initial enrollment pending',
    primaryStyle: 'General',
    primaryStyleStat: 'Awaiting Diagnostic',
    bloomTier: 'L2 • Comprehension',
    bloomTierNote: 'Pending baseline assessment',
    lastRecalibrated: 'Pending Approval',
    totalXp: 0,
  },
  {
    uid: 'faculty-pending-01',
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.s@easwari.edu',
    mobile: '+91 98406 78901',
    role: 'faculty',
    status: 'pending_approval',
    institution: 'Easwari Engineering College',
    department: 'AI & Data Science',
    semester: 'Faculty',
    designation: 'Assistant Professor',
    rollOrEmpNumber: 'FAC-ADS-054',
    otpVerified: true,
    emailVerified: false,
    createdAt: '2026-03-22',
    masteryIndex: 94,
    masteryDelta: 0,
    paceFactor: 1.0,
    paceDescription: 'Faculty Onboarding',
    primaryStyle: 'Curriculum & Labs',
    primaryStyleStat: 'Awaiting Subject Allocation',
    bloomTier: 'L5 • Synthesis',
    bloomTierNote: 'Pending Admin Verification',
    lastRecalibrated: 'Pending Approval',
    totalXp: 1200,
  },
];

export const initialFacultyNotes: FacultyNote[] = [
  {
    id: 'note-01',
    title: 'Unit II: Multivariate Backpropagation & Vector Jacobian Products (VJP)',
    subject: 'CS8601 Deep Learning & Neural Computation',
    unit: 'Unit 2',
    unitName: 'Backpropagation & Computational Graphs',
    facultyName: 'Dr. K. Ramesh',
    facultyEmail: 'prof.ramesh@easwari.edu',
    uploadDate: '2026-03-20',
    fileName: 'Unit2_Backpropagation_Mechanics_Lectures.pdf',
    rawContent: `LMS LECTURE NOTES - UNIT II: NEURAL BACKPROPAGATION & TOPOLOGICAL AD
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
- Softmax Overflow: Compute exp(z_i - max(z)) / sum(exp(z_j - max(z))) to prevent float32 inf representation.`,
    isAiPersonalized: true,
    aiData: {
      summary: 'Deconstructed lecture notes for Unit II covering topological reverse automatic differentiation, tensor contractions in matrix backpropagation, and IEEE 754 numerical stability techniques.',
      priorityConcepts: [
        {
          name: 'Reverse-Mode Vector-Jacobian Product (VJP)',
          priority: 'CRITICAL_EXAM',
          importanceReason: 'Central theorem for university 16-mark derivations and PyTorch autograd engine implementations.',
          bloomLevel: 'L4',
          estimatedMinutes: 45,
        },
        {
          name: 'Gradient Saturation & He/Xavier Normalization',
          priority: 'HIGH',
          importanceReason: 'Explains numerical convergence in deep networks exceeding 10 layers.',
          bloomLevel: 'L3',
          estimatedMinutes: 30,
        },
        {
          name: 'Log-Sum-Exp Trick for Softmax Cross-Entropy',
          priority: 'MEDIUM',
          importanceReason: 'Standard industry safeguard against NaN and infinity floating-point overflow.',
          bloomLevel: 'L3',
          estimatedMinutes: 25,
        },
      ],
      visualMentalModels: [
        {
          concept: 'Reverse Automatic Differentiation Graph Flow',
          visualType: 'Computation Graph Flow',
          headline: 'Forward pass builds intermediate state caching; backward pass pulls gradients back.',
          representation: `[ Input Vector x ] ───▶ ( Linear: W·x + b ) ───▶ [ Pre-activation z ] ───▶ ( Activation: σ ) ───▶ [ a ] ───▶ ( Loss L )
        │                                                                                           │
        ▲ ◀── Vector Jacobian: ∂L/∂x = Wᵀ · δ ◀─── [ Adjoint δ = ∂L/∂a ⊙ σ'(z) ] ◀─── Backprop ∂L/∂a ◀──┘`,
          analogy: 'Imagine a detective tracking back from the final crime scene (the loss) through each intermediate clue (layer) to apportion exact accountability (weight gradients) to each participating suspect.',
          commonPitfall: 'Incorrect matrix dimensions when multiplying: ∂L/∂W must yield (M × N), so it must be δ · xᵀ, never xᵀ · δ.',
        },
        {
          concept: 'Log-Sum-Exp Stabilization',
          visualType: 'Mathematical Step Decomposition',
          headline: 'Normalizing by max(z) eliminates exponential explosion.',
          representation: `Raw Softmax:       p_i = exp(z_i) / Σ exp(z_j)         ==> exp(800) yields +Infinity!
Stabilized Form:   p_i = exp(z_i - max(z)) / Σ exp(z_j - max(z)) ==> max exponent is exp(0) = 1.0 (Safe)`,
          analogy: 'Adjusting an audio mixer level so the loudest instrument stays below peak clipping threshold before amplifying.',
          commonPitfall: 'Applying log after softmax: log(softmax(z)) causes log(0) = -Inf. Use log_softmax directly.',
        },
      ],
      adaptiveAdjustments: {
        forStrugglingStudents: 'Practice 2-node scalar computation graphs (f = (x+y)*z) before moving to tensor-valued Jacobian products.',
        forAdvancedStudents: 'Write a custom CUDA C++ autograd kernel using warp-shuffle primitives for fast reduction.',
        examTip: 'Always write the dimensions of each variable (e.g. W ∈ ℝ^{M×N}) at the top of your answer sheet before deriving gradients.',
      },
      practiceAssessment: [
        {
          id: 'q1',
          question: 'In deep learning frameworks, why is reverse-mode automatic differentiation (backpropagation) significantly faster than forward-mode automatic differentiation for computing gradients of a scalar loss function with respect to 100 million parameters?',
          options: [
            'Reverse-mode avoids storing activations from the forward pass in memory',
            'Reverse-mode computes the gradient vector with respect to all 100 million parameters in a single O(1) backward pass, whereas forward-mode would require 100 million passes',
            'Forward-mode cannot handle non-differentiable activation functions like ReLU',
            'Reverse-mode runs entirely in hardware registers without main memory access',
          ],
          correctAnswer: 1,
          explanation: 'When mapping f: ℝ^N → ℝ^1 (N inputs, 1 scalar loss), reverse-mode requires only 1 backward pass to compute all partial derivatives, whereas forward-mode propagates directional derivatives one input at a time (N passes).',
          bloomLevel: 'L4 • Synthesis',
        },
        {
          id: 'q2',
          question: 'Consider a fully-connected layer z = W · x + b with incoming gradient δ = ∂L/∂z. Which equation correctly gives the gradient of the loss with respect to the weight matrix W?',
          options: [
            '∂L/∂W = W · δ^T',
            '∂L/∂W = δ · x^T',
            '∂L/∂W = x · δ^T',
            '∂L/∂W = δ^T · x',
          ],
          correctAnswer: 1,
          explanation: 'Since z ∈ ℝ^M and x ∈ ℝ^N, W must be of dimension M × N. The incoming gradient δ = ∂L/∂z has dimension M × 1. The outer product δ · x^T gives an M × N matrix corresponding exactly to ∂L/∂W.',
          bloomLevel: 'L3 • Application',
        },
        {
          id: 'q3',
          question: 'What is the primary motivation for implementing the Log-Sum-Exp numerical trick when evaluating Cross-Entropy loss on logits z?',
          options: [
            'To accelerate matrix multiplication using Tensor Cores',
            'To prevent 32-bit floating point overflow when logits contain large positive values',
            'To eliminate the requirement of a learning rate hyperparameter',
            'To force the network weights to remain strictly orthogonal',
          ],
          correctAnswer: 1,
          explanation: 'In 32-bit IEEE 754 floats, exp(88.7) overflows to infinity. Subtracting max(z) ensures the maximum exponent evaluated is exp(0) = 1, entirely avoiding numerical overflow while preserving mathematically identical softmax probabilities.',
          bloomLevel: 'L4 • Synthesis',
        },
      ],
    },
  },
  {
    id: 'note-02',
    title: 'Unit III: Non-Convex Loss Landscapes & Adaptive Optimizer Dynamics',
    subject: 'CS8601 Deep Learning & Neural Computation',
    unit: 'Unit 3',
    unitName: 'Loss Surfaces & Optimization Dynamics',
    facultyName: 'Dr. K. Ramesh',
    facultyEmail: 'prof.ramesh@easwari.edu',
    uploadDate: '2026-03-21',
    fileName: 'Unit3_Optimizer_Dynamics_Adam_RMSProp.pdf',
    rawContent: `UNIT III: FIRST-ORDER OPTIMIZATION METHODS
1. GRADIENT DESCENT & ILL-CONDITIONED SURFACES:
Standard SGD update theta_{t+1} = theta_t - alpha * g_t struggles on ill-conditioned ravines where the Hessian matrix H has high condition number kappa = lambda_max / lambda_min >> 1. Gradients oscillate violently across steep walls while making negligible progress along shallow valley floors.

2. MOMENTUM & NESTEROV ACCELERATED GRADIENT (NAG):
Polyak heavy-ball momentum accumulates velocity: v_t = beta * v_{t-1} + alpha * g_t.
NAG evaluates gradients at predicted future position: g_t = grad f(theta_t - beta * v_{t-1}).

3. ADAPTIVE LEARNING RATES:
- AdaGrad: Scales updates inversely with sqrt(G_t + eps), but sum of squared gradients continuously accumulates, causing learning rate to prematurely collapse to zero.
- RMSProp: Replaces monotonic sum with exponential moving average of squared gradients: v_t = gamma * v_{t-1} + (1 - gamma) * g_t^2.
- Adam: Combines first moment (momentum) and second moment (RMSProp) with bias correction terms to prevent initial underestimation.`,
    isAiPersonalized: true,
    aiData: {
      summary: 'Comprehensive analysis of non-convex optimization, condition numbers of Hessian curvature, and adaptive learning rate mechanics across SGD, Momentum, RMSProp, and Adam.',
      priorityConcepts: [
        {
          name: 'Hessian Condition Number & Ravine Oscillation',
          priority: 'CRITICAL_EXAM',
          importanceReason: 'Explains why vanilla SGD fails in modern multi-layer non-convex landscapes.',
          bloomLevel: 'L4',
          estimatedMinutes: 40,
        },
        {
          name: 'Adam Bias Correction Derivations',
          priority: 'HIGH',
          importanceReason: 'High-frequency question in university exams explaining why initial moments are divided by (1 - beta^t).',
          bloomLevel: 'L4',
          estimatedMinutes: 35,
        },
      ],
      visualMentalModels: [
        {
          concept: 'Hessian Eigenvalue Curvature & Optimizer Trajectory',
          visualType: 'Contour Geometry Flow',
          headline: 'Momentum cancels perpendicular oscillations and compounds along the valley.',
          representation: `High Curvature Direction (λ_max)
         │  /\    /\    /\
         │ /  \  /  \  /  \  <── Standard SGD bounces uncontrollably
         ▼/____\/____\/____\──────▶ Low Curvature Direction (λ_min)
                                    [ Adam & Momentum glide smoothly to Minimum ]`,
          analogy: 'A heavy rolling bowling ball in a half-pipe: its physical inertia prevents it from bouncing side-to-side, carrying it straight down the length of the track.',
          commonPitfall: 'Forgetting bias correction during early iterations: m_t / (1 - beta_1^t), which prevents updates from collapsing to zero at t=1.',
        },
      ],
      adaptiveAdjustments: {
        forStrugglingStudents: 'Use the interactive 3D Loss Surface Explorer in the Tools Suite to visually contrast SGD vs Adam paths.',
        forAdvancedStudents: 'Analyze warmup schedules and decoupled weight decay in AdamW (Loshchilov & Hutter).',
        examTip: 'Write down both first moment and second moment update equations with explicit bias correction indices t.',
      },
      practiceAssessment: [
        {
          id: 'q3-1',
          question: 'Why does AdaGrad suffer from premature learning rate decay when training deep neural networks over long horizons?',
          options: [
            'Because it divides the gradient by an exponential decay term',
            'Because the denominator continuously accumulates squared gradients monotonically without forgetting past values, driving the effective learning rate to zero',
            'Because it sets the second moment to 0 whenever a saddle point is encountered',
            'Because it only works on strictly convex loss functions',
          ],
          correctAnswer: 1,
          explanation: 'AdaGrad computes s_t = s_{t-1} + g_t^2. Since g_t^2 >= 0, s_t grows monotonically without bound, causing the step size alpha / sqrt(s_t + eps) to decay to infinitesimal values before reaching the global minimum. RMSProp solved this using exponential moving averages.',
          bloomLevel: 'L4 • Synthesis',
        },
      ],
    },
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'University Midterm Examination II Schedule Released',
    content: 'Anna University / Easwari Engineering College Internal Assessment Test II for Semester 6 Deep Learning (CS8601) and Compiler Design is scheduled starting October 12, 2026. Mock tests are active in the Assessments portal.',
    authorName: 'Dr. S. K. Narayanan (Dean)',
    authorRole: 'admin',
    targetRole: 'all',
    date: '2026-03-21',
    isUrgent: true,
  },
  {
    id: 'ann-2',
    title: 'Unit II Lecture Notes & AI Practice Assessment Available',
    content: 'I have uploaded the comprehensive lecture notes on Multivariate Backpropagation & Vector Jacobian Products. The AI Personalizer has generated visual computation graph models and practice tests for all students.',
    authorName: 'Dr. K. Ramesh',
    authorRole: 'faculty',
    targetRole: 'student',
    date: '2026-03-21',
    isUrgent: false,
  },
  {
    id: 'ann-3',
    title: 'NVIDIA GPU Kubernetes Pod Maintenance',
    content: 'The cloud programming lab container cluster (gpu-k8s-pod) has been upgraded to PyTorch 2.3 with CUDA 12.4. Memory footprints for autograd benchmarks have dropped by 18%.',
    authorName: 'Systems Admin',
    authorRole: 'admin',
    targetRole: 'all',
    date: '2026-03-20',
    isUrgent: false,
  },
];

export const initialActivityLogs: SystemActivityLog[] = [
  {
    id: 'log-1',
    userName: 'Dr. S. K. Narayanan',
    userEmail: 'admin@easwari.edu',
    userRole: 'admin',
    action: 'Administrator login from Campus Intranet (EEC-Admin-VLAN)',
    timestamp: '2026-03-22 09:14 AM',
    deviceInfo: 'macOS Chrome 124.0.0',
    status: 'SUCCESS',
  },
  {
    id: 'log-2',
    userName: 'Dr. K. Ramesh',
    userEmail: 'prof.ramesh@easwari.edu',
    userRole: 'faculty',
    action: 'Uploaded lecture notes: Unit II Backpropagation Mechanics (AI Personalization executed)',
    timestamp: '2026-03-22 09:30 AM',
    deviceInfo: 'Ubuntu Linux 22.04 Chrome',
    status: 'SUCCESS',
  },
  {
    id: 'log-3',
    userName: 'Yashwanth Raj',
    userEmail: 'student@easwari.edu',
    userRole: 'student',
    action: 'Completed Backpropagation Interactive Session (Mastery increased +2% to 84%)',
    timestamp: '2026-03-22 09:48 AM',
    deviceInfo: 'Windows 11 Edge',
    status: 'SUCCESS',
  },
  {
    id: 'log-4',
    userName: 'Karthik Raja M.',
    userEmail: 'karthik.raja@easwari.edu',
    userRole: 'student',
    action: 'Registered new student account (Email OTP verified; Status: Awaiting Admin Approval)',
    timestamp: '2026-03-22 10:02 AM',
    deviceInfo: 'Android Chrome Mobile',
    status: 'PENDING',
  },
  {
    id: 'log-5',
    userName: 'Dr. Meenakshi Sundaram',
    userEmail: 'meenakshi.s@easwari.edu',
    userRole: 'faculty',
    action: 'Registered new faculty account (Email OTP verified; Status: Awaiting Admin Approval)',
    timestamp: '2026-03-22 10:15 AM',
    deviceInfo: 'Windows 11 Firefox',
    status: 'PENDING',
  },
];
