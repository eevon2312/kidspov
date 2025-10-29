export interface Language {
  name: string;
  code: string;
  voice: string;
}

export type Translations = Record<string, string>;

export interface RecognitionResult {
  translations: Translations | null;
}

export enum AppStateEnum {
  HOME = 'HOME',
  CAMERA = 'CAMERA',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
}

export type AppState = AppStateEnum;