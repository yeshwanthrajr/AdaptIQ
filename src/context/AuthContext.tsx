import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  deleteUser,
  sendEmailVerification,
  reload,
  fbSignOut, 
  updateProfile, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  User 
} from '../lib/firebase';
import { 
  StudentProfile, 
  UserRole, 
  UserAccountStatus, 
  FacultyNote, 
  Announcement, 
  SystemActivityLog,
  AIPersonalizedNotes
} from '../types';
import { initialStudentProfile } from '../data/curriculumData';
import { 
  initialUsersList, 
  initialFacultyNotes, 
  initialAnnouncements, 
  initialActivityLogs 
} from '../data/initialRbacData';

interface AuthContextType {
  currentUser: User | null;
  studentProfile: StudentProfile;
  loading: boolean;
  
  // RBAC lists
  allUsers: StudentProfile[];
  facultyNotes: FacultyNote[];
  announcements: Announcement[];
  activityLogs: SystemActivityLog[];

  // Authentication & OTP
  loginWithEmail: (email: string, pass: string, expectedRole: UserRole) => Promise<void>;
  loginWithGoogle: (expectedRole: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmailOtp: (email: string, enteredOtp: string) => Promise<boolean>;
  registerWithOtp: (params: {
    name: string;
    email: string;
    mobile: string;
    role: UserRole;
    department: string;
    designationOrSemester: string;
    rollOrEmpNumber: string;
    password?: string;
  }) => Promise<{ success: boolean; message: string; requiresApproval: boolean }>;

  // Firebase Email Verification Flow
  sendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  checkEmailVerificationStatus: () => Promise<boolean>;

  // Admin Controls
  approveUser: (uid: string) => Promise<void>;
  rejectUser: (uid: string) => Promise<void>;

  // Faculty Materials & AI Personalizer
  uploadFacultyNote: (note: Omit<FacultyNote, 'id' | 'uploadDate' | 'isAiPersonalized'>) => Promise<FacultyNote>;
  personalizeNoteWithAi: (noteId: string) => Promise<AIPersonalizedNotes>;

  // Announcements & Activity
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  addActivityLog: (log: Omit<SystemActivityLog, 'id' | 'timestamp'>) => void;

  // Profile data update
  updateStudentData: (updates: Partial<StudentProfile>) => Promise<void>;

  // Modal controls
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'signup' | 'role_select') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup' | 'role_select';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(initialStudentProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const authActionInProgress = useRef(false);
  
  // RBAC Global State
  const [allUsers, setAllUsers] = useState<StudentProfile[]>(initialUsersList);
  const [facultyNotes, setFacultyNotes] = useState<FacultyNote[]>(initialFacultyNotes);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [activityLogs, setActivityLogs] = useState<SystemActivityLog[]>(initialActivityLogs);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'role_select'>('login');

  const openAuthModal = (mode: 'login' | 'signup' | 'role_select' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    if (!currentUser) return;
    setIsAuthModalOpen(false);
  };

  const addActivityLog = (log: Omit<SystemActivityLog, 'id' | 'timestamp'>) => {
    const newLog: SystemActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const syncUserProfile = async (user: User): Promise<StudentProfile> => {
    if (!user.email) throw new Error('The authenticated account did not provide an email address.');

    const token = await user.getIdToken();
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: user.displayName || '' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to verify your institutional account. Try again later.');
    const account = data.user as StudentProfile;
    if (account.status !== 'active') {
      throw new Error(account.status === 'pending_approval'
        ? 'Your account is awaiting administrator approval.'
        : 'This account is not active. Contact your administrator.');
    }
    if (!account.emailVerified && !user.emailVerified) {
      throw new Error('Verify this email address before signing in.');
    }

    const profile = { ...account, emailVerified: Boolean(account.emailVerified || user.emailVerified) };
    setStudentProfile(profile);
    setAllUsers((previous) => {
      const exists = previous.some((item) => item.email.toLowerCase() === profile.email.toLowerCase());
      return exists
        ? previous.map((item) => item.email.toLowerCase() === profile.email.toLowerCase() ? profile : item)
        : [...previous, profile];
    });

    if (profile.role === 'admin') {
      try {
        const usersResponse = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        const usersData = await usersResponse.json();
        if (usersResponse.ok && usersData.success) setAllUsers(usersData.users);
      } catch (err) {
        console.warn('Administrator user-list sync notice:', err);
      }
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: profile.email,
        name: profile.name,
        role: profile.role,
        status: profile.status,
        emailVerified: profile.emailVerified,
        isEmailVerified: profile.emailVerified,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore profile sync notice:', err);
    }

    return profile;
  };

  // Load full state from persistent SQLite database on mount
  useEffect(() => {
    const fetchDatabaseState = async () => {
      try {
        const [notesRes, annRes, logsRes] = await Promise.all([
          fetch('/api/faculty/notes').then((r) => r.json()).catch(() => null),
          fetch('/api/announcements').then((r) => r.json()).catch(() => null),
          fetch('/api/activity-logs').then((r) => r.json()).catch(() => null),
        ]);

        if (notesRes?.success && notesRes.notes) {
          setFacultyNotes(notesRes.notes);
        }
        if (annRes?.success && annRes.announcements) {
          setAnnouncements(annRes.announcements);
        }
        if (logsRes?.success && logsRes.activityLogs) {
          setActivityLogs(logsRes.activityLogs);
        }
      } catch (err) {
        console.warn('Backend SQLite sync notice (using defaults):', err);
      }
    };

    fetchDatabaseState();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (authActionInProgress.current) return;
      if (!user) {
        setCurrentUser(null);
        setStudentProfile(initialStudentProfile);
        setIsAuthModalOpen(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profile = await syncUserProfile(user);
        setStudentProfile(profile);
        setCurrentUser(user);
        setIsAuthModalOpen(false);
      } catch (err) {
        console.warn('Rejected restored authentication session:', err);
        await fbSignOut(auth);
        setCurrentUser(null);
        setStudentProfile(initialStudentProfile);
        setIsAuthModalOpen(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendEmailOtp = async (email: string) => {
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send a verification code.');
    return result as { success: boolean; message: string };
  };

  const verifyEmailOtp = async (email: string, enteredOtp: string) => {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: enteredOtp }),
    });
    return response.ok;
  };

  // Register with server-verified OTP and administrator approval routing
  const registerWithOtp = async (params: {
    name: string;
    email: string;
    mobile: string;
    role: UserRole;
    department: string;
    designationOrSemester: string;
    rollOrEmpNumber: string;
    password?: string;
  }) => {
    if (!params.password || params.password.length < 8) {
      throw new Error('Choose a password with at least 8 characters.');
    }

    authActionInProgress.current = true;
    let firebaseUser: User | null = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, params.email.trim(), params.password);
      firebaseUser = cred.user;
      const token = await cred.user.getIdToken();
      const dbResp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          uid: cred.user.uid,
          name: params.name,
          email: params.email,
          mobile: params.mobile,
          role: params.role,
          department: params.department,
          designationOrSemester: params.designationOrSemester,
          rollOrEmpNumber: params.rollOrEmpNumber,
        }),
      });
      const dbData = await dbResp.json();
      if (!dbResp.ok || !dbData.user) {
        throw new Error(dbData.error || 'The account could not be registered. Please try again.');
      }

      const newUserProfile = dbData.user as StudentProfile;
      await updateProfile(cred.user, { displayName: params.name });
      setAllUsers((previous) => [newUserProfile, ...previous.filter((item) => item.email.toLowerCase() !== newUserProfile.email.toLowerCase())]);

      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: newUserProfile.email,
          name: newUserProfile.name,
          role: newUserProfile.role,
          status: newUserProfile.status,
          otpVerified: true,
          emailVerified: true,
          isEmailVerified: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore profile sync notice:', err);
      }

      addActivityLog({
        userName: params.name,
        userEmail: params.email,
        userRole: params.role,
        action: `New ${params.role.toUpperCase()} registered after email OTP verification. Status: Awaiting Administrator approval.`,
        deviceInfo: navigator.userAgent,
        status: 'PENDING',
      });

      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('Could not clear the temporary registration session:', err);
      }
      setCurrentUser(null);
      setStudentProfile(initialStudentProfile);

      return {
        success: true,
        message: `Email verified. Your ${params.role} account is awaiting administrator approval.`,
        requiresApproval: true,
      };
    } catch (err) {
      if (firebaseUser && auth.currentUser) {
        try {
          await deleteUser(auth.currentUser);
        } catch (deleteErr) {
          console.warn('Could not remove the incomplete Firebase account:', deleteErr);
          await fbSignOut(auth);
        }
      }
      throw err;
    } finally {
      authActionInProgress.current = false;
    }
  };

  // Approve Pending User (Admin only)
  const approveUser = async (uid: string) => {
    if (!currentUser) throw new Error('Sign in with an administrator account to approve users.');
    const token = await currentUser.getIdToken();
    const response = await fetch(`/api/admin/users/${uid}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to approve this account.');

    setAllUsers((prev) =>
      prev.map((user) => {
        if (user.uid === uid) {
          const approved: StudentProfile = {
            ...user,
            status: 'active',
            approvedAt: new Date().toISOString().split('T')[0],
            approvedBy: studentProfile.name || 'Academic Administrator',
          };

          // Also update current active profile if it matches
          if (studentProfile.uid === uid) {
            setStudentProfile(approved);
          }

          // Try updating Firestore
          try {
            const userRef = doc(db, 'users', uid);
            updateDoc(userRef, {
              status: 'active',
              approvedAt: serverTimestamp(),
              approvedBy: studentProfile.name || 'Administrator',
            });
          } catch (e) {
            console.warn('Firestore write omitted for demo mock user:', e);
          }

          return approved;
        }
        return user;
      })
    );

    addActivityLog({
      userName: studentProfile.name,
      userEmail: studentProfile.email,
      userRole: 'admin',
      action: `Approved registration for user ID ${uid}. Access unlocked.`,
      status: 'SUCCESS',
    });
  };

  // Reject / Revoke User
  const rejectUser = async (uid: string) => {
    if (!currentUser) throw new Error('Sign in with an administrator account to reject users.');
    const token = await currentUser.getIdToken();
    const response = await fetch(`/api/admin/users/${uid}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to reject this account.');

    setAllUsers((prev) =>
      prev.map((user) =>
        user.uid === uid ? { ...user, status: 'rejected' } : user
      )
    );

    addActivityLog({
      userName: studentProfile.name,
      userEmail: studentProfile.email,
      userRole: 'admin',
      action: `Revoked/Rejected user ID ${uid}.`,
      status: 'WARNING',
    });
  };

  const loginWithEmail = async (email: string, pass: string, expectedRole: UserRole) => {
    authActionInProgress.current = true;
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await syncUserProfile(cred.user);
      if (profile.role !== expectedRole) {
        throw new Error(`This account belongs to the ${profile.role} portal. Select that portal to continue.`);
      }
      setStudentProfile(profile);
      setCurrentUser(cred.user);
      setIsAuthModalOpen(false);
    } catch (err) {
      if (auth.currentUser) await fbSignOut(auth);
      setCurrentUser(null);
      setStudentProfile(initialStudentProfile);
      throw err;
    } finally {
      authActionInProgress.current = false;
    }
  };

  const loginWithGoogle = async (expectedRole: UserRole) => {
    authActionInProgress.current = true;
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (!cred.user.emailVerified) throw new Error('Google did not confirm this email address as verified.');
      const profile = await syncUserProfile(cred.user);
      if (profile.role !== expectedRole) {
        throw new Error(`This Google account belongs to the ${profile.role} portal.`);
      }
      setStudentProfile(profile);
      setCurrentUser(cred.user);
      setIsAuthModalOpen(false);
    } catch (err) {
      if (auth.currentUser) await fbSignOut(auth);
      setCurrentUser(null);
      setStudentProfile(initialStudentProfile);
      const firebaseCode = (err as { code?: string } | null)?.code;
      if (firebaseCode === 'auth/unauthorized-domain') {
        throw new Error('Google sign-in is blocked for this site. In Firebase Console, open Authentication > Settings > Authorized domains and add localhost (and your deployed hostname, if applicable).');
      }
      if (firebaseCode === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is disabled for this Firebase project. Enable the Google provider in Firebase Console > Authentication > Sign-in method.');
      }
      if (firebaseCode === 'auth/popup-blocked') {
        throw new Error('Your browser blocked the Google sign-in popup. Allow popups for this site and try again.');
      }
      if (firebaseCode === 'auth/popup-closed-by-user') {
        throw new Error('The Google sign-in window was closed before sign-in finished. Try again and complete the Google prompt.');
      }
      throw err;
    } finally {
      authActionInProgress.current = false;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Signout completed locally:', e);
    }
    setCurrentUser(null);
    setStudentProfile(initialStudentProfile);
    setIsAuthModalOpen(true);
  };

  // 1. Send / Resend Firebase Email Verification link
  const sendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
    const targetEmail = currentUser?.email || studentProfile.email;
    const uid = currentUser?.uid || studentProfile.uid;

    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
      } catch (err: any) {
        console.warn('Firebase sendEmailVerification notification:', err);
        if (err.code === 'auth/too-many-requests') {
          return {
            success: false,
            message: 'A verification link was recently dispatched. Firebase limits frequent requests; please check your inbox or wait 2 minutes.',
          };
        }
      }
    }

    const sentTimestamp = new Date().toISOString();

    setStudentProfile((prev) => ({
      ...prev,
      emailVerificationSentAt: sentTimestamp,
    }));

    setAllUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === targetEmail.toLowerCase() || (uid && u.uid === uid)
          ? { ...u, emailVerificationSentAt: sentTimestamp }
          : u
      )
    );

    if (uid) {
      try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          emailVerificationSentAt: serverTimestamp(),
          isEmailVerified: false,
          emailVerified: false,
        });
      } catch (e) {
        console.warn('Firestore updateDoc note:', e);
      }
    }

    addActivityLog({
      userName: studentProfile.name,
      userEmail: targetEmail,
      userRole: studentProfile.role,
      action: `Firebase Authentication verification link dispatched to ${targetEmail}`,
      deviceInfo: navigator.userAgent,
      status: 'SUCCESS',
    });

    return {
      success: true,
      message: `Firebase verification link sent to ${targetEmail}. Please check your inbox and click the verification link.`,
    };
  };

  // 2. Check if user clicked email verification link (via reload)
  const checkEmailVerificationStatus = async (): Promise<boolean> => {
    if (currentUser) {
      try {
        await reload(currentUser);
        if (currentUser.emailVerified) {
          setStudentProfile((profile) => ({ ...profile, emailVerified: true }));
          return true;
        }
      } catch (err) {
        console.warn('Could not reload Firebase user state:', err);
      }
    }

    return studentProfile.emailVerified ?? false;
  };

  const updateStudentData = async (updates: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updates }));

    const uid = currentUser?.uid;
    if (uid && currentUser) {
      try {
        const token = await currentUser.getIdToken();
        await fetch(`/api/users/${uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn('Backend SQLite update notice:', err);
      }
    }

    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore update note:', err);
      }
    }
  };

  // Upload Faculty Note
  const uploadFacultyNote = async (note: Omit<FacultyNote, 'id' | 'uploadDate' | 'isAiPersonalized'>): Promise<FacultyNote> => {
    let newNote: FacultyNote = {
      ...note,
      id: `note-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      isAiPersonalized: false,
    };

    try {
      const resp = await fetch('/api/faculty/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      const data = await resp.json();
      if (data.note) {
        newNote = data.note;
      }
    } catch (e) {
      console.warn('Backend SQLite faculty note persistence notice:', e);
    }

    setFacultyNotes((prev) => [newNote, ...prev]);

    addActivityLog({
      userName: studentProfile.name,
      userEmail: studentProfile.email,
      userRole: 'faculty',
      action: `Uploaded lecture notes: "${newNote.title}" for ${newNote.unit}`,
      status: 'SUCCESS',
    });

    return newNote;
  };

  // Trigger AI Personalizer on Notes
  const personalizeNoteWithAi = async (noteId: string): Promise<AIPersonalizedNotes> => {
    const targetNote = facultyNotes.find((n) => n.id === noteId);
    if (!targetNote) {
      throw new Error('Note not found');
    }

    try {
      const response = await fetch('/api/ai/personalize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesText: targetNote.rawContent,
          subject: targetNote.subject,
          unit: targetNote.unit,
          unitName: targetNote.unitName,
          targetStudentCohort: {
            masteryIndex: 84,
            bloomTier: 'L4 • Synthesis',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to personalize notes via AI service');
      }

      const result = await response.json();
      const aiData: AIPersonalizedNotes = result.data;

      setFacultyNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, isAiPersonalized: true, aiData } : n
        )
      );

      addActivityLog({
        userName: studentProfile.name,
        userEmail: studentProfile.email,
        userRole: 'faculty',
        action: `AI synthesized notes into ${aiData.priorityConcepts.length} priority concepts, mental models, and ${aiData.practiceAssessment.length} practice questions.`,
        status: 'SUCCESS',
      });

      return aiData;
    } catch (err: any) {
      console.error('Error personalizing note with AI:', err);
      // Fallback
      const fallbackAiData = initialFacultyNotes[0].aiData!;
      setFacultyNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, isAiPersonalized: true, aiData: fallbackAiData } : n
        )
      );
      return fallbackAiData;
    }
  };

  // Announcements
  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    addActivityLog({
      userName: studentProfile.name,
      userEmail: studentProfile.email,
      userRole: studentProfile.role,
      action: `Published announcement: "${newAnn.title}" for ${newAnn.targetRole}`,
      status: 'SUCCESS',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        loading,
        allUsers,
        facultyNotes,
        announcements,
        activityLogs,
        loginWithEmail,
        loginWithGoogle,
        logout,
        sendEmailOtp,
        verifyEmailOtp,
        registerWithOtp,
        sendVerificationEmail,
        checkEmailVerificationStatus,
        approveUser,
        rejectUser,
        uploadFacultyNote,
        personalizeNoteWithAi,
        createAnnouncement,
        addActivityLog,
        updateStudentData,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
