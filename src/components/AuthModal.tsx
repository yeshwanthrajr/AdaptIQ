import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building, 
  Phone, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    loginWithEmail, 
    loginWithGoogle,
    loginAsDemoUser,
    sendEmailOtp,
    verifyEmailOtp,
    registerWithOtp,
    sendVerificationEmail,
    checkEmailVerificationStatus,
    simulateEmailVerification,
    studentProfile
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'role_select'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science and Engineering');
  const [regDesignation, setRegDesignation] = useState('Semester 6');
  const [regRollNumber, setRegRollNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // OTP Verification state
  const [otpStep, setOtpStep] = useState<'details' | 'verify_otp' | 'awaiting_approval'>('details');
  const [generatedOtpHint, setGeneratedOtpHint] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(300);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode when modal opens
  React.useEffect(() => {
    if (authModalMode === 'signup') {
      setMode('signup');
    } else {
      setMode('login');
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpStep('details');
  }, [authModalMode, isAuthModalOpen]);

  // Handle countdown timer for OTP
  React.useEffect(() => {
    let timer: any;
    if (otpStep === 'verify_otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

  if (!isAuthModalOpen) return null;

  // Handle Standard Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        throw new Error('Please enter both email and password.');
      }
      await loginWithEmail(loginEmail.trim(), loginPassword);
      setSuccessMsg('Successfully authenticated!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 1: Send OTP for Registration
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regMobile.trim()) {
      setErrorMsg('Please enter Full Name, Email, and Mobile Number.');
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMsg('Please enter a valid academic email address.');
      return;
    }

    const res = sendEmailOtp(regEmail.trim(), regMobile.trim());
    setGeneratedOtpHint(res.generatedOtp);
    setOtpSentMessage(res.message);
    setEnteredOtp(res.generatedOtp); // Prefill for easy testing
    setCountdown(300);
    setOtpStep('verify_otp');
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const isValid = verifyEmailOtp(regEmail, enteredOtp);
      if (!isValid) {
        throw new Error('Invalid OTP. Please check the 6-digit code sent to your email.');
      }

      const res = await registerWithOtp({
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim(),
        role: selectedRole,
        department: regDepartment,
        designationOrSemester: regDesignation,
        rollOrEmpNumber: regRollNumber || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
        password: regPassword,
      });

      setOtpStep('awaiting_approval');
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#15173c] text-white p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 font-bold">
              {mode === 'login' ? <KeyRound className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {mode === 'login' ? 'Institutional Role Authentication' : 'New Academic Member Registration'}
                </h3>
              </div>
              <p className="text-xs text-indigo-200">
                Easwari Engineering College • AdaptIQ AI Learning Portal
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-600 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Role Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setOtpStep('details'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'border-indigo-600 text-indigo-600 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Register with OTP &amp; Approval</span>
          </button>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="m-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {mode === 'login' && (
          <div className="p-5 space-y-4">
            
            {/* Quick 1-Click Role Switcher for Test Evaluators */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 block mb-2">
                ⚡ Quick Demo Persona Switcher (Instant Evaluation):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loginAsDemoUser('student')}
                  className="p-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-500 text-left transition-all shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Student</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">Yashwanth Raj</p>
                </button>

                <button
                  type="button"
                  onClick={() => loginAsDemoUser('faculty')}
                  className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 text-left transition-all shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Faculty</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">Dr. K. Ramesh</p>
                </button>

                <button
                  type="button"
                  onClick={() => loginAsDemoUser('admin')}
                  className="p-2 rounded-lg bg-white border border-amber-200 hover:border-amber-500 text-left transition-all shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">Dr. S. K. Narayanan</p>
                </button>
              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institutional Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@easwari.edu or prof.ramesh@easwari.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                {submitting ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            {/* Google Alternative */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">Or Continue With</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google Workspace</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: REGISTER WITH EMAIL OTP & ADMIN APPROVAL */}
        {mode === 'signup' && (
          <div className="p-5 space-y-4">
            
            {/* Step 1: Basic Details */}
            {otpStep === 'details' && (
              <form onSubmit={handleSendOtp} className="space-y-3">
                
                {/* Select Academic Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Your Role in Institution:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setSelectedRole('student'); setRegDesignation('Semester 6'); }}
                      className={`py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedRole === 'student'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-extrabold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs">Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSelectedRole('faculty'); setRegDesignation('Assistant Professor'); }}
                      className={`py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedRole === 'faculty'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-extrabold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs">Faculty</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSelectedRole('admin'); setRegDesignation('Administrator'); }}
                      className={`py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedRole === 'admin'
                          ? 'bg-amber-50 border-amber-600 text-amber-900 font-extrabold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span className="text-xs">Admin Staff</span>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g., Karthik Raja M."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="user@easwari.edu"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="+91 98405 67890"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Department & Designation/Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                    >
                      <option value="Computer Science and Engineering">Computer Science (CSE)</option>
                      <option value="Information Technology">Information Technology (IT)</option>
                      <option value="AI & Data Science">AI &amp; Data Science (AIDS)</option>
                      <option value="Electronics & Communication">Electronics (ECE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {selectedRole === 'student' ? 'Current Semester' : 'Designation / Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'Semester 6' : 'Associate Professor'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Roll / Employee ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'student' ? 'Roll / Register Number' : 'Employee ID / Staff Code'}
                  </label>
                  <input
                    type="text"
                    value={regRollNumber}
                    onChange={(e) => setRegRollNumber(e.target.value)}
                    placeholder={selectedRole === 'student' ? '310621104089' : 'FAC-CSE-118'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Verification Protocol:</span> An OTP will be dispatched to your email &amp; mobile. After OTP verification, your profile will be submitted to the Academic Administrator for final access approval.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send OTP Verification Code</span>
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {otpStep === 'verify_otp' && (
              <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                <div className="text-center p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-indigo-950">Verify 6-Digit Email OTP</h4>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    We dispatched an authentication code to <strong>{regEmail}</strong>
                  </p>
                  {generatedOtpHint && (
                    <div className="mt-2 inline-block bg-white px-2.5 py-1 rounded-md border border-indigo-300 text-[11px] font-mono font-bold text-indigo-900 shadow-2xs">
                      Simulation OTP: <span className="text-indigo-600 tracking-widest">{generatedOtpHint}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="482910"
                    className="w-full text-center tracking-widest font-mono text-lg py-2.5 px-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-black text-indigo-950 bg-indigo-50/20"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const res = sendEmailOtp(regEmail, regMobile);
                        setGeneratedOtpHint(res.generatedOtp);
                        setEnteredOtp(res.generatedOtp);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpStep('details')}
                    className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-grow py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Verifying...' : 'Verify OTP & Submit Registration'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Awaiting Admin Approval Notice */}
            {otpStep === 'awaiting_approval' && (
              <div className="text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-md">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Registration Verified &amp; Pending Admin Approval
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Your email (<span className="font-semibold text-slate-900">{regEmail}</span>) and mobile phone have been successfully verified.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-bold text-slate-900">{regName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Requested Role:</span>
                    <span className="font-bold uppercase text-indigo-700">{selectedRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800">{regDepartment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">SMS / Email OTP:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>OTP Verified</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Firebase Auth Verification:</span>
                    <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Link Dispatched to Inbox</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Institutional Clearance:</span>
                    <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      AWAITING ADMIN APPROVAL
                    </span>
                  </div>
                </div>

                {/* Email Verification Action Helper */}
                <div className="bg-amber-500/10 border border-amber-300/80 rounded-xl p-3 text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">Firebase Email Link Sent</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    A secure verification link was generated for <strong>{regEmail}</strong>. You can verify it via the incoming email or use instant verification for testing.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        await simulateEmailVerification();
                        setSuccessMsg('Email marked as verified in Firebase Authentication document!');
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Instant Verify Email (Demo)
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await sendVerificationEmail();
                        setSuccessMsg(res.message);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Resend Link
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      // Switch to admin demo so the user can immediately approve their registered user!
                      loginAsDemoUser('admin');
                    }}
                    className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Admin Portal to Approve Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
