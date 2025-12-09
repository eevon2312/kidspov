
export interface Language {
  name: string;
  code: string;
  voice: string;
}

export type Translations = Record<string, string>;

export interface RecognitionResult {
  translations: Translations | null;
  identifiedObject: string; // The English name for internal reference
}

export interface PronunciationResult {
  score: number; // 1 to 3
  feedback: string;
}

export interface Profile {
  id: string;
  name: string;
  coins: number;
  dailyGoal: number; // Number of words to learn
  dailyProgress: number;
  avatar: string; // Emoji or simple id
  // New fields from onboarding
  ageGroup?: string;
  gender?: string;
  targetLanguages?: string[]; // codes
  motivation?: string;
}

export enum AppStateEnum {
  ONBOARDING = 'ONBOARDING',
  PROFILE_SELECT = 'PROFILE_SELECT',
  DASHBOARD = 'DASHBOARD',
  CAMERA = 'CAMERA',
  LOADING = 'LOADING',
  LEARNING = 'LEARNING',
  ERROR = 'ERROR',
}

export type AppState = AppStateEnum;
