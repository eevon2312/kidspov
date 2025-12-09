
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, CloseIcon } from './icons';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const enableCamera = async () => {
      try {
        let mediaStream: MediaStream;
        
        try {
          // First try to get the environment (rear) camera
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
        } catch (envError) {
          console.warn("Could not access environment camera, falling back to default.", envError);
          // Fallback to any available video source
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }

        if (!isMounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Explicitly attempt to play the video to avoid black screens on some devices
          try {
            await videoRef.current.play();
          } catch (playError) {
            console.error("Error playing video stream:", playError);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error accessing camera:", err);
          setError("Could not access the camera. Please check permissions and try again.");
        }
      }
    };

    enableCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStreamReady = () => {
    setIsReady(true);
  };

  const handleCaptureClick = useCallback(() => {
    if (!isReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    
    // Ensure video has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight
      );
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
    }
  }, [onCapture, isReady]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-[#FAFAF7]">
        <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-lg text-center text-[#E57373] border border-black/5">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>Camera Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-[#666666] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-transform transform active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-900 flex items-center justify-center overflow-hidden">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        onLoadedMetadata={handleStreamReady}
        onCanPlay={handleStreamReady}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`} 
      />

      {!isReady && (
         <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white font-medium animate-pulse">Starting camera...</p>
         </div>
      )}

      <button
        onClick={onBack}
        className="absolute top-12 right-6 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 focus:outline-none focus:ring-4 focus:ring-white/50 transition-colors backdrop-blur-md z-10"
        aria-label="Go back"
      >
        <CloseIcon className="w-8 h-8" />
      </button>

      <div className="absolute bottom-12 w-full flex justify-center z-10">
        <button
          onClick={handleCaptureClick}
          disabled={!isReady}
          className={`p-4 bg-[#2E7D57] text-white rounded-full shadow-lg border-4 border-white/50 focus:outline-none focus:ring-4 focus:ring-[#2E7D57]/50 transition-all transform ${
            isReady 
              ? 'hover:bg-opacity-90 hover:scale-110 active:scale-100 cursor-pointer opacity-100' 
              : 'opacity-50 cursor-not-allowed scale-95'
          }`}
          aria-label="Capture photo"
        >
          <CameraIcon className="w-12 h-12" />
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
