import React, { useState } from 'react';
import { ActiveModal } from '../types';
import { useAuth } from '../context/AuthContext';
import { Home, HelpCircle, LogOut, LogIn, ChevronDown, Sparkles, ArrowRightLeft, ShieldCheck, User } from 'lucide-react';

interface ClassicPortalViewProps {
  onToggleViewMode: () => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const ClassicPortalView: React.FC<ClassicPortalViewProps> = ({
  onToggleViewMode,
  onOpenModal,
}) => {
  const [userDropdown, setUserDropdown] = useState(false);
  const { currentUser, studentProfile, logout, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans">
      
      {/* Top Header Bar - CodeTantra Easwari Header */}
      <header className="bg-[#2f3d4a] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo and Home */}
            <div className="flex items-center gap-4">
              <div className="bg-white px-2.5 py-1 rounded flex items-center gap-2 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-rose-800 flex items-center justify-center text-white font-serif font-black text-[9px]">
                  E
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-tight text-[#7a1c1d] leading-none uppercase">
                    Easwari
                  </span>
                  <span className="text-[7px] font-bold text-slate-600 leading-none">
                    Engineering College
                  </span>
                </div>
              </div>

              <button 
                onClick={() => onOpenModal(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700/50 px-2.5 py-1.5 rounded transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>

            {/* User details and actions */}
            <div className="flex items-center gap-3">
              {/* Switch to AdaptIQ Modern LMS */}
              <button
                onClick={onToggleViewMode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors"
                title="Switch to Modern AdaptIQ View"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Modern AdaptIQ View</span>
              </button>

              {/* User Dropdown or Log In */}
              {currentUser ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white font-medium focus:outline-none"
                    >
                      <span className="hidden md:inline truncate max-w-[200px]">{currentUser.email}</span>
                      <span className="md:hidden">Profile</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {userDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-xl z-50 p-2 border border-slate-200 text-xs">
                        <div className="p-2 border-b border-slate-100 font-medium">
                          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase mb-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Logged In (Firebase)</span>
                          </div>
                          <p className="font-bold text-slate-900">{studentProfile.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                          <p className="text-[10px] text-indigo-600">{studentProfile.department}</p>
                        </div>
                        <button 
                          onClick={() => { setUserDropdown(false); onOpenModal('courses'); }}
                          className="w-full text-left p-2 hover:bg-slate-100 rounded"
                        >
                          My Subjects &amp; Labs
                        </button>
                        <button 
                          onClick={() => { setUserDropdown(false); onOpenModal('achievements'); }}
                          className="w-full text-left p-2 hover:bg-amber-50 text-amber-900 font-semibold rounded flex items-center justify-between"
                        >
                          <span>Badges &amp; Credentials</span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-bold">XP</span>
                        </button>
                        <button 
                          onClick={() => { setUserDropdown(false); onOpenModal('study-planner'); }}
                          className="w-full text-left p-2 hover:bg-indigo-50 text-indigo-900 font-semibold rounded flex items-center justify-between"
                        >
                          <span>Weekly Study Planner</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1 py-0.2 rounded font-bold">Tasks</span>
                        </button>
                        <button 
                          onClick={() => { setUserDropdown(false); onOpenModal('tests'); }}
                          className="w-full text-left p-2 hover:bg-slate-100 rounded"
                        >
                          Scheduled Examinations
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={async () => { setUserDropdown(false); await logout(); }}
                          className="w-full text-left p-2 text-rose-600 hover:bg-rose-50 rounded font-semibold flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Support */}
                  <button 
                    onClick={() => onOpenModal('mentorship')}
                    className="text-xs text-slate-200 hover:text-white font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Support</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={async () => await logout()}
                    className="flex items-center gap-1 bg-[#d9383a] hover:bg-[#c22d2f] text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                  >
                    <span>Logout</span>
                    <LogOut className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded transition-colors"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded transition-colors"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Container - 5 CodeTantra Cards */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col justify-center">
        
        {!currentUser && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-indigo-950 font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>You are exploring as a Guest. Log in or create an account to save your academic progress and lab submissions to Cloud Firestore.</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded border border-indigo-300 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded transition-colors shadow-2xs"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Courses */}
              <div 
                onClick={() => onOpenModal('courses')}
                className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Clean SVG Illustration - Student studying on laptop */}
                  <div className="w-48 h-36 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 200 150" className="w-full h-full">
                      {/* Background browser screen */}
                      <rect x="70" y="10" width="110" height="80" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                      <line x1="70" y1="26" x2="180" y2="26" stroke="#e2e8f0" strokeWidth="2" />
                      <circle cx="80" cy="18" r="3" fill="#cbd5e1" />
                      <circle cx="90" cy="18" r="3" fill="#cbd5e1" />
                      <circle cx="100" cy="18" r="3" fill="#cbd5e1" />
                      <rect x="110" y="36" width="55" height="10" rx="2" fill="#e2e8f0" />
                      <rect x="110" y="52" width="45" height="6" rx="1" fill="#f1f5f9" />
                      <circle cx="95" cy="50" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

                      {/* Student on floor with laptop */}
                      {/* Legs */}
                      <path d="M 40 120 C 50 120, 60 135, 75 135 C 85 135, 95 125, 90 115" fill="none" stroke="#2f3d4a" strokeWidth="8" strokeLinecap="round" />
                      {/* Torso */}
                      <path d="M 50 115 L 45 75 C 45 65, 55 60, 65 65 L 70 100 Z" fill="#e2e8f0" />
                      {/* Head */}
                      <circle cx="58" cy="48" r="12" fill="#2f3d4a" />
                      {/* Arm & Laptop */}
                      <path d="M 55 75 L 75 95 L 90 95" fill="none" stroke="#2f3d4a" strokeWidth="5" strokeLinecap="round" />
                      <polygon points="78,95 100,95 95,80 82,80" fill="#64748b" />
                      <line x1="82" y1="80" x2="95" y2="80" stroke="#94a3b8" strokeWidth="2" />

                      {/* Small leaf/decor */}
                      <path d="M 125 125 Q 128 115 135 118 Q 128 128 125 125" fill="#f97316" />
                      <path d="M 127 125 Q 123 115 116 118 Q 123 128 127 125" fill="#d97706" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Click here to view all your courses/subjects
                  </p>
                </div>

                <div className="bg-[#2f3d4a] group-hover:bg-[#24313c] text-white text-center py-2.5 text-xs font-semibold tracking-wide transition-colors">
                  Courses
                </div>
              </div>

              {/* Card 2: Tests */}
              <div 
                onClick={() => onOpenModal('tests')}
                className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Clean SVG Illustration - Students taking tests at desks */}
                  <div className="w-48 h-36 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 200 150" className="w-full h-full">
                      {/* Student 1 Desk */}
                      <rect x="25" y="80" width="60" height="45" rx="3" fill="#cbd5e1" opacity="0.4" />
                      <line x1="30" y1="95" x2="80" y2="95" stroke="#94a3b8" strokeWidth="4" />
                      <line x1="35" y1="95" x2="35" y2="135" stroke="#2f3d4a" strokeWidth="4" />
                      <line x1="75" y1="95" x2="75" y2="135" stroke="#2f3d4a" strokeWidth="4" />

                      {/* Student 1 Head and Body */}
                      <circle cx="55" cy="45" r="14" fill="#2f3d4a" />
                      <path d="M 40 90 L 55 60 L 70 90 Z" fill="#d97706" />
                      <rect x="45" y="85" width="20" height="15" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

                      {/* Student 2 Desk */}
                      <rect x="115" y="80" width="60" height="45" rx="3" fill="#cbd5e1" opacity="0.4" />
                      <line x1="120" y1="95" x2="170" y2="95" stroke="#94a3b8" strokeWidth="4" />
                      <line x1="125" y1="95" x2="125" y2="135" stroke="#2f3d4a" strokeWidth="4" />
                      <line x1="165" y1="95" x2="165" y2="135" stroke="#2f3d4a" strokeWidth="4" />

                      {/* Student 2 Head and Body */}
                      <circle cx="145" cy="45" r="14" fill="#2f3d4a" />
                      <path d="M 130 90 L 145 60 L 160 90 Z" fill="#334155" />
                      <rect x="135" y="85" width="20" height="15" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Click here to view all your scheduled and completed tests
                  </p>
                </div>

                <div className="bg-[#2f3d4a] group-hover:bg-[#24313c] text-white text-center py-2.5 text-xs font-semibold tracking-wide transition-colors">
                  Tests
                </div>
              </div>

              {/* Card 3: Programming Labs */}
              <div 
                onClick={() => onOpenModal('cloud-lab')}
                className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Clean SVG Illustration - Programming Lab student */}
                  <div className="w-48 h-36 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 200 150" className="w-full h-full">
                      {/* Left and right schematic callouts */}
                      <rect x="15" y="30" width="30" height="8" rx="2" fill="#cbd5e1" />
                      <line x1="45" y1="34" x2="65" y2="45" stroke="#cbd5e1" strokeWidth="1.5" />
                      <rect x="155" y="30" width="30" height="8" rx="2" fill="#cbd5e1" />
                      <line x1="155" y1="34" x2="135" y2="45" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Student head & hair */}
                      <circle cx="100" cy="45" r="16" fill="#2f3d4a" />
                      <path d="M 85 45 Q 100 30 115 45" fill="#2f3d4a" />
                      <path d="M 75 90 C 75 68, 125 68, 125 90 Z" fill="#cbd5e1" />

                      {/* Laptop */}
                      <rect x="75" y="85" width="50" height="30" rx="3" fill="#2f3d4a" />
                      <circle cx="100" cy="100" r="3.5" fill="#f8fafc" />
                      <rect x="68" y="115" width="64" height="4" rx="2" fill="#64748b" />

                      {/* Desk coffee cup and potted plant */}
                      <rect x="145" y="105" width="12" height="15" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                      <line x1="150" y1="100" x2="152" y2="95" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Click here to view all your programming labs
                  </p>
                </div>

                <div className="bg-[#2f3d4a] group-hover:bg-[#24313c] text-white text-center py-2.5 text-xs font-semibold tracking-wide transition-colors">
                  Programming Labs
                </div>
              </div>

            </div>

            {/* Bottom Row - 2 Cards Centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
              
              {/* Card 4: Tools */}
              <div 
                onClick={() => onOpenModal('tools-suite')}
                className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Clean SVG Illustration - Monitor, Tablet, Phone */}
                  <div className="w-48 h-36 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 200 150" className="w-full h-full">
                      {/* Big Monitor */}
                      <rect x="60" y="25" width="90" height="60" rx="3" fill="#d97706" stroke="#2f3d4a" strokeWidth="2" />
                      <rect x="95" y="85" width="20" height="20" fill="#2f3d4a" />
                      <rect x="85" y="105" width="40" height="6" rx="2" fill="#cbd5e1" />

                      {/* Tablet */}
                      <rect x="40" y="45" width="35" height="50" rx="3" fill="#d97706" stroke="#2f3d4a" strokeWidth="2" />

                      {/* Smartphone */}
                      <rect x="30" y="65" width="18" height="30" rx="2" fill="#d97706" stroke="#2f3d4a" strokeWidth="1.5" />

                      {/* Standing figure next to monitor */}
                      <circle cx="155" cy="50" r="8" fill="#2f3d4a" />
                      <path d="M 148 62 L 162 62 L 158 90 L 152 90 Z" fill="#2f3d4a" />
                      <line x1="152" y1="90" x2="150" y2="120" stroke="#2f3d4a" strokeWidth="3" />
                      <line x1="158" y1="90" x2="160" y2="120" stroke="#2f3d4a" strokeWidth="3" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Click here to access tools.
                  </p>
                </div>

                <div className="bg-[#2f3d4a] group-hover:bg-[#24313c] text-white text-center py-2.5 text-xs font-semibold tracking-wide transition-colors">
                  Tools
                </div>
              </div>

              {/* Card 5: Help & Support */}
              <div 
                onClick={() => onOpenModal('mentorship')}
                className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Clean SVG Illustration - Help, Phone, Mail bubbles */}
                  <div className="w-48 h-36 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 200 150" className="w-full h-full">
                      {/* Speech/Channel Bubbles */}
                      <circle cx="65" cy="55" r="14" fill="#2f3d4a" />
                      <path d="M 60 58 L 65 48 L 70 58 Z" fill="#ffffff" />
                      
                      <circle cx="100" cy="55" r="16" fill="#2f3d4a" />
                      <rect x="92" y="50" width="16" height="10" rx="1" fill="#f97316" />

                      <circle cx="135" cy="55" r="14" fill="#2f3d4a" />
                      <path d="M 130 50 C 130 48, 140 48, 140 50 C 140 56, 134 60, 130 58" fill="none" stroke="#f97316" strokeWidth="2" />

                      {/* Small people sitting beneath */}
                      <line x1="20" y1="110" x2="180" y2="110" stroke="#f1f5f9" strokeWidth="4" />
                      <circle cx="90" cy="95" r="5" fill="#2f3d4a" />
                      <circle cx="120" cy="95" r="5" fill="#2f3d4a" />
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Click here to reach us
                  </p>
                </div>

                <div className="bg-[#2f3d4a] group-hover:bg-[#24313c] text-white text-center py-2.5 text-xs font-semibold tracking-wide transition-colors">
                  Help &amp; Support
                </div>
              </div>

            </div>

          </div>

      </main>

      {/* CodeTantra Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1">
          <span>© 2026</span>
          <span className="font-extrabold tracking-tight text-[#2f3d4a]">
            C<span className="text-amber-500">⊙</span>DETANTRA
          </span>
        </div>
      </footer>

    </div>
  );
};
