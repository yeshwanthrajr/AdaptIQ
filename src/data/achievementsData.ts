import { Badge } from '../types';

export const initialBadges: Badge[] = [
  {
    id: 'badge-bloom-l4',
    title: 'Bloom L4 Synthesizer',
    description: 'Calibrate your reasoning index into Tier L4 (Synthesis), placing in the top 4% of the cohort.',
    category: 'mastery',
    rarity: 'Legendary',
    icon: 'Crown',
    unlocked: true,
    unlockedAt: '2026-03-18',
    xpReward: 500,
    requirement: 'Reach Bloom Taxonomy Tier L4 (Synthesis)',
    progress: { current: 4, max: 4, label: 'L4 Tier Reached' }
  },
  {
    id: 'badge-hyper-pace',
    title: 'Hyper-Pace Velocity',
    description: 'Sustain a personalized learning pace factor of 2.5x or higher without accuracy drop.',
    category: 'mastery',
    rarity: 'Epic',
    icon: 'Zap',
    unlocked: true,
    unlockedAt: '2026-03-20',
    xpReward: 300,
    requirement: 'Maintain Pace Factor >= 2.5x',
    progress: { current: 2.6, max: 2.5, label: '2.6x Current Pace' }
  },
  {
    id: 'badge-backprop-master',
    title: 'Backprop Graph Architect',
    description: 'Complete the interactive forward pass and reverse-mode analytical gradient derivation.',
    category: 'module',
    rarity: 'Rare',
    icon: 'GitFork',
    unlocked: false,
    xpReward: 250,
    requirement: 'Finish Module 2: Backpropagation Session',
    progress: { current: 0, max: 1, label: 'Pending Session' }
  },
  {
    id: 'badge-diag-ace',
    title: 'Deep Diagnostic Ace',
    description: 'Score 75% or higher on the 5-Minute Neural Systems Adaptive Diagnostic test.',
    category: 'diagnostic',
    rarity: 'Epic',
    icon: 'Target',
    unlocked: false,
    xpReward: 350,
    requirement: 'Score >= 75% on Adaptive Diagnostic',
    progress: { current: 0, max: 75, label: 'Unattempted' }
  },
  {
    id: 'badge-cuda-kernel',
    title: 'CUDA Kernel Crafter',
    description: 'Execute and pass automated autograd unit tests inside the Cloud IDE container.',
    category: 'lab',
    rarity: 'Rare',
    icon: 'Cpu',
    unlocked: false,
    xpReward: 200,
    requirement: 'Run python test_autograd.py in Cloud Lab',
    progress: { current: 0, max: 1, label: 'Pending Lab Run' }
  },
  {
    id: 'badge-matrix-virtuoso',
    title: 'Matrix Tensor Virtuoso',
    description: 'Calculate Kronecker products and verify Jacobian trace identity proofs.',
    category: 'mastery',
    rarity: 'Common',
    icon: 'Layers',
    unlocked: false,
    xpReward: 150,
    requirement: 'Explore Matrix Calculus & Kronecker Tool',
    progress: { current: 0, max: 1, label: 'Pending Exploration' }
  },
  {
    id: 'badge-loss-explorer',
    title: 'Loss Landscape Navigator',
    description: 'Simulate optimizer paths (SGD, Momentum, Adam) across non-convex loss surfaces.',
    category: 'lab',
    rarity: 'Common',
    icon: 'Compass',
    unlocked: false,
    xpReward: 150,
    requirement: 'Launch Loss Surface Explorer in Tools Suite',
    progress: { current: 0, max: 1, label: 'Pending Simulation' }
  },
  {
    id: 'badge-curriculum-pioneer',
    title: 'Neural Systems Pioneer',
    description: 'Master 3 or more neural network core curriculum units.',
    category: 'module',
    rarity: 'Legendary',
    icon: 'Award',
    unlocked: false,
    xpReward: 400,
    requirement: 'Complete 3 Curriculum Modules',
    progress: { current: 1, max: 3, label: '1 / 3 Modules Mastered' }
  }
];
