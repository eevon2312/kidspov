
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DashboardView } from './components/DashboardView';
import { CameraView } from './components/CameraView';
import { LearningView } from './components/LearningView';
import { LoadingView } from './components/LoadingView';
import { ErrorView } from './components/ErrorView';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { ProfileSelector } from './components/ProfileSelector';
import { OnboardingView } from './components/OnboardingView'; // New Import
import { identifyObjectAndTranslate } from './services/geminiService';
import { SUPPORTED_LANGUAGES, AVATARS } from './constants';
import type { Language, RecognitionResult, AppState, Profile } from './types';
import { AppStateEnum } from './types';

const STORAGE_KEY = 'povkids_profiles';

const App: React.FC = () => {
  // --- State ---
  const [appState, setAppState] = useState<AppState>(AppStateEnum.LOADING); // Start with loading to check auth
  
  // Profile State
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  // App Logic State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [error, setError] = useState<string | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedProfiles = JSON.parse(stored);
        if (parsedProfiles.length > 0) {
            setProfiles(parsedProfiles);
            setAppState(AppStateEnum.PROFILE_SELECT);
        } else {
            setAppState(AppStateEnum.ONBOARDING);
        }
      } catch (e) {
        console.error("Failed to load profiles", e);
        setAppState(AppStateEnum.ONBOARDING);
      }
    } else {
        setAppState(AppStateEnum.ONBOARDING);
    }
  }, []);

  const saveProfiles = (updatedProfiles: Profile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
  };

  const updateCurrentProfile = (updater: (p: Profile) => Profile) => {
    if (!currentProfile) return;
    const updated = updater({ ...currentProfile });
    setCurrentProfile(updated);
    const newProfiles = profiles.map(p => p.id === updated.id ? updated : p);
    saveProfiles(newProfiles);
  };

  // --- Handlers ---

  const handleOnboardingComplete = (profile: Profile) => {
      // Save the new profile created during onboarding
      const updated = [profile];
      saveProfiles(updated);
      setCurrentProfile(profile);
      
      // If language was selected during onboarding, use it
      if (profile.targetLanguages && profile.targetLanguages.length > 0) {
          const lang = SUPPORTED_LANGUAGES.find(l => l.code === profile.targetLanguages![0]);
          if (lang) setSelectedLanguage(lang);
      }

      setAppState(AppStateEnum.DASHBOARD);
  };

  const handleCreateProfile = (name: string, avatar: string) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name,
      avatar,
      coins: 0,
      dailyGoal: 5,
      dailyProgress: 0
    };
    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    setCurrentProfile(newProfile);
    setAppState(AppStateEnum.DASHBOARD);
  };

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    setAppState(AppStateEnum.DASHBOARD);
  };

  const handleSwitchProfile = () => {
    setCurrentProfile(null);
    setAppState(AppStateEnum.PROFILE_SELECT);
  };

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
        setAppState(AppStateEnum.LEARNING);
      } else {
        throw new Error("Could not identify an object in the image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setAppState(AppStateEnum.ERROR);
    }
  }, []);

  const handleLearningComplete = (score: number) => {
    // Award coins based on score
    const coinsEarned = score * 5; // 5 coins per star
    updateCurrentProfile(p => ({
        ...p,
        coins: p.coins + coinsEarned,
        dailyProgress: Math.min(p.dailyProgress + 1, p.dailyGoal) // Increment progress but cap visuals if needed
    }));
  };

  const handleReset = useCallback(() => {
    setAppState(AppStateEnum.CAMERA);
    setCapturedImage(null);
    setRecognitionResult(null);
    setError(null);
  }, []);

  const handleStart = useCallback(() => setAppState(AppStateEnum.CAMERA), []);
  const handleBackToDashboard = useCallback(() => setAppState(AppStateEnum.DASHBOARD), []);

  // --- Render ---

  const renderContent = () => {
    switch (appState) {
      case AppStateEnum.ONBOARDING:
        return <OnboardingView onComplete={handleOnboardingComplete} />;
      case AppStateEnum.PROFILE_SELECT:
        return (
            <ProfileSelector 
                profiles={profiles} 
                onSelect={handleSelectProfile} 
                onCreate={handleCreateProfile} 
            />
        );
      case AppStateEnum.DASHBOARD:
        if (!currentProfile) return null;
        return (
            <DashboardView 
                profile={currentProfile} 
                onStart={handleStart} 
                onChangeProfile={handleSwitchProfile}
            />
        );
      case AppStateEnum.CAMERA:
        return <CameraView onCapture={handleCapture} onBack={handleBackToDashboard} />;
      case AppStateEnum.LOADING:
        return <LoadingView />;
      case AppStateEnum.LEARNING:
        if (capturedImage && recognitionResult) {
          return (
            <LearningView
              image={capturedImage}
              result={recognitionResult}
              selectedLanguage={selectedLanguage}
              onReset={handleReset}
              onGoHome={handleBackToDashboard}
              onComplete={handleLearningComplete}
            />
          );
        }
        handleReset();
        return null;
      case AppStateEnum.ERROR:
        return <ErrorView message={error || "An unknown error occurred."} onRetry={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col text-[#111111]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {appState !== AppStateEnum.PROFILE_SELECT && appState !== AppStateEnum.ONBOARDING && currentProfile && (
        <Header 
            coins={currentProfile.coins} 
            showLanguageSelector={appState !== AppStateEnum.DASHBOARD && appState !== AppStateEnum.LOADING}
        >
            <LanguageSelector
            languages={SUPPORTED_LANGUAGES}
            selectedLanguage={selectedLanguage}
            onSelect={setSelectedLanguage}
            />
        </Header>
      )}
      <main className="flex-grow flex flex-col items-center justify-center relative bg-[#FAFAF7] overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
