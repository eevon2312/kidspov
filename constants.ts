import type { Language } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { name: 'English', code: 'en-US', voice: 'Zephyr' },
  { name: 'Español', code: 'es-ES', voice: 'Puck' }, // Spanish
  { name: '中文 (Chinese)', code: 'zh-CN', voice: 'Kore' }, // Mandarin
  { name: 'Bahasa Melayu', code: 'ms-MY', voice: 'Fenrir' }, // Malay
  { name: 'हिन्दी (Hindi)', code: 'hi-IN', voice: 'Puck' }, // Hindi
  { name: 'العربية (Arabic)', code: 'ar-XA', voice: 'Zephyr' }, // Arabic
  { name: 'Français', code: 'fr-FR', voice: 'Charon' }, // French
  { name: 'Português', code: 'pt-BR', voice: 'Puck' }, // Portuguese
  { name: 'Русский (Russian)', code: 'ru-RU', voice: 'Fenrir' }, // Russian
  { name: '日本語 (Japanese)', code: 'ja-JP', voice: 'Kore' }, // Japanese
  { name: 'Deutsch', code: 'de-DE', voice: 'Puck' }, // German
];

export const AVATARS = ['🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦄', '🐲'];
