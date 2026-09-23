import React, { useState } from 'react';
import { ViewMode, ActiveModal, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Bell, 
  Terminal, 
  BookOpen, 
  FileCheck2, 
  Cpu, 
  BarChart3, 
  ArrowRightLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';

interface TopNavigationBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  viewMode,
  setViewMode,
  activeNav,
  setActiveNav,
  onOpenModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { 
    currentUser, 
    studentProfile, 
    logout, 
    openAuthModal, 
    loginAsDemoUser,
    announcements,
    allUsers 
  } = useAuth();

  const displayName = studentProfile.name || 'Yashwanth Raj';
  const displayEmail = studentProfile.email || 'student@easwari.edu';
  const userRole = studentProfile.role || 'student';
  const pendingCount = allUsers.filter((u) => u.status === 'pending_approval').length;

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'YR';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left Section: Logo & Institutional Identity */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={() => {
                if (userRole === 'admin') setViewMode('admin');
                else if (userRole === 'faculty') setViewMode('faculty');
                else setViewMode('modern');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#15173c] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  AdaptIQ
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600">
                  {userRole === 'admin' ? 'Admin Governance' : userRole === 'faculty' ? 'Faculty Portal' : 'Adaptive LMS'}
                </span>
              </div>
            </button>

            {/* Institution Badge & Role Chip */}
            <div className="hidden lg:flex items-center border-l border-slate-200 pl-3 py-1 gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Easwari Engineering College
              </span>

              {/* Active Role Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide border ${
                userRole === 'admin' 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : userRole === 'faculty'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                {userRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                {userRole === 'faculty' && <Briefcase className="w-3.5 h-3.5 text-emerald-600" />}
                {userRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{userRole}</span>
              </span>
            </div>
          </div>

          {/* Quick 1-Click Role Switcher for Test Evaluators */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => {
                loginAsDemoUser('student');
                setViewMode('modern');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                userRole === 'student' && viewMode === 'modern'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/80'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('faculty');
                setViewMode('faculty');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                userRole === 'faculty' || viewMode === 'faculty'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-white/80'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>

            <button
              onClick={() => {
                loginAsDemoUser('admin');
                setViewMode('admin');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all relative ${
                userRole === 'admin' || viewMode === 'admin'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-amber-700 hover:bg-white/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
              )}
            </button>
          </div>

          {/* Center Section: Primary Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden xl:flex items-center space-x-1">
            {[
              { name: 'Learning Path', modal: null },
              { name: 'AI Study Materials', modal: 'personalized-study-materials' as ActiveModal },
              { name: 'Assessments', modal: 'tests' as ActiveModal },
              { name: 'Cloud Labs', modal: 'cloud-lab' as ActiveModal },
              { name: 'Achievements', modal: 'achievements' as ActiveModal },
              { name: 'Planner', modal: 'study-planner' as ActiveModal },
            ].map((item) => {
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveNav(item.name);
                    if (item.modal) {
                      onOpenModal(item.modal);
                    }
                  }}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'text-indigo-600 bg-indigo-50/90 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Mode Toggle, Search, Notifications, Profile */}
          <div className="flex items-center gap-2">
            
            {/* Global Search Bar with Keyboard Shortcut */}
            <div 
              onClick={() => onOpenModal('command-palette')}
              className="relative hidden lg:flex items-center w-40 xl:w-52 cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                readOnly
                type="text"
                placeholder="Search..."
                className="w-full text-xs pl-7 pr-10 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white focus:outline-none cursor-pointer text-slate-700 transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <kbd className="px-1 text-[9px] font-semibold text-slate-400 bg-white border border-slate-200 rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                title="Announcements & Alerts"
              >
                <Bell className="w-4.5 h-4.5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 text-left animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Institutional Announcements</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
                    {announcements.slice(0, 3).map((ann) => (
                      <div
                        key={ann.id}
                        className={`p-2.5 rounded-lg border text-left ${
                          ann.isUrgent
                            ? 'bg-rose-50/70 border-rose-200'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className={`font-bold ${ann.isUrgent ? 'text-rose-700' : 'text-indigo-700'}`}>
                            {ann.authorName}
                          </span>
                          <span className="text-slate-400">{ann.date}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs">{ann.title}</h5>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-[#15173c] border-2 border-indigo-400 flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {userRole} • {studentProfile.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2.5 text-left animate-fadeIn">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        userRole === 'admin' ? 'bg-amber-100 text-amber-800' :
                        userRole === 'faculty' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {userRole} Account
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>OTP Verified</span>
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{displayEmail}</p>
                    <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                      {studentProfile.department}
                    </p>

                    {/* Email Verification Status */}
                    <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 border-t border-slate-200/70">
                      <span className="text-slate-500 font-medium">Email Verification:</span>
                      <span className={`font-bold flex items-center gap-1 ${
                        studentProfile.emailVerified ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {studentProfile.emailVerified ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Unverified</span>
                          </>
                        )}
                      </span>
                    </div>

                    {!studentProfile.emailVerified && (
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          const el = document.getElementById('email-verification-alert-banner') || document.getElementById('email-unverified-pill');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="mt-2 w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Complete Email Verification</span>
                      </button>
                    )}
                  </div>
                  
                  {/* View Switching Links */}
                  <div className="space-y-1 text-xs">
                    <button 
                      onClick={() => { setShowProfileMenu(false); setViewMode('modern'); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold flex items-center justify-between ${
                        viewMode === 'modern' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Student Adaptive Dashboard</span>
                      </span>
                    </button>

                    <button 
                      onClick={() => { setShowProfileMenu(false); setViewMode('faculty'); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold flex items-center justify-between ${
                        viewMode === 'faculty' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Faculty Courseware &amp; AI Studio</span>
                      </span>
                    </button>

                    <button 
                      onClick={() => { setShowProfileMenu(false); setViewMode('admin'); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg font-semibold flex items-center justify-between ${
                        viewMode === 'admin' ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Academic Admin Governance</span>
                      </span>
                      {pendingCount > 0 && (
                        <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-black">
                          {pendingCount}
                        </span>
                      )}
                    </button>

                    <button 
                      onClick={() => { setShowProfileMenu(false); setViewMode(viewMode === 'classic' ? 'modern' : 'classic'); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span>{viewMode === 'classic' ? 'Switch to Modern UI' : 'CodeTantra Classic Portal'}</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 my-1.5"></div>

                  <div className="space-y-1 text-xs">
                    <button 
                      onClick={() => { setShowProfileMenu(false); onOpenModal('personalized-study-materials'); }}
                      className="w-full text-left px-3 py-1.5 text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold flex items-center justify-between"
                    >
                      <span>AI Personalized Notes</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-black">AI</span>
                    </button>

                    <button 
                      onClick={() => { setShowProfileMenu(false); onOpenModal('achievements'); }}
                      className="w-full text-left px-3 py-1.5 text-amber-700 hover:bg-amber-50 rounded-lg font-semibold flex items-center justify-between"
                    >
                      <span>Badges &amp; Achievements</span>
                    </button>

                    <button 
                      onClick={() => { setShowProfileMenu(false); onOpenModal('study-planner'); }}
                      className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg font-medium flex items-center justify-between"
                    >
                      <span>Weekly Study Planner</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 my-1.5"></div>

                  <div className="flex items-center justify-between px-1">
                    <button 
                      onClick={() => { setShowProfileMenu(false); openAuthModal('signup'); }}
                      className="text-xs text-indigo-600 hover:underline font-bold"
                    >
                      + Register Role
                    </button>

                    <button 
                      onClick={async () => { setShowProfileMenu(false); await logout(); }}
                      className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
