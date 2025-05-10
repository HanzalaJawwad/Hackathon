
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useAttendance } from '@/context/AttendanceContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const DataManagement = () => {
  const { backupData, students, isProcessing } = useAttendance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRestoreFile(e.target.files[0]);
    }
  };

  const handleRestoreBackup = () => {
    if (!restoreFile) return;
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        
        // Validate backup format
        if (!backupData.students || !backupData.logs || !backupData.backupDate) {
          throw new Error('Invalid backup file format');
        }
        
        // Store data in localStorage
        localStorage.setItem('attendance_students', JSON.stringify(backupData.students));
        localStorage.setItem('attendance_logs', JSON.stringify(backupData.logs));
        
        // Close dialog and reload page to apply changes
        setIsDialogOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Failed to restore backup:', error);
        alert('Failed to restore backup. Invalid file format.');
      }
    };
    reader.readAsText(restoreFile);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Backup</CardTitle>
          <CardDescription>
            Create a backup of all your attendance data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Backup includes all student records, attendance logs, and system settings.
            We recommend creating regular backups to prevent data loss.
          </p>
          
          <div className="p-4 bg-blue-50 rounded-md flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Backup Information</h4>
              <ul className="mt-1 text-sm text-blue-700 space-y-1">
                <li>• {students.length} registered students</li>
                <li>• All attendance logs</li>
                <li>• System configurations</li>
              </ul>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={backupData}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">●</span>
                Creating Backup...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Create Backup
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Restore</CardTitle>
          <CardDescription>
            Restore from a previous backup file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Restoring from a backup will replace all current data including students, 
            attendance records, and settings. This action cannot be undone.
          </p>
          
          <div className="p-4 bg-amber-50 rounded-md flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
              <Upload className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-800">Important Warning</h4>
              <p className="mt-1 text-sm text-amber-700">
                Restoring will overwrite all existing data. Make sure to create a backup
                of your current data before proceeding.
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Restore from Backup
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore from Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Select a backup file to restore your data. This will overwrite all existing data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-3">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-white
                hover:file:cursor-pointer"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestoreBackup}
              disabled={!restoreFile}
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataManagement;
