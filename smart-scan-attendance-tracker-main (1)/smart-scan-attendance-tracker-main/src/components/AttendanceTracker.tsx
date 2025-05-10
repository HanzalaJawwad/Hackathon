
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Users, X, Clock } from "lucide-react";
import { useAttendance } from '@/context/AttendanceContext';
import WebcamCapture from './WebcamCapture';
import { toast } from "@/hooks/use-toast";

const AttendanceTracker = () => {
  const { 
    students, 
    presentStudents, 
    isAttendanceActive, 
    startAttendance, 
    endAttendance, 
    markPresent,
    saveAttendanceLog 
  } = useAttendance();
  
  const [recognizedFaces, setRecognizedFaces] = useState<{name: string, time: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Simulate face recognition during active attendance session
  useEffect(() => {
    if (!isAttendanceActive || students.length === 0) return;
    
    let timer: NodeJS.Timeout;
    
    const simulateRecognition = () => {
      // Only recognize students who haven't been recognized yet
      const unrecognizedStudents = students.filter(
        student => !presentStudents.includes(student.name)
      );
      
      if (unrecognizedStudents.length === 0) return;
      
      // Randomly select a student to recognize
      const randomIndex = Math.floor(Math.random() * unrecognizedStudents.length);
      const recognizedStudent = unrecognizedStudents[randomIndex];
      
      // Mark student as present
      markPresent(recognizedStudent.name);
      
      // Add to recognized faces list with timestamp
      const now = new Date();
      setRecognizedFaces(prev => [
        {
          name: recognizedStudent.name,
          time: now.toLocaleTimeString()
        },
        ...prev
      ]);
    };
    
    // Simulate face recognition at random intervals
    const scheduleNextRecognition = () => {
      const delay = Math.random() * 3000 + 2000; // Random delay between 2-5 seconds
      timer = setTimeout(() => {
        simulateRecognition();
        scheduleNextRecognition();
      }, delay);
    };
    
    scheduleNextRecognition();
    
    return () => {
      clearTimeout(timer);
    };
  }, [isAttendanceActive, students, presentStudents, markPresent]);

  const handleStartAttendance = () => {
    setIsLoading(true);
    setRecognizedFaces([]);
    
    // Simulate loading
    setTimeout(() => {
      startAttendance();
      setIsLoading(false);
    }, 1500);
  };

  const handleEndAttendance = () => {
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      endAttendance();
      setIsLoading(false);
      
      // Start countdown after attendance ends
      if (presentStudents.length > 0) {
        setCountdown(20);
      }
    }, 1000);
  };

  // Countdown effect for auto-saving attendance log
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown <= 0) {
      saveAttendanceLog();
      setCountdown(null);
      toast({
        title: "Attendance Saved",
        description: "Attendance log has been saved automatically",
      });
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, saveAttendanceLog]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Attendance</CardTitle>
          <CardDescription>
            {isAttendanceActive 
              ? 'Currently taking attendance...' 
              : 'Start an attendance session'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Students Present</p>
              <div className="flex items-center gap-2 mt-1">
                <Check className="w-5 h-5 text-emerald-500" />
                <span className="text-2xl font-bold">
                  {presentStudents.length} / {students.length}
                </span>
              </div>
            </div>
            
            {isAttendanceActive ? (
              <Button 
                variant="destructive" 
                onClick={handleEndAttendance}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'End Attendance'}
              </Button>
            ) : (
              <Button 
                onClick={handleStartAttendance}
                disabled={isLoading || students.length === 0}
              >
                {isLoading ? 'Starting...' : 'Start Attendance'}
              </Button>
            )}
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Recognition Log</h4>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            
            {recognizedFaces.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {isAttendanceActive 
                  ? 'Waiting for faces to recognize...'
                  : 'No attendance session active'}
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {recognizedFaces.map((entry, index) => (
                  <div 
                    key={`${entry.name}-${index}`} 
                    className="flex justify-between items-center p-2 bg-slate-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-attendance-primary/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-attendance-primary" />
                      </div>
                      <span>{entry.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {presentStudents.length > 0 && !isAttendanceActive && (
            <>
              {countdown !== null ? (
                <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 rounded-md border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">
                    Saving attendance in <span className="font-bold">{countdown}</span> seconds...
                  </span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={saveAttendanceLog}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Save Attendance Log
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Face Recognition</CardTitle>
          <CardDescription>
            {isAttendanceActive 
              ? 'Scanning for registered students...' 
              : 'Start attendance to begin scanning'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebcamCapture 
            onCapture={() => {}} // Not needed for attendance tracking
            isActive={isAttendanceActive}
            showButton={false}
          />
          
          {isAttendanceActive && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-3 bg-emerald-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Present</span>
                </div>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {presentStudents.length}
                </p>
              </div>
              
              <div className="p-3 bg-rose-50 rounded-md">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-rose-500" />
                  <span className="font-medium">Absent</span>
                </div>
                <p className="text-2xl font-bold text-rose-700 mt-1">
                  {students.length - presentStudents.length}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTracker;
