export type UserRole = 'student' | 'faculty' | 'admin';
export type UserAccountStatus = 'active' | 'pending_approval' | 'rejected';

export interface StudentProfile {
  uid?: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  status: UserAccountStatus;
  institution: string;
  department: string;
  semester: string;
  designation?: string;
  rollOrEmpNumber?: string;
  otpVerified?: boolean;
  emailVerified?: boolean;
  emailVerificationSentAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt?: string;
  lastLoginAt?: string;
  masteryIndex: number; // e.g. 84
  masteryDelta: number; // e.g. +6%
  paceFactor: number; // e.g. 2.6
  paceDescription: string;
  primaryStyle: string; // e.g. "Interactive Labs"
  primaryStyleStat: string; // e.g. "68% of sessions (Cloud IDE)"
  bloomTier: string; // e.g. "L4 • Synthesis"
  bloomTierNote: string;
  lastRecalibrated: string;
  earnedBadgeIds?: string[];
  totalXp?: number;
  studyPlannerTasks?: StudyTask[];
}

export type ViewMode = 'modern' | 'classic' | 'admin' | 'faculty';

export type ActiveModal = 
  | null 
  | 'backprop-session'
  | 'diagnostic'
  | 'matrix-calculus'
  | 'cloud-lab'
  | 'tools-suite'
  | 'courses'
  | 'tests'
  | 'mentorship'
  | 'refine-path'
  | 'command-palette'
  | 'loss-explorer'
  | 'backprop-video'
  | 'achievements'
  | 'study-planner'
  | 'faculty-upload'
  | 'personalized-study-materials'
  | 'practice-test'
  | 'admin-approvals'
  | 'announcements';

export interface PriorityConcept {
  name: string;
  priority: 'HIGH' | 'MEDIUM' | 'CRITICAL_EXAM';
  importanceReason: string;
  bloomLevel: 'L2' | 'L3' | 'L4';
  estimatedMinutes: number;
}

export interface VisualMentalModel {
  concept: string;
  visualType: string;
  headline: string;
  representation: string;
  analogy: string;
  commonPitfall: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  bloomLevel: string;
}

export interface AIPersonalizedNotes {
  summary: string;
  priorityConcepts: PriorityConcept[];
  visualMentalModels: VisualMentalModel[];
  adaptiveAdjustments: {
    forStrugglingStudents: string;
    forAdvancedStudents: string;
    examTip: string;
  };
  practiceAssessment: PracticeQuestion[];
}

export interface FacultyNote {
  id: string;
  title: string;
  subject: string;
  unit: string;
  unitName: string;
  facultyName: string;
  facultyEmail: string;
  uploadDate: string;
  fileName?: string;
  rawContent: string;
  isAiPersonalized: boolean;
  aiData?: AIPersonalizedNotes;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  targetRole: 'all' | 'student' | 'faculty';
  date: string;
  isUrgent?: boolean;
}

export interface SystemActivityLog {
  id: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  timestamp: string;
  deviceInfo?: string;
  status: 'SUCCESS' | 'WARNING' | 'PENDING';
}

export type TaskType = 'module_review' | 'lab_session' | 'diagnostic_prep' | 'exam_revision';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface StudyTask {
  id: string;
  title: string;
  type: TaskType;
  moduleName?: string;
  day: DayOfWeek;
  dateStr?: string;
  timeSlot: string; // e.g., "10:00 AM - 11:30 AM"
  durationMinutes: number;
  status: 'pending' | 'completed';
  targetActionModal?: ActiveModal;
  notes?: string;
  priority: 'high' | 'medium' | 'normal';
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'diagnostic' | 'module' | 'lab' | 'mastery';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  requirement: string;
  progress?: {
    current: number;
    max: number;
    label: string;
  };
}

export interface CurriculumModule {
  id: string;
  title: string;
  subtitle: string;
  status: 'mastered' | 'current' | 'recommended' | 'locked';
  masteryScore?: number;
  level?: number;
  duration?: string;
  unitLabel?: string;
  description: string;
  buttonLabel?: string;
  actionKey?: ActiveModal;
}

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'alert' | 'info';
  actionPrompt?: string;
  recommendedAction?: ActiveModal;
}

export interface RecommendedResource {
  id: string;
  title: string;
  meta: string;
  type: 'sandbox' | 'video' | 'notebook';
  iconSymbol: string;
  actionKey: ActiveModal;
}

export interface DiagnosticQuestion {
  id: number;
  topic: string;
  difficulty: 'L2 Understand' | 'L3 Apply' | 'L4 Synthesis';
  question: string;
  codeSnippet?: string;
  formula?: string;
  options: { label: string; text: string; correct: boolean; explanation: string }[];
}

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  type: 'Theory & Lab' | 'Theory' | 'Lab';
  instructor: string;
  credits: number;
  attendance: number;
  submissionsDue: number;
  modules: string[];
  status: 'Enrolled' | 'Completed';
  color: string;
}

export interface TestItem {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed';
  score?: number;
  totalMarks: number;
  topics: string[];
}
