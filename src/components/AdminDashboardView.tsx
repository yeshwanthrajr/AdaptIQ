import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminApprovalQueue } from './AdminApprovalQueue';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Bell, 
  Send, 
  Search, 
  Filter, 
  Activity, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../types';

export const AdminDashboardView: React.FC<{ onSwitchToFaculty?: () => void; onSwitchToStudent?: () => void }> = ({
  onSwitchToFaculty,
  onSwitchToStudent
}) => {
  const { 
    studentProfile, 
    allUsers, 
    activityLogs, 
    announcements, 
    approveUser, 
    rejectUser, 
    createAnnouncement,
    loginAsDemoUser 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'cohort' | 'audit' | 'announcements'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'faculty' | 'admin'>('all');

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTarget, setAnnTarget] = useState<'all' | 'student' | 'faculty'>('all');
  const [annUrgent, setAnnUrgent] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);

  // Computed metrics
  const totalStudents = allUsers.filter((u) => u.role === 'student').length;
  const totalFaculty = allUsers.filter((u) => u.role === 'faculty').length;
  const pendingApprovals = allUsers.filter((u) => u.status === 'pending_approval');
  const activeStudents = allUsers.filter((u) => u.role === 'student' && u.status === 'active');
  const avgProgress = activeStudents.length > 0 
    ? Math.round(activeStudents.reduce((acc, curr) => acc + curr.masteryIndex, 0) / activeStudents.length)
    : 84;

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.rollOrEmpNumber && u.rollOrEmpNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    await createAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      authorName: studentProfile.name || 'Academic Dean',
      authorRole: 'admin',
      targetRole: annTarget,
      isUrgent: annUrgent,
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner / Role Identifier */}
      <div className="bg-[#15173c] text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-extrabold shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  Institutional Governance Portal
                </span>
                <span className="text-xs text-indigo-300 font-medium">• Academic Deanery</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Academic Administration &amp; Access Control
              </h1>
              <p className="text-xs text-indigo-200 mt-0.5">
                Logged in as <strong>{studentProfile.name}</strong> ({studentProfile.designation || 'Dean of Academics'}) • Easwari Engineering College
              </p>
            </div>
          </div>

          {/* Quick Persona Jump */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 px-2 font-medium hidden lg:inline">Switch Portal:</span>
            <button
              onClick={() => loginAsDemoUser('faculty')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty Portal</span>
            </button>
            <button
              onClick={() => loginAsDemoUser('student')}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Students</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+12 this semester</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cohort Progress</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{avgProgress}%</h3>
            <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-1 mt-1">
              <span>Avg Mastery Index</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Approvals</span>
            <h3 className={`text-2xl font-black mt-1 ${pendingApprovals.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingApprovals.length}
            </h3>
            <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>Requires validation</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">System Logins</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activityLogs.length}</h3>
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
              <Activity className="w-3 h-3 text-slate-400" />
              <span>Real-time tracked</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Pending Approvals</span>
          {pendingApprovals.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-black">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cohort')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'cohort'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Cohort &amp; Faculty Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Login &amp; Security Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Broadcast Announcements</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & PENDING APPROVALS SUMMARY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Urgent Approvals Callout */}
          {pendingApprovals.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950">
                      {pendingApprovals.length} New Member Registration{pendingApprovals.length > 1 ? 's' : ''} Awaiting Admin Approval
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Applicants have completed Email &amp; Mobile OTP verification. Under academic regulations, approve their accounts to grant them portal access.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap"
                >
                  Review Approvals
                </button>
              </div>
            </div>
          )}

          {/* Dual Column: Top Students Progress & Recent Audit Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Students Progress Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Student Progress &amp; Mastery Cohort</h3>
                </div>
                <button
                  onClick={() => setActiveTab('cohort')}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  View All ({totalStudents})
                </button>
              </div>

              <div className="space-y-3">
                {allUsers
                  .filter((u) => u.role === 'student' && u.status === 'active')
                  .slice(0, 4)
                  .map((student) => (
                    <div key={student.uid || student.email} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            {student.rollOrEmpNumber || 'Reg No'} • {student.department}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">{student.masteryIndex}%</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{student.bloomTier}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Login & Audit Feed */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent Login &amp; Portal Actions</h3>
                </div>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Full Audit Log
                </button>
              </div>

              <div className="space-y-2.5">
                {activityLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl border border-slate-100 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.userName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          log.userRole === 'admin' ? 'bg-amber-100 text-amber-800' :
                          log.userRole === 'faculty' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {log.userRole}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-snug">{log.action}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. PENDING APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <AdminApprovalQueue />
      )}

      {/* 3. COHORT ROSTER */}
      {activeTab === 'cohort' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrolled Students &amp; Faculty Roster</h3>
              <p className="text-xs text-slate-500">
                Track mastery scores, cognitive bloom tiers, and departmental assignments.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, roll..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Member</th>
                  <th className="py-3 px-3">Role &amp; Status</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">ID Number</th>
                  <th className="py-3 px-3">Mastery Progress</th>
                  <th className="py-3 px-3">Cognitive Tier</th>
                  <th className="py-3 px-3 text-right">Approval Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.uid || user.email} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          user.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                          user.role === 'faculty' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`text-[10px] font-bold ${user.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          • {user.status.toUpperCase()}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                          user.emailVerified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{user.department}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{user.rollOrEmpNumber || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${user.masteryIndex}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{user.masteryIndex}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-semibold">{user.bloomTier}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-[11px] text-slate-500">
                      {user.approvedAt ? `Approved ${user.approvedAt}` : 'Pending validation'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SECURITY & LOGIN AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Security &amp; User Login Access Log</h3>
            <p className="text-xs text-slate-500">
              Audit trail of every authentication, note publication, and role modification for institutional compliance.
            </p>
          </div>

          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{log.userName}</span>
                    <span className="text-slate-500 text-[11px]">({log.userEmail})</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      log.userRole === 'admin' ? 'bg-amber-100 text-amber-800' :
                      log.userRole === 'faculty' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {log.userRole}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                      log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{log.action}</p>
                  {log.deviceInfo && (
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-xl">{log.deviceInfo}</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-slate-500 font-medium">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Post Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Publish Institutional Notice</h3>
              <p className="text-xs text-slate-500">Broadcast updates to student dashboards or faculty portals.</p>
            </div>

            {annSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Notice broadcasted successfully!</span>
              </div>
            )}

            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g., End-Semester Examination Schedule"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={annTarget}
                  onChange={(e) => setAnnTarget(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                >
                  <option value="all">All Members (Students &amp; Faculty)</option>
                  <option value="student">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Enter detailed notice or instructions..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="annUrgent"
                  checked={annUrgent}
                  onChange={(e) => setAnnUrgent(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="annUrgent" className="text-xs font-bold text-slate-700">
                  Mark as High-Priority Notice
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Post Announcement</span>
              </button>
            </form>
          </div>

          {/* Active Announcements List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Active Board Broadcasts ({announcements.length})</h3>
              <p className="text-xs text-slate-500">Currently active on student and faculty notification centers.</p>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-xl border transition-all ${
                    ann.isUrgent
                      ? 'bg-rose-50/50 border-rose-200 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {ann.isUrgent && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-600 text-white">
                            Urgent
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-slate-200 text-slate-800">
                          Target: {ann.targetRole}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pt-1">{ann.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{ann.date}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Published by: <strong>{ann.authorName}</strong></span>
                    <span className="capitalize">{ann.authorRole} Authority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
