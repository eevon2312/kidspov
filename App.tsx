import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { HomeView } from './components/HomeView';
import { CameraView } from './components/CameraView';
import { ResultView } from './components/ResultView';
import { LoadingView } from './components/LoadingView';
import { ErrorView } from './components/ErrorView';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { identifyObjectAndTranslate } from './services/geminiService';
import { SUPPORTED_LANGUAGES } from './constants';
import type { Language, RecognitionResult, AppState } from './types';
import { AppStateEnum } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppStateEnum.HOME);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState<number>(0);

  const handleCapture = useCallback(async (imageData: string) => {
    setCapturedImage(imageData);
    setAppState(AppStateEnum.LOADING);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await identifyObjectAndTranslate(ai, imageData);
      if (result.translations) {
        setRecognitionResult(result);
        setAppState(AppStateEnum.RESULT);
        setStars(prev => prev + 1); // Award a star for successful identification
      } else {
        throw new Error("Could not identify an object in the image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setAppState(AppStateEnum.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppStateEnum.CAMERA);
    setCapturedImage(null);
    setRecognitionResult(null);
    setError(null);
  }, []);

  const handleStart = useCallback(() => setAppState(AppStateEnum.CAMERA), []);
  const handleBackToHome = useCallback(() => setAppState(AppStateEnum.HOME), []);

  const renderContent = () => {
    switch (appState) {
      case AppStateEnum.HOME:
        return <HomeView onStart={handleStart} />;
      case AppStateEnum.CAMERA:
        return <CameraView onCapture={handleCapture} onBack={handleBackToHome} />;
      case AppStateEnum.LOADING:
        return <LoadingView />;
      case AppStateEnum.RESULT:
        if (capturedImage && recognitionResult) {
          return (
            <ResultView
              image={capturedImage}
              result={recognitionResult}
              selectedLanguage={selectedLanguage}
              onReset={handleReset}
              onGoHome={handleBackToHome}
            />
          );
        }
        // Fallback to error if data is missing
        handleReset();
        return null;
      case AppStateEnum.ERROR:
        return <ErrorView message={error || "An unknown error occurred."} onRetry={handleReset} />;
      default:
        return <HomeView onStart={handleStart} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col text-[#111111]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header stars={stars} showLanguageSelector={appState !== AppStateEnum.HOME}>
        <LanguageSelector
          languages={SUPPORTED_LANGUAGES}
          selectedLanguage={selectedLanguage}
          onSelect={setSelectedLanguage}
        />
      </Header>
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
