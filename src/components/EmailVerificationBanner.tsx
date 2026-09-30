import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RefreshCw, 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmailVerificationBanner: React.FC = () => {
  const { 
    currentUser, 
    studentProfile, 
    sendVerificationEmail, 
    checkEmailVerificationStatus
  } = useAuth();

  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already verified, do not show the unverified prompt
  const isVerified = Boolean(studentProfile.emailVerified || currentUser?.emailVerified);
  if (isVerified) {
    return null;
  }

  const handleSendVerification = async () => {
    setIsSending(true);
    setFeedback(null);
    try {
      const res = await sendVerificationEmail();
      setFeedback({
        type: res.success ? 'success' : 'info',
        message: res.message,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Unable to send verification link at this moment.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setFeedback(null);
    try {
      const verified = await checkEmailVerificationStatus();
      if (verified) {
        setFeedback({
          type: 'success',
          message: 'Email verification successfully confirmed! Academic record updated.',
        });
      } else {
        setFeedback({
          type: 'info',
          message: 'Email not yet verified. Please click the verification link in your inbox, then check again.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Status check failed. Please retry.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  // If dismissed temporarily, display an unobtrusive mini-bar or badge
  if (isDismissed) {
    return (
      <div 
        id="email-unverified-pill" 
        className="w-full bg-amber-500/10 border border-amber-300/60 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-amber-900 shadow-xs"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Email <strong>{studentProfile.email}</strong> is unverified.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDismissed(false)}
            className="text-xs font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
          >
            Show Verification Prompt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="email-verification-alert-banner"
      className="w-full bg-linear-to-r from-amber-50 via-orange-50/60 to-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
            <Mail className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300">
                Action Required • Email Unverified
              </span>
              <span className="text-xs font-mono font-medium text-slate-600">
                {studentProfile.email}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Verify your institutional email address for Firebase Authentication
            </h3>

            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Academic compliance and secure evaluation access require a verified email address. We sent a verification link to your inbox. Once verified, your academic portfolio, faculty notes, and adaptive learning diagnostics will synchronize permanently.
            </p>

            {/* Feedback notification banner if available */}
            {feedback && (
              <div 
                className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : feedback.type === 'error'
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                id="btn-send-verification-email"
                onClick={handleSendVerification}
                disabled={isSending}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                {isSending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Resend Verification Email</span>
              </button>

              <button
                id="btn-check-verification-status"
                onClick={handleCheckStatus}
                disabled={isChecking}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Check Status</span>
              </button>

            </div>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-amber-200/40 transition-colors cursor-pointer"
          title="Dismiss for this session"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
