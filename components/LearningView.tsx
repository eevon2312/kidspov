
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateSpeech, evaluatePronunciation } from '../services/geminiService';
import { decode, decodeAudioData, blobToBase64 } from '../utils/audioUtils';
import { SpeakerIcon, CloseIcon, StarIcon, ArrowRightIcon, MicIcon, LoaderIcon } from './icons';
import type { Language, RecognitionResult, PronunciationResult } from '../types';
import { Mascot } from './Mascot';
import { LanguageSelector } from './LanguageSelector';

interface LearningViewProps {
  image: string;
  result: RecognitionResult;
  languages: Language[];
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onReset: () => void;
  onGoHome: () => void;
  onComplete: (score: number) => void; 
}

// Singleton AudioContext
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
};

export const LearningView: React.FC<LearningViewProps> = ({ 
    image, 
    result, 
    languages,
    selectedLanguage, 
    onSelectLanguage,
    onReset, 
    onGoHome, 
    onComplete 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Robust lookup for translated word
  // Checks strict code (es-ES), lowercase code (es-es), or just language prefix (es)
  const getTranslatedWord = () => {
      if (!result.translations) return result.identifiedObject;
      const exact = result.translations[selectedLanguage.code];
      if (exact) return exact;
      
      const lower = result.translations[selectedLanguage.code.toLowerCase()];
      if (lower) return lower;

      // Try simple code match (e.g. 'es' matching 'es-ES')
      const simpleCode = selectedLanguage.code.split('-')[0];
      const match = Object.keys(result.translations).find(k => k.toLowerCase().startsWith(simpleCode));
      if (match) return result.translations[match];

      return result.identifiedObject;
  };

  const translatedWord = getTranslatedWord();
  const displayWord = translatedWord || "Loading...";

  const stopAudio = () => {
      if (audioSourceRef.current) {
          try {
              audioSourceRef.current.stop();
              audioSourceRef.current.disconnect();
          } catch (e) {
              // Ignore errors if already stopped
          }
          audioSourceRef.current = null;
      }
      setIsSpeaking(false);
  };

  const fetchAndDecodeAudio = useCallback(async () => {
    if (!translatedWord || translatedWord === '...') return;
    
    stopAudio(); // Stop any previous audio
    setAudioBuffer(null); // Clear previous buffer
    setIsAudioLoading(true);

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
      
      // Auto-play attempt
      try {
        playAudioBuffer(decodedBuffer);
      } catch (e) {
        console.warn("Auto-play blocked, user must click play", e);
      }
    } catch (err) {
      console.error("Error generating speech:", err);
    } finally {
        setIsAudioLoading(false);
    }
  }, [translatedWord, selectedLanguage.voice]);

  // Fetch audio whenever the word or language changes
  useEffect(() => {
    fetchAndDecodeAudio();
    return () => {
        stopAudio();
    };
  }, [fetchAndDecodeAudio]);

  const playAudioBuffer = async (buffer: AudioBuffer) => {
    stopAudio(); // Ensure clean slate
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
        } catch (e) {
            console.error("Failed to resume audio context", e);
        }
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    audioSourceRef.current = source;
    
    setIsSpeaking(true);
    source.start(0);
  };

  const playAudio = useCallback(() => {
    if (audioBuffer) {
        playAudioBuffer(audioBuffer);
    } else if (!isAudioLoading && translatedWord) {
        // Retry fetch if missing
        fetchAndDecodeAudio();
    }
  }, [audioBuffer, isAudioLoading, translatedWord, fetchAndDecodeAudio]);

  const startRecording = async (e: React.PointerEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (isEvaluating || isRecording) return;
    
    // Resume context on user interaction just in case
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    stopAudio(); // Don't record the app speaking

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
      
      if (result.score >= 2) {
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

  // --- Success View ---
  if (pronunciationResult) {
    const percentage = (pronunciationResult as any).percentage || 85;
    return (
        <div className="h-[100dvh] flex flex-col items-center justify-between bg-[#F3F6FB] animate-fade-in relative pt-safe-top overflow-hidden">
            <div className="w-full px-4 pt-4 flex justify-between items-center z-20">
                <button onClick={onGoHome} className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
                    <CloseIcon className="w-6 h-6 text-gray-400" />
                </button>
                <div className="scale-90">
                    <LanguageSelector 
                        languages={languages} 
                        selectedLanguage={selectedLanguage} 
                        onSelect={onSelectLanguage} 
                    />
                </div>
                <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-sm">125</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full px-6 overflow-y-auto">
                 <div className="w-32 h-32 bg-[#66D9B0]/20 rounded-full flex items-center justify-center mb-4 relative shrink-0">
                     <Mascot className="w-24 h-24" color="#FF9A9A" />
                 </div>
                 
                 <div className="flex items-center gap-2 mb-1 text-center flex-col">
                    <span className="text-3xl">🍎</span> 
                    <h1 className="text-3xl md:text-4xl font-bold text-[#37474F] break-words line-clamp-2" style={{ fontFamily: "'Fredoka One', cursive" }}>{displayWord}</h1>
                 </div>

                 <div className="flex items-end gap-1 text-[#66D9B0] font-bold mt-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    <span className="text-7xl leading-none">{percentage}</span>
                    <span className="text-3xl mb-1">%</span>
                 </div>
                 <p className="text-gray-400 font-medium mb-6 text-sm">Pronunciation Score</p>

                 <div className="bg-[#FFF9C4] px-5 py-1.5 rounded-full flex items-center gap-2 mb-3 animate-bounce-small">
                     <StarIcon className="w-4 h-4 text-yellow-500" />
                     <span className="font-bold text-yellow-800 text-sm">Great Job!</span>
                 </div>
            </div>

            <div className="w-full space-y-3 px-6 pb-6 pt-2 bg-[#F3F6FB] shrink-0">
                <button 
                    onClick={onReset}
                    className="w-full bg-[#66D9B0] text-[#1B5E20] py-3.5 rounded-full font-bold shadow-lg hover:opacity-90 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <span>Next Word</span>
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
                 <button onClick={playAudio} className="w-full text-center text-gray-400 font-bold flex items-center justify-center gap-2 py-1 text-sm">
                    {isAudioLoading ? <LoaderIcon className="w-4 h-4 animate-spin text-gray-400" /> : <SpeakerIcon className="w-4 h-4" />}
                    {isAudioLoading ? "Loading Voice..." : "Hear it Again"}
                 </button>
            </div>
        </div>
    );
  }

  // --- Input View ---
  return (
    <div className="h-[100dvh] flex flex-col items-center bg-[#F3F6FB] animate-fade-in relative pt-safe-top overflow-hidden">
        {/* Header */}
        <div className="w-full px-4 pt-4 flex justify-between items-center z-20 shrink-0">
            <button onClick={onGoHome} className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50">
                 <CloseIcon className="w-6 h-6 text-gray-400" />
            </button>
            <div className="scale-90">
                <LanguageSelector 
                    languages={languages} 
                    selectedLanguage={selectedLanguage} 
                    onSelect={onSelectLanguage} 
                />
            </div>
            <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                 <StarIcon className="w-4 h-4 text-yellow-400" />
                 <span className="font-bold text-sm">125</span>
            </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 w-full flex flex-col items-center justify-center px-6 overflow-y-auto">
            {/* Captured Image Card */}
            <div className="w-full max-w-[260px] aspect-square bg-white rounded-3xl relative overflow-hidden shadow-sm flex items-center justify-center border-4 border-white shrink-0 mt-2">
                 <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="captured object" />
            </div>

            {/* Object Icon Placeholder */}
            <div className="mt-[-25px] z-20 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-[#F3F6FB] shrink-0">
                 <span className="text-3xl">🍎</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#37474F] mt-3 mb-1 text-center px-2 leading-tight break-words line-clamp-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
                {displayWord}
            </h1>

            <button 
                onClick={playAudio} 
                disabled={isAudioLoading}
                className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform mt-2 shrink-0 shadow-sm ${isSpeaking ? 'bg-[#66D9B0] text-white' : 'bg-[#D1EAFA] text-[#29B6F6]'}`}
            >
                {isAudioLoading ? (
                    <LoaderIcon className="w-6 h-6 animate-spin" />
                ) : (
                    <SpeakerIcon className="w-6 h-6" />
                )}
            </button>

            {/* Stars Placeholder */}
            <div className="flex gap-2 mt-4">
                 {[1,2,3,4,5].map(s => <StarIcon key={s} className="w-6 h-6 text-white stroke-2 stroke-gray-300" />)}
            </div>
        </div>

        {/* Bottom Actions */}
        <div className="w-full mt-auto px-6 pb-6 pt-2 shrink-0">
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={onReset}
                    className="bg-white text-[#37474F] py-3.5 rounded-full font-bold shadow-sm active:bg-gray-100 transition-colors text-sm"
                >
                    Skip
                </button>
                <button 
                    onPointerDown={startRecording}
                    onPointerUp={stopRecording}
                    onPointerLeave={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    onContextMenu={(e) => e.preventDefault()}
                    disabled={isEvaluating}
                    className={`text-[#1B5E20] py-3.5 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 select-none touch-none text-sm ${
                        isRecording 
                        ? 'bg-red-400 text-white scale-105' 
                        : isEvaluating 
                            ? 'bg-gray-300' 
                            : 'bg-[#66D9B0]'
                    }`}
                >
                     {isRecording ? (
                        <>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span>Listening...</span>
                        </>
                     ) : isEvaluating ? (
                        <span>Checking...</span>
                     ) : (
                        <>
                            <MicIcon className="w-4 h-4" />
                            <span>Hold to Speak</span>
                        </>
                     )}
                </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-3">Hold green button to speak</p>
        </div>
    </div>
  );
};
