import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Phone, 
  Check, 
  X, 
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { StudentProfile } from '../types';

interface AdminApprovalQueueProps {
  initialRoleFilter?: 'all' | 'student' | 'faculty';
  onUserApproved?: (uid: string) => void;
  onUserRejected?: (uid: string) => void;
  showHeader?: boolean;
}

export const AdminApprovalQueue: React.FC<AdminApprovalQueueProps> = ({
  initialRoleFilter = 'all',
  onUserApproved,
  onUserRejected,
  showHeader = true,
}) => {
  const { allUsers, approveUser, rejectUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'faculty'>(initialRoleFilter);
  const [processingUid, setProcessingUid] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'danger' | 'info';
    message: string;
  } | null>(null);

  // Rejection dialog state
  const [userToReject, setUserToReject] = useState<StudentProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Extract all pending registrations
  const allPending = allUsers.filter((u) => u.status === 'pending_approval');
  const pendingStudents = allPending.filter((u) => u.role === 'student');
  const pendingFaculty = allPending.filter((u) => u.role === 'faculty');

  // Filter based on selected tab and search term
  const displayedPending = allPending.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesRole;

    const matchesName = u.name.toLowerCase().includes(term);
    const matchesEmail = u.email.toLowerCase().includes(term);
    const matchesDept = (u.department || '').toLowerCase().includes(term);
    const matchesRoll = (u.rollOrEmpNumber || '').toLowerCase().includes(term);
    const matchesMobile = (u.mobile || '').toLowerCase().includes(term);

    return matchesRole && (matchesName || matchesEmail || matchesDept || matchesRoll || matchesMobile);
  });

  const showToast = (type: 'success' | 'danger' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const handleApprove = async (user: StudentProfile) => {
    if (!user.uid) return;
    setProcessingUid(user.uid);
    try {
      await approveUser(user.uid);
      showToast('success', `Approved ${user.name} (${user.role.toUpperCase()}) — portal access activated.`);
      if (onUserApproved) onUserApproved(user.uid);
    } catch {
      showToast('danger', `Failed to approve ${user.name}. Please check connectivity.`);
    } finally {
      setProcessingUid(null);
    }
  };

  const confirmReject = async () => {
    if (!userToReject || !userToReject.uid) return;
    const targetUid = userToReject.uid;
    const targetName = userToReject.name;
    setProcessingUid(targetUid);
    try {
      await rejectUser(targetUid);
      showToast('danger', `Rejected application for ${targetName}. Registration revoked.`);
      if (onUserRejected) onUserRejected(targetUid);
      setUserToReject(null);
      setRejectReason('');
    } catch {
      showToast('danger', `Failed to reject user ${targetName}.`);
    } finally {
      setProcessingUid(null);
    }
  };

  const handleApproveAllVisible = async () => {
    if (displayedPending.length === 0) return;
    const confirmBatch = window.confirm(
      `Are you sure you want to approve all ${displayedPending.length} pending registration(s)?`
    );
    if (!confirmBatch) return;

    for (const user of displayedPending) {
      if (user.uid) {
        await approveUser(user.uid);
      }
    }
    showToast('success', `Successfully approved ${displayedPending.length} registration(s).`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden" id="admin-approval-queue">
      
      {/* Header with Title, Stats & Batch Actions */}
      {showHeader && (
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Institutional Membership Approval Queue
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify credentials, identity tokens, and authorize student and faculty enrollment into courseware.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{allPending.length} Pending Verification</span>
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{pendingStudents.length} Students</span>
              </span>
            </div>

            {displayedPending.length > 1 && (
              <button
                onClick={handleApproveAllVisible}
                id="btn-approve-all-pending"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve All ({displayedPending.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Status Notification Toast */}
      {notification && (
        <div className={`mx-5 mt-4 p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : notification.type === 'danger'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {notification.type === 'danger' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            {notification.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Role Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              roleFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Pending ({allPending.length})
          </button>
          <button
            onClick={() => setRoleFilter('student')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              roleFilter === 'student'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Students ({pendingStudents.length})</span>
          </button>
          <button
            onClick={() => setRoleFilter('faculty')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              roleFilter === 'faculty'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty ({pendingFaculty.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, roll no, email..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table / List View */}
      {displayedPending.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-3">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100 shadow-2xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {searchTerm 
              ? 'No matching pending registrations found' 
              : 'All Registration Requests Cleared'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {searchTerm 
              ? `No registrations match "${searchTerm}". Try resetting your search filter.`
              : 'There are no pending accounts waiting for authorization. When new students or faculty complete OTP verification during registration, they will appear here.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-3">Role &amp; Academic Status</th>
                <th className="py-3 px-3">Department &amp; Institution</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Verification Badge</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedPending.map((user) => {
                const isProcessing = processingUid === user.uid;

                return (
                  <tr 
                    key={user.uid || user.email} 
                    className="hover:bg-slate-50/80 transition-colors group"
                    id={`approval-row-${user.uid || user.email}`}
                  >
                    {/* Applicant Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0 ${
                          user.role === 'faculty' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            ID: {user.rollOrEmpNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Academic Status */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          user.role === 'faculty' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {user.role === 'faculty' ? (
                            <Briefcase className="w-3 h-3" />
                          ) : (
                            <GraduationCap className="w-3 h-3" />
                          )}
                          <span>{user.role}</span>
                        </span>
                        <div className="text-[11px] text-slate-500">
                          {user.designation || user.semester || 'Applicant'}
                        </div>
                      </div>
                    </td>

                    {/* Department & Institution */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="text-slate-800 font-semibold">{user.department}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{user.institution}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="text-slate-800 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="font-mono text-[11px]">{user.email}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{user.mobile || 'No Mobile'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>OTP Verified</span>
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            user.emailVerified
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {user.emailVerified ? (
                              <>
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                <span>Email Verified</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Email Unverified</span>
                              </>
                            )}
                          </span>
                        </div>
                        {user.createdAt && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>Applied: {user.createdAt}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions: Approve & Reject */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(user)}
                          disabled={isProcessing}
                          id={`btn-approve-${user.uid}`}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                          title={`Approve ${user.name}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setUserToReject(user)}
                          disabled={isProcessing}
                          id={`btn-reject-${user.uid}`}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200/60 flex items-center gap-1"
                          title={`Reject ${user.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal for Rejecting Applicant */}
      {userToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reject Institutional Registration
                </h3>
                <p className="text-xs text-slate-500">
                  This will revoke credentials for this applicant.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><strong>Applicant:</strong> {userToReject.name}</div>
              <div><strong>Role:</strong> <span className="uppercase font-bold text-indigo-700">{userToReject.role}</span></div>
              <div><strong>Email:</strong> {userToReject.email}</div>
              <div><strong>Roll/Emp ID:</strong> {userToReject.rollOrEmpNumber || 'N/A'}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Rejection (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Unverified enrollment number or invalid departmental email..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUserToReject(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                id="btn-confirm-reject-applicant"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
