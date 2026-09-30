import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { createHash, randomInt, timingSafeEqual, verify as verifySignature } from 'node:crypto';
import { initDatabase, dbService } from './database.js';
import firebaseConfig from './firebase-applet-config.json';

dotenv.config({ path: ['.env.local', '.env'] });

// Google Workspace email domains whose accounts are activated without manual administrator approval.
const googleAutoApproveDomains = (process.env.GOOGLE_AUTO_APPROVE_DOMAINS || '')
  .split(',')
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean);

// Emails allowed to bootstrap an administrator account through Google sign-in.
const bootstrapAdminEmails = (process.env.ADMIN_EMAILS || 'admin@easwari.edu')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const emailOtps = new Map<string, { hash: Buffer; expiresAt: number; attempts: number; sentAt: number }>();
const verifiedOtpEmails = new Map<string, number>();
const otpEmailCooldowns = new Map<string, number>();
const otpIpCooldowns = new Map<string, number>();
let firebaseSigningCertificates: Record<string, string> | null = null;
let firebaseSigningCertificatesExpireAt = 0;

async function verifyFirebaseIdToken(token: string, requireVerifiedEmail = true) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token.');

  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') throw new Error('Invalid token.');

  if (!firebaseSigningCertificates || firebaseSigningCertificatesExpireAt <= Date.now()) {
    const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    if (!response.ok) throw new Error('Unable to load Firebase signing certificates.');
    firebaseSigningCertificates = await response.json();
    const maxAge = Number(/max-age=(\d+)/i.exec(response.headers.get('cache-control') || '')?.[1] || 3600);
    firebaseSigningCertificatesExpireAt = Date.now() + maxAge * 1000;
  }

  const certificates = firebaseSigningCertificates;
  if (!certificates) throw new Error('Firebase signing certificates are unavailable.');
  const certificate = certificates[header.kid];
  const signatureIsValid = certificate && verifySignature(
    'RSA-SHA256',
    Buffer.from(`${parts[0]}.${parts[1]}`),
    certificate,
    Buffer.from(parts[2], 'base64url')
  );
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!signatureIsValid
    || claims.aud !== firebaseConfig.projectId
    || claims.iss !== `https://securetoken.google.com/${firebaseConfig.projectId}`
    || typeof claims.sub !== 'string'
    || claims.exp <= nowSeconds
    || claims.iat > nowSeconds
    || (requireVerifiedEmail && claims.email_verified !== true)
    || typeof claims.email !== 'string') {
    throw new Error('Invalid or unverified Firebase account.');
  }

  return claims as { sub: string; email: string };
}

const requireAdmin: express.RequestHandler = (req, res, next) => {
  const token = /^Bearer\s+(.+)$/i.exec(req.get('authorization') || '')?.[1];
  if (!token) return res.status(401).json({ error: 'Sign in with an administrator account to continue.' });

  void verifyFirebaseIdToken(token).then((claims) => {
    const account = dbService.getUserByEmail(claims.email);
    if (!account || account.role !== 'admin' || account.status !== 'active') {
      return res.status(403).json({ error: 'An active administrator account is required.' });
    }
    res.locals.authenticatedProfile = account;
    next();
  }).catch(() => {
    res.status(401).json({ error: 'The Firebase session could not be verified. Sign in again.' });
  });
};

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Derives a readable display name from an email local part, e.g. "k.ramesh+cse" -> "K Ramesh".
function deriveNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || '';
  const words = localPart
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(' ') || 'Google User';
}

async function startServer() {
  // Initialize persistent SQLite Database
  initDatabase();

  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // 1. SYSTEM HEALTH & DIAGNOSTICS ENDPOINTS
  // ==========================================
  app.get('/api/health', (req, res) => {
    try {
      const users = dbService.getAllUsers();
      const modules = dbService.getAllModules();
      const notes = dbService.getAllFacultyNotes();
      res.json({
        status: 'ok',
        database: 'SQLite (adaptiq.db connected via node:sqlite)',
        hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
        stats: {
          totalUsers: users.length,
          totalModules: modules.length,
          totalFacultyNotes: notes.length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });

  // ==========================================
  // 2. AUTHENTICATION & USER MANAGEMENT (DB)
  // ==========================================
  app.get('/api/users', (req, res) => {
    try {
      const users = dbService.getAllUsers();
      res.json({ success: true, users });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users/:uid', (req, res) => {
    try {
      const user = dbService.getUserById(req.params.uid);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { uid, name, email, mobile, role, department, designationOrSemester, rollOrEmpNumber } = req.body;
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      if (!uid || !normalizedEmail || !name || !['student', 'faculty'].includes(role)) {
        return res.status(400).json({ error: 'A Firebase account, name, email, and supported role are required.' });
      }

      const token = /^Bearer\s+(.+)$/i.exec(req.get('authorization') || '')?.[1];
      if (!token) return res.status(401).json({ error: 'A valid Firebase session is required to register.' });
      let claims: { sub: string; email: string };
      try {
        claims = await verifyFirebaseIdToken(token, false);
      } catch {
        return res.status(401).json({ error: 'The Firebase account could not be verified.' });
      }
      if (claims.sub !== uid || claims.email.toLowerCase() !== normalizedEmail) {
        return res.status(403).json({ error: 'The Firebase account does not match the OTP-verified email.' });
      }

      const existing = dbService.getUserByEmail(normalizedEmail);
      if (existing) {
        verifiedOtpEmails.delete(normalizedEmail);
        return res.status(409).json({ error: 'An account already exists for this email.' });
      }

      const otpExpiresAt = verifiedOtpEmails.get(normalizedEmail);
      if (!otpExpiresAt || otpExpiresAt <= Date.now()) {
        verifiedOtpEmails.delete(normalizedEmail);
        return res.status(403).json({ error: 'Verify the emailed code before registering.' });
      }
      verifiedOtpEmails.delete(normalizedEmail);

      const newUser = dbService.createUser({
        uid,
        name,
        email: normalizedEmail,
        mobile,
        role,
        status: 'pending_approval',
        department: department || 'Computer Science and Engineering',
        semester: role === 'student' ? designationOrSemester : 'Faculty',
        designation: designationOrSemester,
        rollOrEmpNumber,
        otpVerified: true,
        emailVerified: true,
      });

      dbService.addActivityLog({
        userName: name,
        userEmail: normalizedEmail,
        userRole: role,
        action: `New ${role} registered: Account saved to database; submitted for Deanery approval.`,
        status: 'PENDING',
      });

      res.json({ success: true, user: newUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/send-otp', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) {
      return res.status(503).json({ error: 'Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL on the server.' });
    }

    if (dbService.getUserByEmail(email)) {
      return res.status(409).json({ error: 'An account already exists for this email.' });
    }

    const now = Date.now();
    const lastEmailRequest = otpEmailCooldowns.get(email) || 0;
    if (now - lastEmailRequest < 60_000) {
      return res.status(429).json({ error: 'Please wait one minute before requesting another code.' });
    }

    const clientKey = req.ip || 'unknown';
    const lastClientRequest = otpIpCooldowns.get(clientKey) || 0;
    if (now - lastClientRequest < 15_000) {
      return res.status(429).json({ error: 'Please wait before requesting another verification code.' });
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: 'Your AdaptIQ verification code',
          text: `Your AdaptIQ verification code is ${code}. It expires in 5 minutes. If you did not request this code, ignore this email.`,
          html: `<p>Your AdaptIQ verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 5 minutes. If you did not request it, ignore this email.</p>`,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Resend email delivery failed:', await emailResponse.text());
        return res.status(502).json({ error: 'The verification email could not be sent. Check the mail service configuration and try again.' });
      }

      emailOtps.set(email, {
        hash: createHash('sha256').update(code).digest(),
        expiresAt: now + 5 * 60_000,
        attempts: 0,
        sentAt: now,
      });
      otpEmailCooldowns.set(email, now);
      otpIpCooldowns.set(clientKey, now);
      res.json({ success: true, message: `A verification code was sent to ${email}. It expires in 5 minutes.` });
    } catch (err: any) {
      console.error('Resend request failed:', err);
      res.status(502).json({ error: 'The verification email could not be sent. Try again later.' });
    }
  });

  app.post('/api/auth/verify-otp', (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    const record = emailOtps.get(email);
    if (!record || !/^\d{6}$/.test(code) || record.expiresAt <= Date.now()) {
      emailOtps.delete(email);
      return res.status(400).json({ error: 'The code is invalid or expired. Request a new code and try again.' });
    }

    const codeHash = createHash('sha256').update(code).digest();
    if (!timingSafeEqual(record.hash, codeHash)) {
      record.attempts += 1;
      if (record.attempts >= 5) emailOtps.delete(email);
      return res.status(400).json({ error: 'The code is incorrect or expired. Check your email and try again.' });
    }

    emailOtps.delete(email);
    verifiedOtpEmails.set(email, Date.now() + 10 * 60_000);
    res.json({ success: true, verified: true });
  });

  app.put('/api/users/:uid', (req, res) => {
    try {
      const updated = dbService.updateUser(req.params.uid, req.body);
      res.json({ success: true, user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/users/:uid/approve', requireAdmin, (req, res) => {
    try {
      const { name: approvedBy } = res.locals.authenticatedProfile;
      const updated = dbService.updateUser(req.params.uid, {
        status: 'active',
        approvedAt: new Date().toISOString().split('T')[0],
        approvedBy: approvedBy || 'Dr. S. K. Narayanan (Dean)',
      });

      if (updated) {
        dbService.addActivityLog({
          userName: approvedBy || 'Administrator',
          userEmail: 'admin@easwari.edu',
          userRole: 'admin',
          action: `Approved registration for ${updated.name} (${updated.email}). Access granted.`,
          status: 'SUCCESS',
        });
      }

      res.json({ success: true, user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/users/:uid/reject', requireAdmin, (req, res) => {
    try {
      const updated = dbService.updateUser(req.params.uid, { status: 'rejected' });
      if (updated) {
        dbService.addActivityLog({
          userName: 'Administrator',
          userEmail: 'admin@easwari.edu',
          userRole: 'admin',
          action: `Rejected / Revoked registration for ${updated.name} (${updated.email}).`,
          status: 'WARNING',
        });
      }
      res.json({ success: true, user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 3. CURRICULUM & MODULE PROGRESS (DB)
  // ==========================================
  app.get('/api/curriculum/modules', (req, res) => {
    try {
      const modules = dbService.getAllModules();
      res.json({ success: true, modules });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/curriculum/progress', (req, res) => {
    try {
      const { moduleId, status, masteryScore } = req.body;
      if (!moduleId) return res.status(400).json({ error: 'moduleId is required' });

      const updated = dbService.updateModuleProgress(moduleId, { status, masteryScore });
      res.json({ success: true, module: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 4. STUDY PLANNER TASKS (DB)
  // ==========================================
  app.get('/api/tasks', (req, res) => {
    try {
      const userId = (req.query.userId as string) || 'student-001';
      const tasks = dbService.getTasksForUser(userId);
      res.json({ success: true, tasks });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/tasks', (req, res) => {
    try {
      const newTask = dbService.createTask(req.body);
      res.json({ success: true, task: newTask });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/tasks/:id', (req, res) => {
    try {
      const updated = dbService.updateTask(req.params.id, req.body);
      res.json({ success: true, task: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/tasks/:id', (req, res) => {
    try {
      const result = dbService.deleteTask(req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 5. FACULTY NOTES & AI PERSONALIZATION (DB)
  // ==========================================
  app.get('/api/faculty/notes', (req, res) => {
    try {
      const notes = dbService.getAllFacultyNotes();
      res.json({ success: true, notes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/faculty/notes', (req, res) => {
    try {
      const note = dbService.createFacultyNote(req.body);
      if (!note) {
        return res.status(500).json({ error: 'Faculty note could not be retrieved after creation' });
      }

      dbService.addActivityLog({
        userName: note.facultyName || 'Faculty',
        userEmail: note.facultyEmail || 'prof.ramesh@easwari.edu',
        userRole: 'faculty',
        action: `Uploaded lecture notes: "${note.title}" for ${note.unit}`,
        status: 'SUCCESS',
      });
      res.json({ success: true, note });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI Personalization endpoint with database persistence
  app.post('/api/ai/personalize-notes', async (req, res) => {
    try {
      const { noteId, notesText, subject, unit, unitName, targetStudentCohort } = req.body;

      if (!notesText || typeof notesText !== 'string') {
        return res.status(400).json({ error: 'notesText is required' });
      }

      const client = getAiClient();
      let parsedResult: any = null;

      if (client) {
        const prompt = `You are an expert engineering curriculum designer and cognitive learning AI for university computer science students.
The faculty uploaded the following lecture notes/materials for "${subject || 'Deep Learning & Neural Systems'}", ${unit || 'Unit 2'} ("${unitName || 'Backpropagation & Computational Graphs'}"):

--- LECTURE NOTES CONTENT ---
${notesText.substring(0, 8000)}
--- END NOTES ---

Student Cohort Profile:
- Target Mastery Index: ${targetStudentCohort?.masteryIndex || 84}%
- Bloom Taxonomy Tier: ${targetStudentCohort?.bloomTier || 'L4 • Synthesis'}
- Learning Preference: Visual diagrams, interactive simulations, and mathematical derivations.

Analyze this material and return ONLY a valid JSON object matching this exact schema:
{
  "summary": "Concise 2-3 sentence overview of this unit",
  "priorityConcepts": [
    {
      "name": "Concept name",
      "priority": "HIGH" | "MEDIUM" | "CRITICAL_EXAM",
      "importanceReason": "Why this concept is crucial for engineering exams and labs",
      "bloomLevel": "L2" | "L3" | "L4",
      "estimatedMinutes": 30
    }
  ],
  "visualMentalModels": [
    {
      "concept": "Concept name",
      "visualType": "Computation Graph / Architecture Flow" | "Mathematical Step Decomposition" | "Real-World Industrial Analogy",
      "headline": "Short punchy intuition",
      "representation": "Detailed ASCII/text flow diagram or LaTeX-like step-by-step mathematical breakdown showing exactly how the signals/tensors propagate",
      "analogy": "A relatable real-world physical analogy to cement deep conceptual understanding",
      "commonPitfall": "The single most common mistake students make in lab or exam"
    }
  ],
  "adaptiveAdjustments": {
    "forStrugglingStudents": "Specific prerequisite bridge and simplified mental model",
    "forAdvancedStudents": "Advanced vectorization or GPU kernel optimization challenge",
    "examTip": "High-yield advice for university semester examinations"
  },
  "practiceAssessment": [
    {
      "id": "q1",
      "question": "Rigorous engineering question testing understanding of these notes",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed step-by-step breakdown of why this option is correct and others are wrong",
      "bloomLevel": "L3 • Application"
    }
  ]
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        parsedResult = JSON.parse(response.text || '{}');
      } else {
        // Fallback high-yield academic decomposition
        parsedResult = {
          summary: `Decomposed academic breakdown for ${unit || 'Unit 2'}: ${unitName || 'Computation Graphs & Automatic Differentiation'}. Decomposed for cognitive mastery and semester exam alignment.`,
          priorityConcepts: [
            {
              name: 'Multivariate Chain Rule & Reverse-Mode AD',
              priority: 'CRITICAL_EXAM',
              importanceReason: 'Foundational for computing exact partial derivatives in deep directed acyclic graphs (DAGs).',
              bloomLevel: 'L4',
              estimatedMinutes: 45,
            },
            {
              name: 'Jacobian-Vector Products (JVPs) vs Vector-Jacobian Products (VJPs)',
              priority: 'HIGH',
              importanceReason: 'Explains why reverse-mode automatic differentiation is O(1) in scalar loss vs O(N) in forward mode.',
              bloomLevel: 'L4',
              estimatedMinutes: 40,
            },
          ],
          visualMentalModels: [
            {
              concept: 'Reverse-Mode Automatic Differentiation Graph',
              visualType: 'Computation Graph / Architecture Flow',
              headline: 'Signals flow forward to compute loss; gradients flow backward along transposed paths.',
              representation: `[ Input Tensor x ] ────> ( W · x + b ) ────> [ z ] ────> ( ReLU / Sigmoid ) ────> [ a ] ────> ( Loss L )
        │                                                                                     │
        ▲ <─── VJP: ∂L/∂x = W^T · (∂L/∂z) <─── [ ∂L/∂z = ∂L/∂a ⊙ σ'(z) ] <─── ∂L/∂a <───────┘`,
              analogy: 'Think of an industrial manufacturing assembly line: the forward pass builds the component, the reverse pass traces errors back to defective parts.',
              commonPitfall: 'Confusing matrix transposition order: ∂L/∂W = (∂L/∂z) · x^T, not x^T · (∂L/∂z).',
            },
          ],
          adaptiveAdjustments: {
            forStrugglingStudents: 'Start with single-neuron scalar chain rule before expanding into tensor contractions and batch dimensions.',
            forAdvancedStudents: 'Implement fused CUDA kernels with shared SRAM memory to eliminate high-bandwidth memory (HBM) round-trips.',
            examTip: 'In Part B 16-mark questions, always draw the complete computation graph with intermediate nodes labeled.',
          },
          practiceAssessment: [
            {
              id: 'q1',
              question: 'In a deep neural network with scalar loss L and input vector x ∈ ℝ^D, why is reverse-mode AD preferred over forward-mode AD?',
              options: [
                'Because forward-mode AD cannot compute second-order derivatives',
                'Because reverse-mode computes gradients of a scalar loss with respect to all D parameters in a single backward pass (O(1) passes)',
                'Because forward-mode requires CUDA GPU hardware while reverse-mode runs on standard CPUs',
                'Because reverse-mode does not require storing activations in memory',
              ],
              correctAnswer: 1,
              explanation: 'When output dimension is 1 (scalar loss) and input dimension is large, reverse-mode requires only one backward pass to compute all partial derivatives.',
              bloomLevel: 'L4 • Synthesis',
            },
          ],
        };
      }

      // Persist AI personalized data into SQLite if noteId provided
      if (noteId) {
        dbService.updateFacultyNoteAi(noteId, parsedResult);
      }

      return res.json({ success: true, data: parsedResult });
    } catch (err: any) {
      console.error('Error in /api/ai/personalize-notes:', err);
      return res.status(500).json({ error: err.message || 'Internal AI service error' });
    }
  });

  app.post('/api/ai/generate-assessment', async (req, res) => {
    try {
      const { topic, difficulty, questionCount = 3 } = req.body;
      const client = getAiClient();

      if (client) {
        const prompt = `Generate ${questionCount} university-level engineering practice questions for "${topic || 'Neural Networks & Deep Learning'}" at difficulty level "${difficulty || 'Adaptive Bloom L3-L4'}".
Return ONLY valid JSON:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "question": "Clear problem statement",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Clear educational breakdown",
      "bloomLevel": "L3" or "L4"
    }
  ]
}`;
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, data: parsed, source: 'gemini-3.8-flash' });
      }

      return res.json({
        success: true,
        data: {
          topic: topic || 'Neural Computation',
          questions: [
            {
              id: 'q1',
              question: `In ${topic || 'Computational Optimization'}, what is the primary role of momentum β in Adam and SGD with Momentum?`,
              options: [
                'Accelerates gradient descent along ravines and dampens high-frequency oscillations',
                'Guarantees finding the global minimum in non-convex loss surfaces',
                'Eliminates the need for a learning rate schedule',
                'Replaces the requirement for computing second-order Hessian matrices',
              ],
              correctAnswer: 0,
              explanation: 'Momentum accumulates exponentially decaying moving averages of past gradients, speeding up progress along consistent descent directions.',
              bloomLevel: 'L3 • Application',
            },
          ],
        },
        source: 'curriculum-engine',
      });
    } catch (err: any) {
      console.error('Error in /api/ai/generate-assessment:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate assessment' });
    }
  });

  // ==========================================
  // 6. ADAPTIVE DIAGNOSTIC ATTEMPTS (DB)
  // ==========================================
  app.post('/api/diagnostics/submit', (req, res) => {
    try {
      const { userId, score, totalQuestions, bloomTier } = req.body;
      if (!userId || score === undefined) {
        return res.status(400).json({ error: 'userId and score are required' });
      }

      const result = dbService.recordDiagnosticAttempt({
        userId,
        score,
        totalQuestions: totalQuestions || 4,
        bloomTier: bloomTier || 'L4 • Synthesis',
      });

      dbService.addActivityLog({
        userName: userId,
        userEmail: 'student@easwari.edu',
        userRole: 'student',
        action: `Completed 5-minute Adaptive Diagnostic: Score ${score}/${totalQuestions || 4} (${bloomTier}). Recalibrated mastery metrics.`,
        status: 'SUCCESS',
      });

      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 7. ANNOUNCEMENTS & ACTIVITY LOGS (DB)
  // ==========================================
  app.get('/api/announcements', (req, res) => {
    try {
      const announcements = dbService.getAllAnnouncements();
      res.json({ success: true, announcements });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/announcements', (req, res) => {
    try {
      const ann = dbService.createAnnouncement(req.body);
      res.json({ success: true, announcement: ann });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/activity-logs', (req, res) => {
    try {
      const logs = dbService.getActivityLogs();
      res.json({ success: true, activityLogs: logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/activity-logs', (req, res) => {
    try {
      const log = dbService.addActivityLog(req.body);
      res.json({ success: true, log });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 8. STATIC PORTAL SERVING (fsd/ folder)
  // ==========================================
  const fsdClassicPath = path.resolve(process.cwd(), '../fsd');
  app.use('/classic-portal', express.static(fsdClassicPath));

  // ==========================================
  // 9. VITE SPA / PRODUCTION BUILD SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  let activePort = PORT;
  const listen = () => {
    const server = app.listen(activePort, '0.0.0.0', () => {
      console.log(`AdaptIQ Platform running on http://localhost:${activePort}`);
      console.log(`Classic FSD Portal available at http://localhost:${activePort}/classic-portal`);
      console.log(`SQLite Database connected at ${path.resolve(process.cwd(), 'adaptiq.db')}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && process.env.PORT === undefined && activePort < PORT + 20) {
        activePort += 1;
        console.warn(`Port ${activePort - 1} is already in use; trying ${activePort}.`);
        listen();
        return;
      }

      console.error(`Unable to start the server on port ${activePort}: ${error.message}`);
      process.exitCode = 1;
    });
  };

  listen();
}

startServer();
