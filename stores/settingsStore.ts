import { create } from 'zustand';
import { CompanionSettings } from '../types';

interface SettingsState extends CompanionSettings {
  setName: (name: string) => void;
  setPersonality: (p: string) => void;
  setTheme: (theme: 'clair' | 'sombre' | 'auto') => void;
  setPrimaryColor: (color: string) => void;
  setTextSize: (size: 'petit' | 'moyen' | 'grand') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  name: 'Compagnon',
  personality: 'chaleureux, gentil, curieux, créatif, encourageant, parfois taquin',
  speakingStyle: 'naturel et bienveillant',
  familiarityLevel: 3,
  theme: 'auto',
  primaryColor: '#7c6aef',
  textSize: 'moyen',

  setName: (name) => set({ name }),
  setPersonality: (personality) => set({ personality }),
  setTheme: (theme) => set({ theme }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setTextSize: (textSize) => set({ textSize }),
}));
