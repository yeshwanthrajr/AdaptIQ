import React, { useState, useEffect } from 'react';
import { 
  curriculumModules, 
  initialInsights, 
  recommendedResources 
} from './data/curriculumData';
import { initialBadges } from './data/achievementsData';
import { initialStudyTasks } from './data/plannerData';
import { ViewMode, ActiveModal, CurriculumModule, Badge, StudyTask, FacultyNote } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

// Modern View Components
import { TopNavigationBar } from './components/TopNavigationBar';
import { HeroAdaptiveMetrics } from './components/HeroAdaptiveMetrics';
import { AcademicWorkspacesGrid } from './components/AcademicWorkspacesGrid';
import { AchievementsSection } from './components/AchievementsSection';
import { WeeklyStudyPlanner } from './components/WeeklyStudyPlanner';
import { AdaptiveExplanationBanner } from './components/AdaptiveExplanationBanner';
import { CurriculumTimeline } from './components/CurriculumTimeline';
import { DiagnosticSidebar } from './components/DiagnosticSidebar';
import { InstitutionalFooter } from './components/InstitutionalFooter';

// Classic CodeTantra Portal View
import { ClassicPortalView } from './components/ClassicPortalView';

// RBAC Role Views
import { AdminDashboardView } from './components/AdminDashboardView';
import { FacultyPortalView } from './components/FacultyPortalView';

// Interactive Modals
import { BackpropSessionModal } from './components/BackpropSessionModal';
import { DiagnosticRunnerModal } from './components/DiagnosticRunnerModal';
import { CloudLabIdeModal } from './components/CloudLabIdeModal';
import { MatrixCalculusModal } from './components/MatrixCalculusModal';
import { ToolsSuiteModal } from './components/ToolsSuiteModal';
import { CoursesModal } from './components/CoursesModal';
import { TestsModal } from './components/TestsModal';
import { MentorshipModal } from './components/MentorshipModal';
import { RefinePathModal } from './components/RefinePathModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AchievementsModal } from './components/AchievementsModal';
import { AchievementUnlockedToast } from './components/AchievementUnlockedToast';
import { StudyPlannerModal } from './components/StudyPlannerModal';
import { PersonalizedMaterialsModal } from './components/PersonalizedMaterialsModal';
import { PracticeTestModal } from './components/PracticeTestModal';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';

import { LayoutGrid, Sparkles, BookOpen, GraduationCap, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

function MainAppContent() {
  const [studentViewMode, setStudentViewMode] = useState<'modern' | 'classic'>('modern');
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [modules, setModules] = useState<CurriculumModule[]>(curriculumModules);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<Badge | null>(null);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(initialStudyTasks);
  const [selectedTestNote, setSelectedTestNote] = useState<FacultyNote | null>(null);

  const { currentUser, loading, studentProfile, updateStudentData, facultyNotes } = useAuth();
  const viewMode: ViewMode = studentProfile.role === 'admin'
    ? 'admin'
    : studentProfile.role === 'faculty'
      ? 'faculty'
      : studentViewMode;
  const setViewMode = (mode: ViewMode) => {
    if (studentProfile.role === 'student' && (mode === 'modern' || mode === 'classic')) {
      setStudentViewMode(mode);
    }
  };

  // Synchronize badges and study planner tasks with persisted profile
  useEffect(() => {
    if (studentProfile.earnedBadgeIds && studentProfile.earnedBadgeIds.length > 0) {
      setBadges((prev) =>
        prev.map((badge) =>
          studentProfile.earnedBadgeIds?.includes(badge.id)
            ? { ...badge, unlocked: true }
            : badge
        )
      );
    }

    if (studentProfile.studyPlannerTasks && studentProfile.studyPlannerTasks.length > 0) {
      setStudyTasks(studentProfile.studyPlannerTasks);
    }
  }, [studentProfile.earnedBadgeIds, studentProfile.studyPlannerTasks]);

  // Load modules and study tasks directly from persistent SQLite Database
  useEffect(() => {
    fetch('/api/curriculum/modules')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.modules?.length > 0) {
          setModules(data.modules);
        }
      })
      .catch((e) => console.warn('Could not load modules from database:', e));

    const uid = studentProfile.uid || 'student-001';
    fetch(`/api/tasks?userId=${uid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.tasks?.length > 0) {
          setStudyTasks(data.tasks);
        }
      })
      .catch((e) => console.warn('Could not load tasks from database:', e));
  }, [studentProfile.uid]);

  // Study Planner Task Handlers
  const handleAddTask = (newTaskData: Omit<StudyTask, 'id' | 'createdAt'>) => {
    const newTask: StudyTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, userId: studentProfile.uid || 'student-001' }),
    }).catch((e) => console.warn('Database task create error:', e));

    setStudyTasks((prev) => {
      const updated = [newTask, ...prev];
      updateStudentData({ studyPlannerTasks: updated });
      return updated;
    });
  };

  const handleToggleTask = (taskId: string) => {
    const target = studyTasks.find((t) => t.id === taskId);
    if (target) {
      const nextStatus = target.status === 'completed' ? 'pending' : 'completed';
      fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      }).catch((e) => console.warn('Database task toggle error:', e));
    }

    setStudyTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId
          ? { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' }
          : t
      );
      updateStudentData({ studyPlannerTasks: updated });
      return updated;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' }).catch((e) =>
      console.warn('Database task delete error:', e)
    );

    setStudyTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      updateStudentData({ studyPlannerTasks: updated });
      return updated;
    });
  };

  // Helper to unlock badges with celebrations and Firestore sync
  const unlockBadge = async (badgeId: string) => {
    setBadges((prev) => {
      const target = prev.find((b) => b.id === badgeId);
      if (target && !target.unlocked) {
        const updated: Badge = {
          ...target,
          unlocked: true,
          unlockedAt: 'Just now',
          progress: {
            current: target.progress ? target.progress.max : 1,
            max: target.progress ? target.progress.max : 1,
            label: 'Completed & Verified',
          },
        };

        // Show celebratory toast
        setJustUnlockedBadge(updated);

        // Update Firestore user document
        const currentUnlockedIds = prev
          .filter((b) => b.unlocked || b.id === badgeId)
          .map((b) => b.id);
        const newTotalXp = prev.reduce(
          (acc, b) => acc + (b.unlocked || b.id === badgeId ? b.xpReward : 0),
          0
        );

        updateStudentData({
          earnedBadgeIds: currentUnlockedIds,
          totalXp: newTotalXp,
        });

        return prev.map((b) => (b.id === badgeId ? updated : b));
      }
      return prev;
    });
  };

  // State update handlers synced with SQLite database
  const handleDiagnosticComplete = async (newMastery: number, newTier: string, scorePercent?: number) => {
    fetch('/api/diagnostics/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: studentProfile.uid || 'student-001',
        score: Math.round((newMastery / 100) * 4),
        totalQuestions: 4,
        bloomTier: newTier,
      }),
    }).catch((e) => console.warn('Database diagnostic submit error:', e));

    await updateStudentData({
      masteryIndex: newMastery,
      bloomTier: newTier,
      bloomTierNote: newTier.includes('Synthesis') ? 'Top 4% of engineering cohort' : 'Calibrated for deep reasoning',
      lastRecalibrated: 'Just now',
    });

    if (scorePercent !== undefined && scorePercent >= 75) {
      unlockBadge('badge-diag-ace');
    }
    if (newTier.includes('Synthesis') || newMastery >= 90) {
      unlockBadge('badge-bloom-l4');
    }
  };

  const handleSessionComplete = async () => {
    fetch('/api/curriculum/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleId: 'module-2',
        status: 'mastered',
        masteryScore: 92,
      }),
    }).catch((e) => console.warn('Database module progress error:', e));

    await updateStudentData({
      masteryIndex: Math.min(100, studentProfile.masteryIndex + 2),
      lastRecalibrated: 'Just now',
    });

    setModules((prev) =>
      prev.map((mod) =>
        mod.id === 'module-2'
          ? { ...mod, status: 'mastered', masteryScore: 92, buttonLabel: 'Review Session' }
          : mod
      )
    );

    unlockBadge('badge-backprop-master');

    const totalMastered = modules.filter((m) => m.status === 'mastered' || m.id === 'module-2').length;
    if (totalMastered >= 3) {
      unlockBadge('badge-curriculum-pioneer');
    }
  };

  const handleUpdatePace = async (newPace: number, newDesc: string) => {
    await updateStudentData({
      paceFactor: newPace,
      paceDescription: newDesc,
    });

    if (newPace >= 2.5) {
      unlockBadge('badge-hyper-pace');
    }
  };

  const handleLabExecution = () => {
    unlockBadge('badge-cuda-kernel');
  };

  const handleLaunchPracticeTestFromNote = (note: FacultyNote) => {
    setSelectedTestNote(note);
    setActiveModal('practice-test');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm font-semibold text-slate-600">Verifying your institutional account...</div>;
  }

  if (!currentUser) return <AuthModal />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation remains scoped to the authenticated role. */}
      <TopNavigationBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* Main Content Area based on ViewMode */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Email Verification Alert Prompt if account unverified */}
        <EmailVerificationBanner />

        {/* IF ADMIN PORTAL */}
        {viewMode === 'admin' ? (
          <AdminDashboardView />
        ) : viewMode === 'faculty' ? (
          /* IF FACULTY PORTAL */
          <FacultyPortalView 
            onOpenPracticeTest={handleLaunchPracticeTestFromNote}
          />
        ) : viewMode === 'classic' ? (
          /* IF CLASSIC CODETANTRA VIEW */
          <ClassicPortalView
            onToggleViewMode={() => setViewMode('modern')}
            onOpenModal={(modal) => setActiveModal(modal)}
          />
        ) : (
          /* MODERN STUDENT ADAPTIVE LEARNING PORTAL */
          <>
            {/* Top Metrics Hero */}
            <HeroAdaptiveMetrics
              profile={studentProfile}
              onOpenModal={(modal) => setActiveModal(modal)}
            />

            {/* AI Personalized Notes & Faculty Courseware Highlight Banner */}
            <div className="bg-linear-to-r from-[#15173c] via-[#1e2356] to-[#15173c] text-white rounded-2xl p-5 shadow-lg border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-extrabold shadow-inner flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                      Faculty Notes Synthesized by AI
                    </span>
                    <span className="text-xs text-indigo-200">
                      {facultyNotes.length} Courseware Units Live
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight mt-1">
                    AI Decomposed Courseware, Unit-Wise Priority &amp; Visual Mental Models
                  </h3>
                  <p className="text-xs text-indigo-200/90 mt-0.5">
                    Dr. K. Ramesh uploaded Unit 2 Notes: Multivariate Backpropagation &amp; Vector Jacobian Products. AI decomposed formulas into computation graph flows.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  onClick={() => setActiveModal('personalized-study-materials')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap active:scale-98"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore AI Study Materials</span>
                </button>
                <button
                  onClick={() => {
                    const sampleNote = facultyNotes[0];
                    if (sampleNote) handleLaunchPracticeTestFromNote(sampleNote);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap active:scale-98"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Take Practice Test</span>
                </button>
              </div>
            </div>

            {/* Academic Workspaces Grid (Courses, Tests, Labs, Tools) */}
            <AcademicWorkspacesGrid
              onOpenModal={(modal) => setActiveModal(modal)}
            />

            {/* Weekly Study Planner Component */}
            <WeeklyStudyPlanner
              tasks={studyTasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenModal={(modal) => setActiveModal(modal)}
            />

            {/* Achievements Section on the User Dashboard */}
            <AchievementsSection
              badges={badges}
              onOpenModal={(modal) => {
                if (modal === 'matrix-calculus') unlockBadge('badge-matrix-virtuoso');
                if (modal === 'tools-suite' || modal === 'loss-explorer') unlockBadge('badge-loss-explorer');
                setActiveModal(modal);
              }}
            />

            {/* Explanation & Feedback Banner */}
            <AdaptiveExplanationBanner
              onOpenModal={(modal) => setActiveModal(modal)}
            />

            {/* 2-Column: Main Curriculum Timeline (70%) + Diagnostic Sidebar (30%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <CurriculumTimeline
                  modules={modules}
                  onOpenModal={(modal) => setActiveModal(modal)}
                />
              </div>

              <div className="lg:col-span-4">
                <DiagnosticSidebar
                  insights={initialInsights}
                  resources={recommendedResources}
                  onOpenModal={(modal) => setActiveModal(modal)}
                />
              </div>
            </div>
          </>
        )}

      </main>

      <InstitutionalFooter />

      {/* Floating View Switcher Quick Toggle */}
      {studentProfile.role === 'student' && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'modern' ? 'classic' : 'modern')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#15173c] hover:bg-slate-900 text-white rounded-full shadow-xl border border-indigo-400/30 text-xs font-bold transition-all hover:scale-105 active:scale-95 group"
            title="Toggle student layout"
          >
            <LayoutGrid className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>{viewMode === 'classic' ? 'Modern AdaptIQ UI' : 'CodeTantra Classic'}</span>
          </button>
        </div>
      )}

      {/* FIREBASE / RBAC AUTHENTICATION MODAL */}
      <AuthModal />

      {/* AI PERSONALIZED STUDY MATERIALS MODAL */}
      <PersonalizedMaterialsModal
        isOpen={activeModal === 'personalized-study-materials'}
        onClose={() => setActiveModal(null)}
        onLaunchTest={handleLaunchPracticeTestFromNote}
      />

      {/* ADAPTIVE PRACTICE TEST MODAL */}
      <PracticeTestModal
        isOpen={activeModal === 'practice-test'}
        onClose={() => setActiveModal(null)}
        note={selectedTestNote || facultyNotes[0] || null}
      />

      {/* ACHIEVEMENTS MODAL */}
      <AchievementsModal
        isOpen={activeModal === 'achievements'}
        onClose={() => setActiveModal(null)}
        badges={badges}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* WEEKLY STUDY PLANNER MODAL */}
      <StudyPlannerModal
        isOpen={activeModal === 'study-planner'}
        onClose={() => setActiveModal(null)}
        tasks={studyTasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* CELEBRATION TOAST WHEN BADGE IS UNLOCKED */}
      <AchievementUnlockedToast
        badge={justUnlockedBadge}
        onClose={() => setJustUnlockedBadge(null)}
      />

      {/* INTERACTIVE MODALS */}
      <BackpropSessionModal
        isOpen={activeModal === 'backprop-session'}
        onClose={() => setActiveModal(null)}
        onSessionComplete={handleSessionComplete}
      />

      <DiagnosticRunnerModal
        isOpen={activeModal === 'diagnostic'}
        onClose={() => setActiveModal(null)}
        onDiagnosticComplete={handleDiagnosticComplete}
      />

      <CloudLabIdeModal
        isOpen={activeModal === 'cloud-lab'}
        onClose={() => setActiveModal(null)}
        onLabExecutionComplete={handleLabExecution}
      />

      <MatrixCalculusModal
        isOpen={activeModal === 'matrix-calculus'}
        onClose={() => setActiveModal(null)}
      />

      <ToolsSuiteModal
        isOpen={activeModal === 'tools-suite' || activeModal === 'loss-explorer'}
        onClose={() => setActiveModal(null)}
        initialTab="loss-surface"
      />

      <CoursesModal
        isOpen={activeModal === 'courses'}
        onClose={() => setActiveModal(null)}
        onOpenLab={() => setActiveModal('cloud-lab')}
      />

      <TestsModal
        isOpen={activeModal === 'tests'}
        onClose={() => setActiveModal(null)}
        onLaunchMockDiagnostic={() => setActiveModal('diagnostic')}
      />

      <MentorshipModal
        isOpen={activeModal === 'mentorship'}
        onClose={() => setActiveModal(null)}
      />

      <RefinePathModal
        isOpen={activeModal === 'refine-path'}
        onClose={() => setActiveModal(null)}
        currentPace={studentProfile.paceFactor}
        onUpdateSettings={handleUpdatePace}
      />

      <CommandPaletteModal
        isOpen={activeModal === 'command-palette'}
        onClose={() => setActiveModal(null)}
        onSelectAction={(modal) => setActiveModal(modal)}
        onToggleViewMode={() => setViewMode(viewMode === 'modern' ? 'classic' : 'modern')}
        viewMode={viewMode}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
