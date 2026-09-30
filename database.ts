import { DatabaseSync } from 'node:sqlite';
import path from 'path';

// Initialize SQLite database stored persistently on disk in project root
const dbPath = path.resolve(process.cwd(), 'adaptiq.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL journal mode for optimal concurrent read/write performance
db.exec('PRAGMA journal_mode = WAL;');

// Initialize Tables Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT DEFAULT 'Academic@123',
      mobile TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      status TEXT NOT NULL DEFAULT 'active',
      institution TEXT DEFAULT 'Easwari Engineering College',
      department TEXT DEFAULT 'Computer Science and Engineering',
      semester TEXT DEFAULT 'Semester 6',
      designation TEXT DEFAULT 'Undergraduate Scholar',
      roll_or_emp_number TEXT DEFAULT '310621104089',
      otp_verified INTEGER DEFAULT 1,
      email_verified INTEGER DEFAULT 1,
      email_verification_sent_at TEXT,
      approved_at TEXT,
      approved_by TEXT,
      mastery_index REAL DEFAULT 84,
      mastery_delta REAL DEFAULT 6,
      pace_factor REAL DEFAULT 2.6,
      pace_description TEXT DEFAULT 'Optimal load calibration sustained',
      primary_style TEXT DEFAULT 'Interactive Labs',
      primary_style_stat TEXT DEFAULT '68% of sessions (Cloud IDE)',
      bloom_tier TEXT DEFAULT 'L4 • Synthesis',
      bloom_tier_note TEXT DEFAULT 'Top 4% of engineering cohort',
      last_recalibrated TEXT DEFAULT 'Just now',
      earned_badge_ids TEXT DEFAULT '["badge-bloom-l4", "badge-hyper-pace", "badge-backprop-master"]',
      total_xp INTEGER DEFAULT 1050,
      study_planner_tasks TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      status TEXT NOT NULL DEFAULT 'locked',
      mastery_score INTEGER,
      level INTEGER,
      duration TEXT,
      unit_label TEXT,
      description TEXT,
      button_label TEXT,
      action_key TEXT
    );

    CREATE TABLE IF NOT EXISTS study_tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT DEFAULT 'module_review',
      module_name TEXT,
      day TEXT DEFAULT 'Mon',
      date_str TEXT,
      time_slot TEXT DEFAULT '10:00 AM - 11:30 AM',
      duration_minutes INTEGER DEFAULT 60,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      target_action_modal TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS faculty_notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      unit TEXT NOT NULL,
      unit_name TEXT,
      faculty_name TEXT NOT NULL,
      faculty_email TEXT NOT NULL,
      upload_date TEXT DEFAULT (date('now')),
      file_name TEXT,
      raw_content TEXT NOT NULL,
      is_ai_personalized INTEGER DEFAULT 0,
      ai_data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL DEFAULT 'admin',
      target_role TEXT NOT NULL DEFAULT 'all',
      date TEXT DEFAULT (date('now')),
      is_urgent INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      device_info TEXT,
      status TEXT DEFAULT 'SUCCESS'
    );

    CREATE TABLE IF NOT EXISTS diagnostic_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      bloom_tier TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now'))
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const userCountStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const userCount = (userCountStmt.get() as { count: number }).count;

  if (userCount === 0) {
    console.log('🌱 Seeding initial academic database records...');

    const insertUser = db.prepare(`
      INSERT INTO users (
        uid, name, email, password, mobile, role, status, institution, department,
        semester, designation, roll_or_emp_number, otp_verified, email_verified,
        approved_at, approved_by, mastery_index, mastery_delta, pace_factor,
        pace_description, primary_style, primary_style_stat, bloom_tier,
        bloom_tier_note, last_recalibrated, earned_badge_ids, total_xp
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    // 1. Admin Persona
    insertUser.run(
      'admin-001',
      'Dr. S. K. Narayanan',
      'admin@easwari.edu',
      'Academic@123',
      '+91 98401 23456',
      'admin',
      'active',
      'Easwari Engineering College',
      'Deanery of Academic Affairs',
      'Staff',
      'Dean & Chief Academic Administrator',
      'EEC-ADM-042',
      1,
      1,
      '2026-01-10',
      'Governing Council',
      98,
      0,
      1.0,
      'Full Administrator Privileges',
      'System Oversight',
      '100% Platform Access',
      'L6 • Evaluation & Policy',
      'Chief System Administrator',
      'Active Now',
      JSON.stringify(['badge-admin-master', 'badge-bloom-l6']),
      5000
    );

    // 2. Faculty Persona
    insertUser.run(
      'faculty-001',
      'Dr. K. Ramesh',
      'prof.ramesh@easwari.edu',
      'Academic@123',
      '+91 98402 34567',
      'faculty',
      'active',
      'Easwari Engineering College',
      'Computer Science and Engineering',
      'Faculty',
      'Associate Professor & AI Lab Incharge',
      'FAC-CSE-118',
      1,
      1,
      '2026-01-12',
      'Dr. S. K. Narayanan',
      96,
      2,
      1.0,
      'Curriculum Director & Evaluator',
      'Lecture & Lab Notes',
      '14 Units Decomposed',
      'L5 • Synthesis & Creation',
      'Senior Faculty Member',
      '10 mins ago',
      JSON.stringify(['badge-curriculum-architect', 'badge-bloom-l5']),
      3800
    );

    // 3. Student Persona - Yashwanth Raj
    insertUser.run(
      'student-001',
      'Yashwanth Raj',
      'student@easwari.edu',
      'Academic@123',
      '+91 98403 45678',
      'student',
      'active',
      'Easwari Engineering College',
      'Computer Science and Engineering',
      'Semester 6',
      'Undergraduate Scholar',
      '310621104089',
      1,
      1,
      '2026-02-01',
      'Dr. K. Ramesh',
      84,
      6,
      2.6,
      'Optimal load calibration sustained',
      'Interactive Labs',
      '68% of sessions (Cloud IDE)',
      'L4 • Synthesis',
      'Top 4% of engineering cohort',
      'Just now',
      JSON.stringify(['badge-bloom-l4', 'badge-hyper-pace', 'badge-backprop-master']),
      1050
    );

    // 4. Student Persona - Ananya S. Iyer
    insertUser.run(
      'student-002',
      'Ananya S. Iyer',
      'ananya.iyer@easwari.edu',
      'Academic@123',
      '+91 98404 56789',
      'student',
      'active',
      'Easwari Engineering College',
      'Information Technology',
      'Semester 6',
      'Undergraduate Scholar',
      '310621205012',
      1,
      1,
      '2026-02-05',
      'Dr. K. Ramesh',
      91,
      8,
      2.9,
      'High velocity mastery streak',
      'Mathematical Derivations',
      '74% of sessions (Proofs)',
      'L5 • Critical Analysis',
      'Department Rank #2',
      '25m ago',
      JSON.stringify(['badge-bloom-l4', 'badge-matrix-pro']),
      1420
    );

    // 5. Pending Student - Karthik Vignesh
    insertUser.run(
      'student-003',
      'Karthik Vignesh',
      'karthik.vignesh@easwari.edu',
      'Academic@123',
      '+91 98405 67890',
      'student',
      'pending_approval',
      'Easwari Engineering College',
      'Computer Science and Engineering',
      'Semester 4',
      'Undergraduate Scholar',
      '310622104055',
      1,
      1,
      null,
      null,
      72,
      0,
      1.4,
      'Pending Deanery approval',
      'Visual Concept Maps',
      'Initial Diagnostic Done',
      'L3 • Application',
      'Awaiting Admin Approval',
      '1 hour ago',
      JSON.stringify(['badge-welcome']),
      350
    );
  }

  // Modules Seeding
  const moduleCountStmt = db.prepare('SELECT COUNT(*) as count FROM modules');
  const moduleCount = (moduleCountStmt.get() as { count: number }).count;
  if (moduleCount === 0) {
    const insertModule = db.prepare(`
      INSERT INTO modules (id, title, subtitle, status, mastery_score, level, duration, unit_label, description, button_label, action_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertModule.run(
      'module-1',
      'Gradient descent and loss landscapes',
      'Stochastic gradients, momentum vectors, and convex optimization criteria',
      'mastered',
      96,
      3,
      '15 min',
      'Unit 1 of 8',
      'Stochastic gradient descent (SGD), momentum algorithms, AdaGrad, RMSProp, and Adam dynamics across ill-conditioned Hessian surfaces.',
      'Review mastery',
      'loss-explorer'
    );

    insertModule.run(
      'module-2',
      'Backpropagation mechanics and computation graphs',
      'Reverse-mode algorithmic differentiation, Jacobian chain rules, and tensor gradient memory layouts. Difficulty raised after a fast quiz turnaround.',
      'current',
      82,
      4,
      'about 24 min left',
      'Unit 3 of 8',
      'Reverse-mode algorithmic differentiation, Jacobian chain rules, and tensor gradient memory layouts. Difficulty raised after a fast quiz turnaround.',
      'Continue session →',
      'backprop-session'
    );

    insertModule.run(
      'module-3',
      'Matrix calculus refresher',
      'An 8-minute micro-module to clear up logged hesitation on Kronecker products and transpose gradients.',
      'recommended',
      78,
      2,
      '8 min',
      'Diagnostic Bridge',
      'An 8-minute micro-module to clear up logged hesitation on Kronecker products and transpose gradients.',
      'Open module • 8 min',
      'matrix-calculus'
    );

    insertModule.run(
      'module-4',
      'Convolutional neural networks and feature maps',
      'Spatial receptive fields, stride arithmetic, dilation, and parameter efficiency.',
      'locked',
      0,
      3,
      '35 min',
      'Unit 4 of 8',
      'Spatial receptive fields, stride arithmetic, dilation, and parameter efficiency.',
      'Unlocks upon completion',
      'cloud-lab'
    );
  }

  // Study Tasks Seeding
  const taskCountStmt = db.prepare('SELECT COUNT(*) as count FROM study_tasks');
  const taskCount = (taskCountStmt.get() as { count: number }).count;
  if (taskCount === 0) {
    const insertTask = db.prepare(`
      INSERT INTO study_tasks (id, user_id, title, type, module_name, day, date_str, time_slot, duration_minutes, priority, status, target_action_modal, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTask.run(
      'task-1',
      'student-001',
      'Complete Backprop Graph Interactive Simulation',
      'lab_session',
      'Unit 3: Backpropagation & Graphs',
      'Mon',
      '2026-03-02',
      '10:00 AM - 11:30 AM',
      90,
      'high',
      'pending',
      'backprop-session',
      'Verify transpose tensor dimension matching in backward pass'
    );

    insertTask.run(
      'task-2',
      'student-001',
      'Solve Matrix Calculus Kronecker Refresher',
      'module_review',
      'Prerequisite Mathematics',
      'Tue',
      '2026-03-03',
      '02:00 PM - 02:45 PM',
      45,
      'normal',
      'completed',
      'matrix-calculus',
      'Clear doubts from previous diagnostic on ∂(x^T A x)/∂x'
    );

    insertTask.run(
      'task-3',
      'student-001',
      'Run 5-Minute Adaptive Assessment Diagnostic',
      'diagnostic_prep',
      'Continuous Evaluation Assessment',
      'Wed',
      '2026-03-04',
      '04:00 PM - 04:30 PM',
      30,
      'high',
      'pending',
      'diagnostic',
      'Calibration check for upcoming Internal Assessment 2 (IA-2)'
    );

    insertTask.run(
      'task-4',
      'student-001',
      'PyTorch Autograd Lab in Cloud IDE',
      'lab_session',
      'Lab Practical 4',
      'Thu',
      '2026-03-05',
      '11:00 AM - 12:30 PM',
      90,
      'medium',
      'pending',
      'cloud-lab',
      'Write custom backward() step in torch.autograd.Function'
    );
  }

  // Faculty Notes Seeding
  const noteCountStmt = db.prepare('SELECT COUNT(*) as count FROM faculty_notes');
  const noteCount = (noteCountStmt.get() as { count: number }).count;
  if (noteCount === 0) {
    const insertNote = db.prepare(`
      INSERT INTO faculty_notes (
        id, title, subject, unit, unit_name, faculty_name, faculty_email,
        upload_date, file_name, raw_content, is_ai_personalized, ai_data_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertNote.run(
      'note-001',
      'Lecture 7: Backpropagation Mechanics & Automatic Differentiation',
      'CS8601 - Mobile & Deep Learning Systems',
      'Unit 2',
      'Computation Graphs & Automatic Differentiation',
      'Dr. K. Ramesh',
      'prof.ramesh@easwari.edu',
      '2026-02-18',
      'CS8601_Unit2_Backprop_Lecture7.pdf',
      `CS8601 Mobile & Deep Learning Systems - Unit 2
Topic: Reverse-Mode Automatic Differentiation & Vectorized Backpropagation
1. Directed Acyclic Computation Graphs (DAGs)
Every forward computation can be decomposed into an ordered series of elementary operations:
z = W · x + b
a = σ(z)
L = 1/2 ||y - a||^2

2. The Chain Rule over DAGs
In scalar loss optimization:
∂L/∂x = ∑_{parents(x)} (∂L/∂parent) · (∂parent/∂x)
Reverse-mode AD performs a single topological backward sweep, evaluating vector-Jacobian products (VJPs).
Crucial exam point: Time complexity of reverse-mode is O(elementary ops), independent of parameter dimension D!

3. Tensor Dimensions in Vectorized Layers
Let x ∈ ℝ^{B × D_in}, W ∈ ℝ^{D_in × D_out}, b ∈ ℝ^{D_out}, z ∈ ℝ^{B × D_out}.
Then incoming gradient ∂L/∂z has dimension B × D_out.
Weight gradient:
∂L/∂W = x^T · (∂L/∂z)   [Shape: (D_in × B) × (B × D_out) = D_in × D_out]
Bias gradient:
∂L/∂b = ∑_{batch} (∂L/∂z)  [Shape: 1 × D_out]

4. Numerical Stability
Always employ Log-Sum-Exp when computing Softmax Cross-Entropy loss to avoid IEEE 754 overflow.`,
      1,
      JSON.stringify({
        summary: 'Decomposed lecture notes for Unit 2: Computation Graphs & Automatic Differentiation. Emphasizes reverse-mode AD complexity and vectorized tensor outer product gradients.',
        priorityConcepts: [
          {
            name: 'Vectorized Tensor Gradient Derivation (∂L/∂W = x^T · ∂L/∂z)',
            priority: 'CRITICAL_EXAM',
            importanceReason: '16-mark semester exam question; dimension mismatch causes silent matrix multiplication runtime errors in PyTorch.',
            bloomLevel: 'L4',
            estimatedMinutes: 40
          },
          {
            name: 'Reverse-Mode AD O(1) Passes vs Forward-Mode O(D) Passes',
            priority: 'HIGH',
            importanceReason: 'Fundamental theoretical reasoning behind modern deep learning scalability.',
            bloomLevel: 'L3',
            estimatedMinutes: 25
          },
          {
            name: 'Softmax Log-Sum-Exp Trick for Float32 Stability',
            priority: 'HIGH',
            importanceReason: 'Prevents NaN losses during gradient descent backpropagation.',
            bloomLevel: 'L3',
            estimatedMinutes: 20
          }
        ],
        visualMentalModels: [
          {
            concept: 'Computation Graph Forward/Backward Tensor Flow',
            visualType: 'Computation Graph / Architecture Flow',
            headline: 'Forward pass buffers activations; backward pass propagates vector-Jacobian products in reverse topological order.',
            representation: '[x] ──(· W)──> [z] ──(σ)──> [a] ──(Loss)──> [L]\n   ◄── (W^T ·) ─── ◄── (⊙ σ\') ── ◄── (∂L/∂a) ──┘',
            analogy: 'A reversible assembly line: forward operations assemble parts, reverse operations inspect and assign error responsibility.',
            commonPitfall: 'Transposing in the wrong order: ∂L/∂W is x^T · ∂L/∂z, NOT ∂L/∂z · x^T.'
          }
        ],
        adaptiveAdjustments: {
          forStrugglingStudents: 'Derive single scalar neuron case with 1 input and 1 weight before introducing matrix batch dimensions.',
          forAdvancedStudents: 'Write a custom CUDA kernel using shared memory to fuse the activation and backward gradient computation.',
          examTip: 'Always write down tensor dimensions next to every matrix multiplication step in your exam booklet.'
        },
        practiceAssessment: [
          {
            id: 'q1',
            question: 'Given linear layer forward output z = x · W where x is (B × D_in) and W is (D_in × D_out), what is the formula for the weight gradient ∂L/∂W?',
            options: ['(∂L/∂z) · x^T', 'x^T · (∂L/∂z)', 'W^T · (∂L/∂z)', '(∂L/∂z)^T · x'],
            correctAnswer: 1,
            explanation: 'Multiplying x^T (D_in × B) by ∂L/∂z (B × D_out) yields a matrix of shape (D_in × D_out), precisely matching weight matrix W.',
            bloomLevel: 'L4 • Synthesis'
          },
          {
            id: 'q2',
            question: 'Why is reverse-mode AD asymptotically superior to forward-mode AD for training deep neural networks with millions of parameters?',
            options: [
              'Reverse-mode avoids using floating point numbers',
              'Reverse-mode computes gradients with respect to all million parameters in a single backward pass for a scalar loss',
              'Reverse-mode requires less RAM than forward-mode',
              'Reverse-mode works only for convex cost functions'
            ],
            correctAnswer: 1,
            explanation: 'When output dimension is 1 (scalar loss) and input dimension D is huge, reverse-mode evaluates all derivatives in O(1) sweeps, while forward-mode requires D passes.',
            bloomLevel: 'L4 • Synthesis'
          }
        ]
      })
    );
  }

  // Announcements Seeding
  const annCountStmt = db.prepare('SELECT COUNT(*) as count FROM announcements');
  const annCount = (annCountStmt.get() as { count: number }).count;
  if (annCount === 0) {
    const insertAnn = db.prepare(`
      INSERT INTO announcements (id, title, content, author_name, author_role, target_role, date, is_urgent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAnn.run(
      'ann-001',
      'Internal Assessment 2 (IA-2) Schedule Announced',
      'The second continuous internal assessment (IA-2) for Deep Learning & Neural Systems is scheduled for March 12, 2026. Coverage includes Units 1 through 3.',
      'Dr. S. K. Narayanan',
      'admin',
      'all',
      '2026-02-20',
      1
    );

    insertAnn.run(
      'ann-002',
      'Faculty Note Personalizer Online',
      'Faculty members can now upload lecture notes in PDF or TXT to automatically generate Bloom L3/L4 visual mental models and adaptive student assessments.',
      'Dr. K. Ramesh',
      'faculty',
      'all',
      '2026-02-22',
      0
    );
  }

  // Activity Logs Seeding
  const logCountStmt = db.prepare('SELECT COUNT(*) as count FROM activity_logs');
  const logCount = (logCountStmt.get() as { count: number }).count;
  if (logCount === 0) {
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (id, user_name, user_email, user_role, action, timestamp, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertLog.run(
      'log-001',
      'Dr. S. K. Narayanan',
      'admin@easwari.edu',
      'admin',
      'System Database Initialized with Easwari Engineering College Schema',
      '2026-02-24 09:00:00',
      'SUCCESS'
    );

    insertLog.run(
      'log-002',
      'Yashwanth Raj',
      'student@easwari.edu',
      'student',
      'Completed Gradient Descent & Loss Landscapes module (Score: 96%)',
      '2026-02-24 10:15:00',
      'SUCCESS'
    );
  }

  console.log('✅ SQLite Database successfully initialized and seeded at:', dbPath);
}

// ==========================================
// DATABASE QUERY & MUTATION HELPER FUNCTIONS
// ==========================================

export const dbService = {
  // --- User Operations ---
  getAllUsers() {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    const rows = stmt.all() as any[];
    return rows.map(formatUserRow);
  },

  getUserById(uid: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE uid = ?');
    const row = stmt.get(uid) as any;
    return row ? formatUserRow(row) : null;
  },

  getUserByEmail(email: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
    const row = stmt.get(email) as any;
    return row ? formatUserRow(row) : null;
  },

  createUser(userData: any) {
    const stmt = db.prepare(`
      INSERT INTO users (
        uid, name, email, password, mobile, role, status, institution, department,
        semester, designation, roll_or_emp_number, otp_verified, email_verified,
        approved_at, approved_by, mastery_index, mastery_delta, pace_factor,
        pace_description, primary_style, primary_style_stat, bloom_tier,
        bloom_tier_note, last_recalibrated, earned_badge_ids, total_xp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const uid = userData.uid || `user-${Date.now()}`;
    stmt.run(
      uid,
      userData.name,
      userData.email.toLowerCase(),
      userData.password || null,
      userData.mobile || '+91 98400 00000',
      userData.role || 'student',
      userData.status || 'pending_approval',
      userData.institution || 'Easwari Engineering College',
      userData.department || 'Computer Science and Engineering',
      userData.semester || 'Semester 6',
      userData.designation || 'Undergraduate Scholar',
      userData.rollOrEmpNumber || '310621104000',
      userData.otpVerified ? 1 : 0,
      userData.emailVerified ? 1 : 0,
      userData.approvedAt || null,
      userData.approvedBy || null,
      userData.masteryIndex || 70,
      userData.masteryDelta || 0,
      userData.paceFactor || 1.0,
      userData.paceDescription || 'Initial load calibration',
      userData.primaryStyle || 'Interactive Labs',
      userData.primaryStyleStat || 'New Member',
      userData.bloomTier || 'L2 • Comprehension',
      userData.bloomTierNote || 'Initial baseline',
      userData.lastRecalibrated || 'Just now',
      JSON.stringify(userData.earnedBadgeIds || ['badge-welcome']),
      userData.totalXp || 100
    );

    return this.getUserById(uid);
  },

  updateUser(uid: string, updates: Record<string, any>) {
    const allowedFields: Record<string, string> = {
      name: 'name',
      mobile: 'mobile',
      department: 'department',
      semester: 'semester',
      designation: 'designation',
      rollOrEmpNumber: 'roll_or_emp_number',
      masteryIndex: 'mastery_index',
      masteryDelta: 'mastery_delta',
      paceFactor: 'pace_factor',
      paceDescription: 'pace_description',
      primaryStyle: 'primary_style',
      primaryStyleStat: 'primary_style_stat',
      bloomTier: 'bloom_tier',
      bloomTierNote: 'bloom_tier_note',
      lastRecalibrated: 'last_recalibrated',
      totalXp: 'total_xp',
    };

    const setClauses: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(updates)) {
      if (key === 'earnedBadgeIds') {
        setClauses.push('earned_badge_ids = ?');
        values.push(JSON.stringify(val));
      } else if (key === 'studyPlannerTasks') {
        setClauses.push('study_planner_tasks = ?');
        values.push(JSON.stringify(val));
      } else if (allowedFields[key]) {
        const col = allowedFields[key];
        setClauses.push(`${col} = ?`);
        if (typeof val === 'boolean') {
          values.push(val ? 1 : 0);
        } else {
          values.push(val);
        }
      }
    }

    if (setClauses.length > 0) {
      setClauses.push("updated_at = datetime('now')");
      values.push(uid);
      const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE uid = ?`;
      db.prepare(sql).run(...values);
    }

    return this.getUserById(uid);
  },

  // --- Curriculum Modules ---
  getAllModules() {
    const stmt = db.prepare('SELECT * FROM modules ORDER BY rowid ASC');
    return stmt.all();
  },

  updateModuleProgress(id: string, updates: { status?: string; masteryScore?: number }) {
    const clauses: string[] = [];
    const values: any[] = [];
    if (updates.status !== undefined) {
      clauses.push('status = ?');
      values.push(updates.status);
    }
    if (updates.masteryScore !== undefined) {
      clauses.push('mastery_score = ?');
      values.push(updates.masteryScore);
    }
    if (clauses.length > 0) {
      values.push(id);
      db.prepare(`UPDATE modules SET ${clauses.join(', ')} WHERE id = ?`).run(...values);
    }
    return db.prepare('SELECT * FROM modules WHERE id = ?').get(id);
  },

  // --- Study Tasks ---
  getTasksForUser(userId: string) {
    const stmt = db.prepare('SELECT * FROM study_tasks WHERE user_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(userId) as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      moduleName: r.module_name,
      day: r.day,
      dateStr: r.date_str,
      timeSlot: r.time_slot,
      durationMinutes: r.duration_minutes,
      priority: r.priority,
      status: r.status,
      targetActionModal: r.target_action_modal,
      notes: r.notes,
      createdAt: r.created_at,
    }));
  },

  createTask(taskData: any) {
    const stmt = db.prepare(`
      INSERT INTO study_tasks (
        id, user_id, title, type, module_name, day, date_str, time_slot,
        duration_minutes, priority, status, target_action_modal, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = taskData.id || `task-${Date.now()}`;
    stmt.run(
      id,
      taskData.userId || 'student-001',
      taskData.title,
      taskData.type || 'module_review',
      taskData.moduleName || '',
      taskData.day || 'Mon',
      taskData.dateStr || new Date().toISOString().split('T')[0],
      taskData.timeSlot || '10:00 AM - 11:30 AM',
      taskData.durationMinutes || 60,
      taskData.priority || 'medium',
      taskData.status || 'pending',
      taskData.targetActionModal || null,
      taskData.notes || ''
    );

    return db.prepare('SELECT * FROM study_tasks WHERE id = ?').get(id);
  },

  updateTask(id: string, updates: any) {
    const allowed: Record<string, string> = {
      title: 'title',
      status: 'status',
      priority: 'priority',
      notes: 'notes',
      timeSlot: 'time_slot',
      day: 'day',
      durationMinutes: 'duration_minutes',
    };

    const clauses: string[] = [];
    const vals: any[] = [];
    for (const [k, v] of Object.entries(updates)) {
      if (allowed[k]) {
        clauses.push(`${allowed[k]} = ?`);
        vals.push(v);
      }
    }
    if (clauses.length > 0) {
      vals.push(id);
      db.prepare(`UPDATE study_tasks SET ${clauses.join(', ')} WHERE id = ?`).run(...vals);
    }
    return db.prepare('SELECT * FROM study_tasks WHERE id = ?').get(id);
  },

  deleteTask(id: string) {
    db.prepare('DELETE FROM study_tasks WHERE id = ?').run(id);
    return { success: true, id };
  },

  // --- Faculty Notes ---
  getAllFacultyNotes() {
    const stmt = db.prepare('SELECT * FROM faculty_notes ORDER BY rowid DESC');
    const rows = stmt.all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      subject: r.subject,
      unit: r.unit,
      unitName: r.unit_name,
      facultyName: r.faculty_name,
      facultyEmail: r.faculty_email,
      uploadDate: r.upload_date,
      fileName: r.file_name,
      rawContent: r.raw_content,
      isAiPersonalized: Boolean(r.is_ai_personalized),
      aiData: r.ai_data_json ? JSON.parse(r.ai_data_json) : undefined,
    }));
  },

  getFacultyNoteById(id: string) {
    const stmt = db.prepare('SELECT * FROM faculty_notes WHERE id = ?');
    const r = stmt.get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      subject: r.subject,
      unit: r.unit,
      unitName: r.unit_name,
      facultyName: r.faculty_name,
      facultyEmail: r.faculty_email,
      uploadDate: r.upload_date,
      fileName: r.file_name,
      rawContent: r.raw_content,
      isAiPersonalized: Boolean(r.is_ai_personalized),
      aiData: r.ai_data_json ? JSON.parse(r.ai_data_json) : undefined,
    };
  },

  createFacultyNote(note: any) {
    const stmt = db.prepare(`
      INSERT INTO faculty_notes (
        id, title, subject, unit, unit_name, faculty_name, faculty_email,
        upload_date, file_name, raw_content, is_ai_personalized, ai_data_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = note.id || `note-${Date.now()}`;
    stmt.run(
      id,
      note.title,
      note.subject,
      note.unit,
      note.unitName || '',
      note.facultyName,
      note.facultyEmail,
      note.uploadDate || new Date().toISOString().split('T')[0],
      note.fileName || '',
      note.rawContent,
      note.isAiPersonalized ? 1 : 0,
      note.aiData ? JSON.stringify(note.aiData) : null
    );

    return this.getFacultyNoteById(id);
  },

  updateFacultyNoteAi(id: string, aiData: any) {
    db.prepare(`
      UPDATE faculty_notes 
      SET is_ai_personalized = 1, ai_data_json = ? 
      WHERE id = ?
    `).run(JSON.stringify(aiData), id);

    return this.getFacultyNoteById(id);
  },

  // --- Announcements ---
  getAllAnnouncements() {
    const stmt = db.prepare('SELECT * FROM announcements ORDER BY rowid DESC');
    const rows = stmt.all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      authorName: r.author_name,
      authorRole: r.author_role,
      targetRole: r.target_role,
      date: r.date,
      isUrgent: Boolean(r.is_urgent),
    }));
  },

  createAnnouncement(ann: any) {
    const id = ann.id || `ann-${Date.now()}`;
    db.prepare(`
      INSERT INTO announcements (id, title, content, author_name, author_role, target_role, date, is_urgent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      ann.title,
      ann.content,
      ann.authorName,
      ann.authorRole || 'admin',
      ann.targetRole || 'all',
      ann.date || new Date().toISOString().split('T')[0],
      ann.isUrgent ? 1 : 0
    );
    return db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
  },

  // --- Activity Logs ---
  getActivityLogs(limit = 50) {
    const stmt = db.prepare('SELECT * FROM activity_logs ORDER BY rowid DESC LIMIT ?');
    const rows = stmt.all(limit) as any[];
    return rows.map((r) => ({
      id: r.id,
      userName: r.user_name,
      userEmail: r.user_email,
      userRole: r.user_role,
      action: r.action,
      timestamp: r.timestamp,
      deviceInfo: r.device_info,
      status: r.status,
    }));
  },

  addActivityLog(log: any) {
    const id = log.id || `log-${Date.now()}`;
    db.prepare(`
      INSERT INTO activity_logs (id, user_name, user_email, user_role, action, timestamp, device_info, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      log.userName,
      log.userEmail,
      log.userRole || 'student',
      log.action,
      log.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
      log.deviceInfo || 'Web Browser',
      log.status || 'SUCCESS'
    );
    return { success: true, id };
  },

  // --- Diagnostics ---
  recordDiagnosticAttempt(attempt: { userId: string; score: number; totalQuestions: number; bloomTier: string }) {
    const id = `diag-${Date.now()}`;
    db.prepare(`
      INSERT INTO diagnostic_attempts (id, user_id, score, total_questions, bloom_tier)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, attempt.userId, attempt.score, attempt.totalQuestions, attempt.bloomTier);

    // Also update student mastery and bloom tier in users table
    const masteryDelta = Math.round((attempt.score / attempt.totalQuestions) * 10);
    db.prepare(`
      UPDATE users 
      SET mastery_index = MIN(100, MAX(50, mastery_index + ?)),
          bloom_tier = ?,
          last_recalibrated = 'Just now',
          total_xp = total_xp + 250,
          updated_at = datetime('now')
      WHERE uid = ?
    `).run(masteryDelta, attempt.bloomTier, attempt.userId);

    return { id, success: true, masteryDelta };
  },
};

function formatUserRow(r: any) {
  return {
    uid: r.uid,
    name: r.name,
    email: r.email,
    mobile: r.mobile,
    role: r.role,
    status: r.status,
    institution: r.institution,
    department: r.department,
    semester: r.semester,
    designation: r.designation,
    rollOrEmpNumber: r.roll_or_emp_number,
    otpVerified: Boolean(r.otp_verified),
    emailVerified: Boolean(r.email_verified),
    emailVerificationSentAt: r.email_verification_sent_at,
    approvedAt: r.approved_at,
    approvedBy: r.approved_by,
    masteryIndex: r.mastery_index,
    masteryDelta: r.mastery_delta,
    paceFactor: r.pace_factor,
    paceDescription: r.pace_description,
    primaryStyle: r.primary_style,
    primaryStyleStat: r.primary_style_stat,
    bloomTier: r.bloom_tier,
    bloomTierNote: r.bloom_tier_note,
    lastRecalibrated: r.last_recalibrated,
    earnedBadgeIds: r.earned_badge_ids ? JSON.parse(r.earned_badge_ids) : [],
    totalXp: r.total_xp,
    studyPlannerTasks: r.study_planner_tasks ? JSON.parse(r.study_planner_tasks) : undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
