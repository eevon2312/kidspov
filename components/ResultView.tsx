import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { SpeakerIcon, ReplayIcon, HomeIcon } from './icons';
import type { Language, RecognitionResult } from '../types';

interface ResultViewProps {
  image: string;
  result: RecognitionResult;
  selectedLanguage: Language;
  onReset: () => void;
  onGoHome: () => void;
}

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

export const ResultView: React.FC<ResultViewProps> = ({ image, result, selectedLanguage, onReset, onGoHome }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const translatedWord = result.translations?.[selectedLanguage.code.split('-')[0]] || '...';

  const fetchAndDecodeAudio = useCallback(async () => {
    if (!translatedWord || translatedWord === '...') return;

    setIsSpeaking(true);
    setError(null);
    try {
      if (!process.env.API_KEY) throw new Error("API Key not found");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Audio = await generateSpeech(ai, translatedWord, selectedLanguage.voice);
      const decodedBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContext,
        24000,
        1
      );
      setAudioBuffer(decodedBuffer);
    } catch (err) {
      console.error("Error generating or decoding speech:", err);
      setError("Sorry, I couldn't say that word.");
      setAudioBuffer(null);
    } finally {
      setIsSpeaking(false);
    }
  }, [translatedWord, selectedLanguage.voice]);

  useEffect(() => {
    fetchAndDecodeAudio();
  }, [fetchAndDecodeAudio]);

  const playAudio = useCallback(() => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (audioBuffer && audioContext) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  }, [audioBuffer]);

  useEffect(() => {
    if (audioBuffer) {
      playAudio();
    }
  }, [audioBuffer, playAudio]);

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-4 animate-fade-in border border-black/5">
      <img src={image} alt="Captured object" className="w-full h-auto aspect-video object-contain rounded-2xl bg-slate-100" />
      <div className="text-center my-2">
        <h2 className="text-5xl md:text-6xl font-bold text-[#111111]" style={{ fontFamily: "'Fredoka One', cursive" }}>{translatedWord}</h2>
        <p className="text-[#666666] mt-2 text-lg">{selectedLanguage.name}</p>
      </div>
      <div className="flex items-center gap-4 mt-4 w-full justify-center">
        <button
          onClick={playAudio}
          disabled={isSpeaking || !audioBuffer}
          className="p-4 bg-[#8BC34A] text-white rounded-full shadow-lg hover:opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#8BC34A]/50 transition-transform transform hover:scale-110"
          aria-label="Play pronunciation"
        >
          <SpeakerIcon className="w-8 h-8" />
        </button>
        <button
          onClick={onReset}
          className="p-4 bg-[#D4E3FA] text-[#111111] rounded-full shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#D4E3FA]/50 transition-transform transform hover:scale-110"
          aria-label="Try again"
        >
          <ReplayIcon className="w-8 h-8" />
        </button>
        <button
          onClick={onGoHome}
          className="p-4 bg-[#666666] text-white rounded-full shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#666666]/50 transition-transform transform hover:scale-110"
          aria-label="Go to home screen"
        >
          <HomeIcon className="w-8 h-8" />
        </button>
      </div>
      {error && <p className="text-[#E57373] mt-4 text-sm font-medium">{error}</p>}
    </div>
  );
};
