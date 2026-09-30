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
      mobile TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      status TEXT NOT NULL DEFAULT 'active',
      institution TEXT DEFAULT '',
      department TEXT DEFAULT '',
      semester TEXT DEFAULT '',
      designation TEXT DEFAULT '',
      roll_or_emp_number TEXT DEFAULT '',
      otp_verified INTEGER DEFAULT 1,
      email_verified INTEGER DEFAULT 1,
      email_verification_sent_at TEXT,
      approved_at TEXT,
      approved_by TEXT,
      mastery_index REAL DEFAULT 0,
      mastery_delta REAL DEFAULT 0,
      pace_factor REAL DEFAULT 1,
      pace_description TEXT DEFAULT '',
      primary_style TEXT DEFAULT '',
      primary_style_stat TEXT DEFAULT '',
      bloom_tier TEXT DEFAULT 'L1',
      bloom_tier_note TEXT DEFAULT '',
      last_recalibrated TEXT DEFAULT '',
      earned_badge_ids TEXT DEFAULT '[]',
      total_xp INTEGER DEFAULT 0,
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
  // Institutional and student fixture records are intentionally not shipped.
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
        uid, name, email, mobile, role, status, institution, department,
        semester, designation, roll_or_emp_number, otp_verified, email_verified,
        approved_at, approved_by, mastery_index, mastery_delta, pace_factor,
        pace_description, primary_style, primary_style_stat, bloom_tier,
        bloom_tier_note, last_recalibrated, earned_badge_ids, total_xp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const uid = userData.uid || `user-${Date.now()}`;
    stmt.run(
      uid,
      userData.name,
      userData.email.toLowerCase(),
      userData.mobile || '',
      userData.role || 'student',
      userData.status || 'pending_approval',
      userData.institution || '',
      userData.department || '',
      userData.semester || '',
      userData.designation || '',
      userData.rollOrEmpNumber || '',
      userData.otpVerified ? 1 : 0,
      userData.emailVerified ? 1 : 0,
      userData.approvedAt || null,
      userData.approvedBy || null,
      userData.masteryIndex ?? 0,
      userData.masteryDelta || 0,
      userData.paceFactor || 1.0,
      userData.paceDescription || '',
      userData.primaryStyle || '',
      userData.primaryStyleStat || '',
      userData.bloomTier || 'L1',
      userData.bloomTierNote || '',
      userData.lastRecalibrated || '',
      JSON.stringify(userData.earnedBadgeIds || []),
      userData.totalXp ?? 0
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
      taskData.userId || '',
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
