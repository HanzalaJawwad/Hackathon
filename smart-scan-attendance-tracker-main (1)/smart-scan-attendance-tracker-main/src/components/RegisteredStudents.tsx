
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAttendance } from '@/context/AttendanceContext';
import { User } from "lucide-react";

const RegisteredStudents = () => {
  const { students, autoRestoreStudents } = useAttendance();

  // Auto-restore students on component mount
  useEffect(() => {
    autoRestoreStudents();
  }, [autoRestoreStudents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Registered Students
        </CardTitle>
        <CardDescription>
          List of all students registered in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Attendance Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{new Date(student.dateAdded).toLocaleDateString()}</TableCell>
                  <TableCell>{student.attendanceCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No students registered yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegisteredStudents;
