import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types/ui';
import { DEFAULT_SETTINGS } from '../types/ui';

interface SettingsStore extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadSettings: (settings: AppSettings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (settings) => set(settings),
      loadSettings: (settings) => set(settings),
    }),
    {
      name: 'mailman-settings',
    }
  )
);
