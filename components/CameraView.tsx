import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, CloseIcon } from './icons';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions and try again.");
      }
    };
    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCaptureClick = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData);
      }
    }
  }, [onCapture]);

  if (error) {
    return (
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg text-center text-red-500">
        <h2 className="text-xl font-bold mb-4">Camera Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <button
        onClick={onBack}
        className="absolute top-6 right-6 p-2 bg-white/80 text-[#111111] rounded-full hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/50 transition-colors backdrop-blur-sm"
        aria-label="Go back"
      >
        <CloseIcon className="w-8 h-8" />
      </button>
      <div className="absolute bottom-8 w-full flex justify-center">
        <button
          onClick={handleCaptureClick}
          className="p-4 bg-[#2E7D57] text-white rounded-full shadow-lg border-4 border-white/50 hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2E7D57]/50 transition-transform transform hover:scale-110 active:scale-100"
          aria-label="Capture photo"
        >
          <CameraIcon className="w-12 h-12" />
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
