import React, { useState } from 'react';
import { StudyTask, TaskType, DayOfWeek, ActiveModal } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  Target, 
  FileCheck2, 
  Sparkles, 
  CalendarDays, 
  ListFilter, 
  Flame, 
  X,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface WeeklyStudyPlannerProps {
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenModal: (modal: ActiveModal) => void;
}

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DAY_LABELS: Record<DayOfWeek, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export const WeeklyStudyPlanner: React.FC<WeeklyStudyPlannerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onOpenModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<TaskType>('module_review');
  const [newDay, setNewDay] = useState<DayOfWeek>('Wed');
  const [newTimeSlot, setNewTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'normal'>('medium');
  const [targetAction, setTargetAction] = useState<ActiveModal>('backprop-session');

  // Computed stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalMinutes = tasks.reduce((acc, t) => acc + (t.durationMinutes || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Filtered tasks
  const filteredTasks = selectedDay === 'ALL' 
    ? tasks 
    : tasks.filter((t) => t.day === selectedDay);

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'lab_session':
        return <Terminal className="w-4 h-4 text-emerald-600" />;
      case 'diagnostic_prep':
        return <Target className="w-4 h-4 text-amber-600" />;
      case 'exam_revision':
        return <FileCheck2 className="w-4 h-4 text-rose-600" />;
      case 'module_review':
      default:
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getTypeBadge = (type: TaskType) => {
    switch (type) {
      case 'lab_session':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Cloud Lab
          </span>
        );
      case 'diagnostic_prep':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Diagnostic Prep
          </span>
        );
      case 'exam_revision':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Exam Revision
          </span>
        );
      case 'module_review':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Module Review
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'normal') => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-200">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
            Medium
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
            Regular
          </span>
        );
    }
  };

  // Presets helper
  const handlePresetSelect = (presetKey: string) => {
    switch (presetKey) {
      case 'backprop':
        setNewTitle('Module 2: Backpropagation Computation Graph Review');
        setNewType('module_review');
        setTargetAction('backprop-session');
        setNewDuration(90);
        setNewNotes('Derive forward pass & reverse-mode chain rule on computation graph.');
        break;
      case 'lab-autograd':
        setNewTitle('Cloud Lab: PyTorch Autograd Engine Unit Tests');
        setNewType('lab_session');
        setTargetAction('cloud-lab');
        setNewDuration(60);
        setNewNotes('Benchmark GPU memory footprint and pass autograd assertions.');
        break;
      case 'matrix-tensor':
        setNewTitle('Matrix Calculus: Kronecker Products & Jacobian Proofs');
        setNewType('module_review');
        setTargetAction('matrix-calculus');
        setNewDuration(60);
        setNewNotes('Review tensor matrix identities required for neural layer backprop.');
        break;
      case 'diagnostic-check':
        setNewTitle('Adaptive Cognitive Diagnostic: Neural Systems');
        setNewType('diagnostic_prep');
        setTargetAction('diagnostic');
        setNewDuration(45);
        setNewNotes('5-Minute calibration to preserve Bloom Taxonomy Tier L4 standing.');
        break;
      case 'loss-explorer':
        setNewTitle('Loss Surface Explorer: Non-Convex Optimizer Simulation');
        setNewType('lab_session');
        setTargetAction('tools-suite');
        setNewDuration(45);
        setNewNotes('Compare SGD vs Adam optimizer convergence in non-convex valleys.');
        break;
      case 'exam-midterm':
        setNewTitle('DL Midterm II: Full Curriculum Syllabus Revision');
        setNewType('exam_revision');
        setTargetAction('tests');
        setNewDuration(120);
        setNewNotes('Review Foundations, Computational Graphs, and Optimization.');
        break;
      default:
        break;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      type: newType,
      day: newDay,
      dateStr: DAY_LABELS[newDay],
      timeSlot: newTimeSlot,
      durationMinutes: newDuration,
      status: 'pending',
      notes: newNotes.trim() || undefined,
      priority: newPriority,
      targetActionModal: targetAction,
      moduleName: newType === 'lab_session' ? 'Cloud Lab IDE' : 'Neural Systems Curriculum',
    });

    // Reset & close
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#15173c] rounded-[14px] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Weekly Study Planner
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Paced Learning Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Plan and execute structured curriculum reviews, interactive computing sessions, and scheduled mock labs
            </p>
          </div>
        </div>

        {/* Weekly Progress & Schedule Action */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          {/* Progress metric */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3.5 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Weekly Target
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {completedTasks}/{totalTasks} Done ({completionRate}%)
              </span>
            </div>
            <div className="w-16 sm:w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="pl-2 border-l border-slate-200 text-right">
              <span className="text-xs font-bold text-indigo-700">{totalHours}h</span>
              <span className="text-[9px] block text-slate-400">Allocated</span>
            </div>
          </div>

          {/* Schedule Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow flex items-center gap-1.5 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Day Selector Ribbon & View Switcher */}
      <div className="flex items-center justify-between gap-3 pt-4 pb-3 flex-wrap border-b border-slate-100">
        
        {/* Days Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedDay('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDay === 'ALL'
                ? 'bg-[#15173c] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Entire Week ({tasks.length})
          </button>

          {DAYS.map((day) => {
            const dayTasks = tasks.filter((t) => t.day === day);
            const isDaySelected = selectedDay === day;
            const hasCompleted = dayTasks.some((t) => t.status === 'completed');

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isDaySelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{day}</span>
                {dayTasks.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isDaySelected
                      ? 'bg-indigo-800 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {dayTasks.length}
                  </span>
                )}
                {hasCompleted && !isDaySelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              viewMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>7-Day Grid</span>
          </button>
        </div>

      </div>

      {/* Main Tasks Display */}
      {viewMode === 'timeline' ? (
        /* TIMELINE AGENDA VIEW */
        <div className="mt-4 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No study sessions scheduled for {selectedDay === 'ALL' ? 'this week' : DAY_LABELS[selectedDay]}</p>
              <p className="text-[11px] text-slate-400 mt-1">Click "Schedule Session" above to add module reviews or lab tasks.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`rounded-xl border p-3.5 sm:p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  {/* Left: Checkbox + Details */}
                  <div className="flex items-start gap-3 flex-grow">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                      title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-indigo-600" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {task.day}
                        </span>
                        {getTypeBadge(task.type)}
                        {getPriorityBadge(task.priority)}
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.timeSlot} ({task.durationMinutes}m)</span>
                        </span>
                      </div>

                      <h3 className={`text-sm font-bold tracking-tight ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </h3>

                      {task.notes && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action to open corresponding Modal + Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    {task.targetActionModal && (
                      <button
                        onClick={() => onOpenModal(task.targetActionModal!)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-98 ${
                          task.type === 'lab_session'
                            ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600'
                            : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600'
                        }`}
                      >
                        {getTaskIcon(task.type)}
                        <span>
                          {task.type === 'lab_session' ? 'Launch Lab' : 
                           task.type === 'diagnostic_prep' ? 'Start Diagnostic' :
                           task.type === 'exam_revision' ? 'Exam Revision' : 'Start Review'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* 7-DAY GRID VIEW */
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS.map((day) => {
            const dayTasks = tasks.filter((t) => t.day === day);
            const isToday = day === 'Mon'; // Visual marker

            return (
              <div
                key={day}
                className={`rounded-xl border p-3 flex flex-col justify-between min-h-[220px] transition-all ${
                  isToday 
                    ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs' 
                    : 'bg-slate-50/60 border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-800">{day}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                          task.status === 'completed'
                            ? 'bg-white/60 border-slate-200 opacity-75'
                            : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300'
                        }`}
                        onClick={() => {
                          if (task.targetActionModal) {
                            onOpenModal(task.targetActionModal);
                          } else {
                            onToggleTask(task.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9px] font-extrabold uppercase text-slate-400">
                            {task.durationMinutes}m
                          </span>
                          <span className="text-[9px] font-bold text-indigo-600 truncate">
                            {task.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className={`text-xs font-bold line-clamp-2 leading-tight ${
                          task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}>
                          {task.title}
                        </p>
                      </div>
                    ))}

                    {dayTasks.length === 0 && (
                      <div className="py-6 text-center text-[11px] text-slate-400 font-medium">
                        Free Day
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewDay(day);
                    setShowAddModal(true);
                  }}
                  className="mt-3 w-full py-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold bg-white/70 hover:bg-white rounded border border-indigo-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* SCHEDULE NEW SESSION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-[#15173c] text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Schedule Weekly Study Session
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Add scheduled module reviews, hands-on lab practice, or diagnostic drills
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              
              {/* Quick Curriculum Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quick Curriculum Presets:
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('backprop')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors"
                  >
                    Backprop Review (90m)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('lab-autograd')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors"
                  >
                    CUDA Cloud Lab (60m)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('matrix-tensor')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-colors"
                  >
                    Matrix Calculus (60m)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('diagnostic-check')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 transition-colors"
                  >
                    Diagnostic Drill (45m)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('exam-midterm')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors"
                  >
                    DL Midterm Revision
                  </button>
                </div>
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Session Topic / Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Module 2: Multivariate Chain Rule & Gradient Graphs"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Session Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const type = e.target.value as TaskType;
                      setNewType(type);
                      if (type === 'lab_session') setTargetAction('cloud-lab');
                      else if (type === 'diagnostic_prep') setTargetAction('diagnostic');
                      else if (type === 'exam_revision') setTargetAction('tests');
                      else setTargetAction('backprop-session');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value="module_review">Module Curriculum Review</option>
                    <option value="lab_session">Cloud Lab IDE Session</option>
                    <option value="diagnostic_prep">Diagnostic Knowledge Check</option>
                    <option value="exam_revision">Midterm Examination Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'normal')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="normal">Regular</option>
                  </select>
                </div>
              </div>

              {/* Day, Time Slot & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{DAY_LABELS[d]} ({d})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Window
                  </label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
                    <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                    <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                    <option value="06:30 PM - 08:00 PM">06:30 PM - 08:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes (1 hr)</option>
                    <option value={90}>90 Minutes (1.5 hr)</option>
                    <option value={120}>120 Minutes (2 hr)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preparation Notes &amp; Objectives
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g., Focus on numerical stability of softmax and backpropagation derivations..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Weekly Schedule</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
