
export interface Student {
  id: string;
  name: string;
  dateAdded: string;
  attendanceCount: number;
  lastPresent: string | null;
}

export interface AttendanceLog {
  date: string;
  totalStudents: number;
  presentStudents: string[];
  absentStudents: string[];
}

export interface AttendanceStats {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}

export interface BackupData {
  students: Student[];
  logs: AttendanceLog[];
  backupDate: string;
}
