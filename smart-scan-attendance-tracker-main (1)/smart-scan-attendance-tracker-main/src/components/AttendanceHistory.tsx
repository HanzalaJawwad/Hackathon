
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttendanceLog } from '@/types/attendance';

const AttendanceHistory = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  useEffect(() => {
    // Load attendance logs from localStorage
    const savedLogs = localStorage.getItem('attendance_logs');
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setLogs(parsedLogs);
        
        // Select most recent log by default if available
        if (parsedLogs.length > 0) {
          setSelectedLog(parsedLogs[0]);
        }
      } catch (error) {
        console.error('Failed to parse logs:', error);
      }
    }
  }, []);

  const exportAttendanceCSV = (log: AttendanceLog) => {
    // Create CSV content
    const headers = ["Student Name", "Status"];
    const rows = [
      ...log.presentStudents.map(name => [name, "Present"]),
      ...log.absentStudents.map(name => [name, "Absent"])
    ];
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${log.date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Attendance Logs</CardTitle>
          <CardDescription>
            Select a date to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No attendance logs available
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {logs.map((log, index) => (
                <button
                  key={`${log.date}-${index}`}
                  className={`w-full flex justify-between items-center p-3 rounded-md text-left ${
                    selectedLog && selectedLog.date === log.date
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{log.date}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {log.presentStudents.length}/{log.totalStudents}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>
            {selectedLog ? `Log for ${selectedLog.date}` : 'Select a log to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedLog ? (
            <div className="py-12 text-center text-muted-foreground">
              No log selected
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Attendance Rate</p>
                  <p className="text-3xl font-bold">
                    {Math.round((selectedLog.presentStudents.length / selectedLog.totalStudents) * 100)}%
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportAttendanceCSV(selectedLog)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Present ({selectedLog.presentStudents.length})
                  </h3>
                  <div className="bg-slate-50 rounded-md p-2 max-h-[240px] overflow-y-auto">
                    {selectedLog.presentStudents.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedLog.presentStudents.map((name, index) => (
                          <li 
                            key={`present-${index}`}
                            className="p-2 bg-white rounded text-sm"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        No students present
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-medium">
                    <X className="w-4 h-4 text-rose-500" />
                    Absent ({selectedLog.absentStudents.length})
                  </h3>
                  <div className="bg-slate-50 rounded-md p-2 max-h-[240px] overflow-y-auto">
                    {selectedLog.absentStudents.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedLog.absentStudents.map((name, index) => (
                          <li 
                            key={`absent-${index}`}
                            className="p-2 bg-white rounded text-sm"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        No students absent
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
