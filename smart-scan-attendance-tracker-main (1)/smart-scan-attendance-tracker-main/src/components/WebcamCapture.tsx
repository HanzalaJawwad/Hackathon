
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  isActive?: boolean;
  facingMode?: 'user' | 'environment';
  showButton?: boolean;
  buttonText?: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  isActive = false,
  facingMode = 'user',
  showButton = true,
  buttonText = 'Capture'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start webcam when component mounts or isActive changes
  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    // Cleanup function to stop webcam when component unmounts
    return () => {
      stopWebcam();
    };
  }, [isActive, facingMode]);

  const startWebcam = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const constraints = {
        video: {
          facingMode,
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access webcam. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !stream) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageSrc = canvas.toDataURL('image/jpeg');
    onCapture(imageSrc);
  };

  return (
    <div className="webcam-container">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 text-white p-4 text-center">
          <Camera className="h-10 w-10 mb-2 text-red-500" />
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={startWebcam} 
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      )}
      
      <video 
        ref={videoRef}
        className="webcam-video"
        autoPlay
        playsInline
        muted
      />
      
      <div className="webcam-overlay"></div>
      
      {showButton && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Button 
            onClick={captureImage} 
            disabled={isLoading || !stream || !!error}
            className="bg-attendance-primary hover:bg-attendance-primary/90"
          >
            <Camera className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </div>
      )}

      {isActive && stream && (
        <div className="absolute top-4 right-4">
          <span className="recording-indicator flex h-3 w-3 rounded-full bg-red-500"></span>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
