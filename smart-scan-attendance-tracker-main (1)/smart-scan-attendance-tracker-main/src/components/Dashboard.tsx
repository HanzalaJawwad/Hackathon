
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAttendance } from '@/context/AttendanceContext';
import StudentRegistration from './StudentRegistration';
import AttendanceTracker from './AttendanceTracker';
import AttendanceHistory from './AttendanceHistory';
import DataManagement from './DataManagement';

const Dashboard = () => {
  const { students, presentStudents, isAttendanceActive } = useAttendance();

  return (
    <div className="container py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-attendance-secondary">
          Smart Attendance System
        </h1>
        <p className="text-muted-foreground">
          Face recognition-based attendance tracking
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Registered Students</CardTitle>
            <CardDescription>Total students in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-attendance-primary">
              {students.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Present Today</CardTitle>
            <CardDescription>Students marked present</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-500">
              {presentStudents.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Absent Today</CardTitle>
            <CardDescription>Students not present</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-rose-500">
              {students.length - presentStudents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Take Attendance</TabsTrigger>
          <TabsTrigger value="register">Register Students</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="management">Data Management</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          <AttendanceTracker />
        </TabsContent>
        <TabsContent value="register">
          <StudentRegistration />
        </TabsContent>
        <TabsContent value="history">
          <AttendanceHistory />
        </TabsContent>
        <TabsContent value="management">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
