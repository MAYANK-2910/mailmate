import type { AppSettings } from '../types/ui';
import { DEFAULT_SETTINGS } from '../types/ui';

const SETTINGS_KEY = 'mailman-settings';

export async function getSettings(): Promise<AppSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(SETTINGS_KEY, (result) => {
      const stored = result[SETTINGS_KEY] as Partial<AppSettings> | undefined;
      resolve({ ...DEFAULT_SETTINGS, ...stored });
    });
  });
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [SETTINGS_KEY]: updated }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

export function onSettingsChange(callback: (settings: AppSettings) => void): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => {
    if (areaName === 'local' && changes[SETTINGS_KEY]) {
      const newSettings = changes[SETTINGS_KEY].newValue as AppSettings;
      callback({ ...DEFAULT_SETTINGS, ...newSettings });
    }
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
