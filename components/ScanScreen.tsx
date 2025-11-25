import React, { useState, useRef, useEffect } from 'react';
import { ScanResult } from '../types';
import { analyzeImage } from '../services/aiService';

interface ScanScreenProps {
  onComplete: (result: ScanResult) => void;
  onBack: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onComplete, onBack }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks and clear references
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      stopCamera(); // Ensure previous stream is closed

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      // Detailed error handling
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera permission denied. Please allow access or use upload.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No camera found on this device.");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError("Camera is in use by another app.");
      } else {
        setError("Unable to access camera. Please try again or upload.");
      }
    }
  };

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    try {
      const result = await analyzeImage(capturedImage);
      onComplete(result);
    } catch (err) {
      setError("Analysis failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6">
        <div className="relative w-24 h-24 mb-8">
           <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-medical-primary rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center text-2xl">🧬</div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analyzing Biomarkers</h2>
        <p className="text-slate-500 text-center text-sm">Extracting spectral features and vascular patterns...</p>
        
        <div className="mt-8 w-full max-w-xs space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             Checking exposure...
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600" style={{animationDelay: '0.5s'}}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             Calibrating skin tone...
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600" style={{animationDelay: '1s'}}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             Estimating hemoglobin...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black relative">
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onBack} className="text-white p-2 rounded-full bg-white/20 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-white font-medium">Scan Nailbed</span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-medical-accent rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-medical-accent rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-medical-accent rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-medical-accent rounded-br-xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-center w-full px-4">
                    <p className="text-sm font-medium shadow-black drop-shadow-md">Place nailbed in frame</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error State Overlay */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900/95 z-20">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="mb-8 text-lg font-medium text-slate-200 max-w-xs">
                  {error}
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button 
                    onClick={() => startCamera()}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Retry Camera
                  </button>
                  <label className="bg-medical-primary hover:bg-cyan-600 text-white px-6 py-4 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-6 bg-slate-900 rounded-t-3xl -mt-6 relative z-10">
        {!capturedImage ? (
          <div className="flex justify-center items-center gap-8">
            <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white transition-colors hover:bg-slate-700" onClick={() => document.getElementById('hidden-input')?.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input id="hidden-input" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </button>
            <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!error}>
              <div className="w-16 h-16 bg-medical-primary rounded-full"></div>
            </button>
            <div className="w-12 h-12"></div> {/* Spacer for balance */}
          </div>
        ) : (
          <div className="flex gap-4">
             <button onClick={handleRetake} className="flex-1 py-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors">
               Retake
             </button>
             <button onClick={handleAnalyze} className="flex-1 py-4 rounded-xl bg-medical-primary text-white font-bold shadow-lg shadow-cyan-900/50 hover:bg-cyan-600 transition-colors">
               Analyze
             </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScanScreen;