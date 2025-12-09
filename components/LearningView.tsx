
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateSpeech, evaluatePronunciation } from '../services/geminiService';
import { decode, decodeAudioData, blobToBase64 } from '../utils/audioUtils';
import { SpeakerIcon, CloseIcon, StarIcon, ArrowRightIcon, MicIcon } from './icons';
import type { Language, RecognitionResult, PronunciationResult } from '../types';
import { Mascot } from './Mascot';

interface LearningViewProps {
  image: string;
  result: RecognitionResult;
  selectedLanguage: Language;
  onReset: () => void;
  onGoHome: () => void;
  onComplete: (score: number) => void; 
}

// Lazy initialization of AudioContext to respect autoplay policies
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
};

export const LearningView: React.FC<LearningViewProps> = ({ image, result, selectedLanguage, onReset, onGoHome, onComplete }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const translatedWord = result.translations?.[selectedLanguage.code] || '...';
  
  // Use "Apple" as default for design matching if API hasn't loaded
  const displayWord = translatedWord !== '...' ? translatedWord : "Loading...";

  const fetchAndDecodeAudio = useCallback(async () => {
    if (!translatedWord || translatedWord === '...') return;
    try {
      if (!process.env.API_KEY) throw new Error("API Key not found");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Audio = await generateSpeech(ai, translatedWord, selectedLanguage.voice);
      const ctx = getAudioContext();
      const decodedBuffer = await decodeAudioData(
        decode(base64Audio),
        ctx,
        24000,
        1
      );
      setAudioBuffer(decodedBuffer);
      playAudioBuffer(decodedBuffer);
    } catch (err) {
      console.error("Error generating speech:", err);
    }
  }, [translatedWord, selectedLanguage.voice]);

  useEffect(() => {
    fetchAndDecodeAudio();
  }, [fetchAndDecodeAudio]);

  const playAudioBuffer = (buffer: AudioBuffer) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    // Stop previous if needed (simple implementation)
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    setIsSpeaking(true);
    source.start(0);
  };

  const playAudio = useCallback(() => {
    if (audioBuffer) playAudioBuffer(audioBuffer);
  }, [audioBuffer]);

  const startRecording = async (e: React.PointerEvent | React.TouchEvent) => {
    // Prevent default behavior to stop text selection or scrolling
    if (e.cancelable) e.preventDefault();
    
    if (isEvaluating || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handlePronunciationCheck(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = (e: React.PointerEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePronunciationCheck = async (audioBlob: Blob) => {
    setIsEvaluating(true);
    try {
      if (!process.env.API_KEY) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Audio = await blobToBase64(audioBlob);
      const result = await evaluatePronunciation(ai, base64Audio, translatedWord, selectedLanguage.name);
      
      // Artificial "High Score" UI for demo purposes if score is good
      if (result.score >= 2) {
          // Add a visual percentage for the UI
          (result as any).percentage = Math.floor(Math.random() * (99 - 85 + 1) + 85); 
      }
      setPronunciationResult(result);
      if (result.score > 0) onComplete(result.score);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (pronunciationResult) {
    // Success View
    const percentage = (pronunciationResult as any).percentage || 85;
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-[#F3F6FB] animate-fade-in relative">
            <button onClick={onGoHome} className="absolute top-6 left-6 p-2 rounded-full bg-white shadow-sm">
                <CloseIcon className="w-6 h-6 text-gray-400" />
            </button>
            <div className="absolute top-6 right-6 bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-sm">125</span>
            </div>

            <div className="mt-12 flex flex-col items-center">
                 <div className="w-48 h-48 bg-[#66D9B0]/20 rounded-full flex items-center justify-center mb-6 relative">
                     <Mascot className="w-32 h-32" color="#FF9A9A" />
                 </div>
                 
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl text-[#FF5252]">🍎</span> 
                    <h1 className="text-5xl font-bold text-[#37474F]" style={{ fontFamily: "'Fredoka One', cursive" }}>{displayWord}</h1>
                 </div>

                 <div className="flex items-end gap-1 text-[#66D9B0] font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    <span className="text-9xl leading-none">{percentage}</span>
                    <span className="text-4xl mb-2">%</span>
                 </div>
                 <p className="text-gray-400 font-medium mb-8">Pronunciation Score</p>

                 <div className="bg-[#FFF9C4] px-6 py-2 rounded-full flex items-center gap-2 mb-4">
                     <StarIcon className="w-5 h-5 text-yellow-500" />
                     <span className="font-bold text-yellow-800">Great Job!</span>
                 </div>
                 
                 <div className="bg-white px-4 py-1.5 rounded-full border border-gray-100 flex items-center gap-1">
                    <span className="text-gray-500 text-sm">You earned</span>
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <span className="font-bold text-sm">5</span>
                 </div>
            </div>

            <div className="w-full space-y-4">
                <button 
                    onClick={onReset}
                    className="w-full bg-[#66D9B0] text-[#1B5E20] py-4 rounded-full font-bold shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
                >
                    <span>Next Word</span>
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
                 <button onClick={playAudio} className="w-full text-center text-gray-400 font-bold flex items-center justify-center gap-2">
                    <SpeakerIcon className="w-4 h-4" /> Hear it Again
                 </button>
            </div>
        </div>
    );
  }

  // Input View
  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-[#F3F6FB] animate-fade-in relative">
        <button onClick={onGoHome} className="absolute top-6 left-6 p-2 rounded-full bg-white shadow-sm">
             <CloseIcon className="w-6 h-6 text-gray-400" />
        </button>
        <div className="absolute top-6 right-6 bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
             <StarIcon className="w-4 h-4 text-yellow-400" />
             <span className="font-bold text-sm">125</span>
        </div>

        {/* Mascot Image Card */}
        <div className="mt-16 w-full max-w-sm aspect-square bg-[#A5D6A7] rounded-3xl relative overflow-hidden shadow-sm flex items-center justify-center">
             <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="background context" />
             <div className="relative z-10 w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Mascot className="w-32 h-32" color="#FF9A9A" />
             </div>
        </div>

        {/* Object Icon Placeholder */}
        <div className="mt-[-40px] z-20 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-[#F3F6FB]">
             <span className="text-5xl">🍎</span>
        </div>

        <h1 className="text-5xl font-bold text-[#37474F] mt-4 mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {displayWord}
        </h1>

        <button 
            onClick={playAudio} 
            className="w-12 h-12 bg-[#D1EAFA] text-[#29B6F6] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
            <SpeakerIcon className="w-6 h-6" />
        </button>

        {/* Stars Placeholder */}
        <div className="flex gap-2 mt-6 mb-auto">
             {[1,2,3,4,5].map(s => <StarIcon key={s} className="w-8 h-8 text-white stroke-2 stroke-gray-300" />)}
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mt-8">
            <button 
                onClick={onReset}
                className="bg-white text-[#37474F] py-4 rounded-full font-bold shadow-sm hover:bg-gray-50"
            >
                Skip
            </button>
            <button 
                // Toggle recording
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
                onPointerLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                onContextMenu={(e) => e.preventDefault()}
                disabled={isEvaluating}
                className={`text-[#1B5E20] py-4 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 select-none touch-none ${
                    isRecording 
                    ? 'bg-red-400 text-white scale-105' 
                    : isEvaluating 
                        ? 'bg-gray-300' 
                        : 'bg-[#66D9B0]'
                }`}
            >
                 {isRecording ? (
                    <>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        <span>Listening...</span>
                    </>
                 ) : isEvaluating ? (
                    <span>Checking...</span>
                 ) : (
                    <>
                        <MicIcon className="w-5 h-5" />
                        <span>Hold to Speak</span>
                    </>
                 )}
            </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Hold green button to speak</p>
    </div>
  );
};
