import { create } from 'zustand';
import type { AppSettings, Theme } from '../types/ui';
import { DEFAULT_SETTINGS } from '../types/ui';

interface SettingsStore extends AppSettings {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadSettings: (settings: AppSettings) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...DEFAULT_SETTINGS,

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  updateSettings: (settings) => set(settings),

  loadSettings: (settings) => set(settings),
}));
