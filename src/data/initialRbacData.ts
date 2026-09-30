import { FacultyNote, Announcement, SystemActivityLog, StudentProfile } from '../types';

// Keep institutional and student records out of source control. Real records are
// created in the database through the authenticated registration and admin flows.
export const initialUsersList: StudentProfile[] = [];
export const initialFacultyNotes: FacultyNote[] = [];
export const initialAnnouncements: Announcement[] = [];
export const initialActivityLogs: SystemActivityLog[] = [];
