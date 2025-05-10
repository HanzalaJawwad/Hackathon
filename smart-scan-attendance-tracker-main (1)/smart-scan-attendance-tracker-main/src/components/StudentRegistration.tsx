
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Upload, Camera } from "lucide-react";
import { useAttendance } from '@/context/AttendanceContext';
import WebcamCapture from './WebcamCapture';

const StudentRegistration = () => {
  const { addStudent } = useAttendance();
  const [name, setName] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = (imageSrc: string) => {
    if (capturedImages.length < 5) {
      setCapturedImages(prev => [...prev, imageSrc]);
    }
    
    if (capturedImages.length === 4) {
      // After capturing 5 images, automatically finish the process
      setTimeout(() => {
        handleRegisterStudent();
      }, 500);
    }
  };

  const handleRegisterStudent = () => {
    if (!name.trim() || capturedImages.length === 0) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing of face data
    setTimeout(() => {
      addStudent(name);
      resetForm();
      setIsProcessing(false);
    }, 1500);
  };

  const resetForm = () => {
    setName('');
    setCapturedImages([]);
    setIsWebcamActive(false);
  };

  const startCapturing = () => {
    if (!name.trim()) {
      return;
    }
    setIsWebcamActive(true);
    setCapturedImages([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Add a new student to the attendance system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Student Name
            </label>
            <div className="flex gap-2">
              <Input 
                id="name" 
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isWebcamActive || isProcessing}
              />
              <Button 
                onClick={startCapturing} 
                disabled={!name.trim() || isWebcamActive || isProcessing}
              >
                <User className="w-4 h-4 mr-2" />
                Next
              </Button>
            </div>
          </div>
          
          {isWebcamActive && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Captured Images ({capturedImages.length}/5)</p>
              <div className="flex flex-wrap gap-2">
                {Array(5).fill(0).map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-16 h-16 rounded border-2 ${
                      index < capturedImages.length 
                        ? 'border-primary' 
                        : 'border-dashed border-gray-300'
                    } overflow-hidden bg-slate-100`}
                  >
                    {index < capturedImages.length ? (
                      <img 
                        src={capturedImages[index]} 
                        alt={`Capture ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleRegisterStudent} 
            disabled={!name.trim() || capturedImages.length < 5 || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">●</span>
                Processing...
              </>
            ) : (
              'Register Student'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Face Capture</CardTitle>
          <CardDescription>
            Capture 5 images of the student's face
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isWebcamActive ? (
            <WebcamCapture 
              onCapture={handleCapture} 
              isActive={isWebcamActive}
              showButton={capturedImages.length < 5 && !isProcessing}
              buttonText={`Capture (${capturedImages.length + 1}/5)`}
            />
          ) : (
            <div className="h-[320px] bg-slate-100 rounded-md flex flex-col items-center justify-center text-slate-500">
              <Camera className="w-12 h-12 mb-2" />
              <p>Enter student name to start</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRegistration;
