
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Student } from '@/types/attendance';

interface AttendanceContextType {
  students: Student[];
  presentStudents: string[];
  addStudent: (name: string) => void;
  markPresent: (name: string) => void;
  startAttendance: () => void;
  endAttendance: () => void;
  isAttendanceActive: boolean;
  saveAttendanceLog: () => void;
  backupData: () => void;
  autoRestoreStudents: () => void;
  isProcessing: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}

interface AttendanceProviderProps {
  children: ReactNode;
}

export function AttendanceProvider({ children }: AttendanceProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [presentStudents, setPresentStudents] = useState<string[]>([]);
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load saved students from localStorage on mount
  useEffect(() => {
    autoRestoreStudents();
  }, []);

  const autoRestoreStudents = () => {
    const savedStudents = localStorage.getItem('attendance_students');
    if (savedStudents) {
      try {
        setStudents(JSON.parse(savedStudents));
        console.log('Auto-restored students from local storage');
      } catch (error) {
        console.error('Failed to parse saved students:', error);
        toast({
          title: "Error",
          description: "Failed to restore student data",
          variant: "destructive",
        });
      }
    }
  };

  // Save students to localStorage when updated
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('attendance_students', JSON.stringify(students));
    }
  }, [students]);

  const addStudent = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Student name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names
    if (students.some(student => student.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Error",
        description: `Student "${name}" already exists`,
        variant: "destructive",
      });
      return;
    }

    setStudents(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        dateAdded: new Date().toISOString(),
        attendanceCount: 0,
        lastPresent: null,
      }
    ]);

    toast({
      title: "Success",
      description: `Student "${name}" added successfully`,
    });
  };

  const markPresent = (name: string) => {
    if (!isAttendanceActive) return;
    
    if (!presentStudents.includes(name)) {
      setPresentStudents(prev => [...prev, name]);
      
      // Update student attendance count
      setStudents(prev => prev.map(student => 
        student.name === name 
          ? {
              ...student,
              attendanceCount: student.attendanceCount + 1,
              lastPresent: new Date().toISOString(),
            }
          : student
      ));
    }
  };

  const startAttendance = () => {
    if (students.length === 0) {
      toast({
        title: "Warning",
        description: "No students registered yet",
        variant: "destructive",
      });
      return;
    }
    
    setPresentStudents([]);
    setIsAttendanceActive(true);
    toast({
      title: "Attendance Started",
      description: "Scanning for students...",
    });
  };

  const endAttendance = () => {
    setIsAttendanceActive(false);
    toast({
      title: "Attendance Ended",
      description: `${presentStudents.length} students marked present`,
    });
  };

  const saveAttendanceLog = () => {
    if (presentStudents.length === 0) {
      toast({
        title: "Warning",
        description: "No attendance data to save",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save attendance data to localStorage
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = {
        date: today,
        totalStudents: students.length,
        presentStudents: presentStudents,
        absentStudents: students
          .filter(student => !presentStudents.includes(student.name))
          .map(student => student.name),
      };

      // Get existing logs or create new array
      const existingLogs = JSON.parse(localStorage.getItem('attendance_logs') || '[]');
      existingLogs.push(attendanceData);
      localStorage.setItem('attendance_logs', JSON.stringify(existingLogs));

      toast({
        title: "Success",
        description: "Attendance log saved successfully",
      });
    } catch (error) {
      console.error('Failed to save attendance log:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance log",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const backupData = () => {
    setIsProcessing(true);

    try {
      // Create a backup object with all data
      const backup = {
        students,
        logs: JSON.parse(localStorage.getItem('attendance_logs') || '[]'),
        backupDate: new Date().toISOString(),
      };

      // Convert to JSON string and create blob
      const backupStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([backupStr], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `attendance_backup_${dateStr}.json`;
      
      // Trigger download and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Created",
        description: "Data backup downloaded successfully",
      });
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AttendanceContext.Provider value={{
      students,
      presentStudents,
      addStudent,
      markPresent,
      startAttendance,
      endAttendance,
      isAttendanceActive,
      saveAttendanceLog,
      backupData,
      autoRestoreStudents,
      isProcessing
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}
