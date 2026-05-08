export type Theme = 'dark' | 'light';
export type ViewMode = 'stacks' | 'senders';
export type SortOrder = 'priority' | 'date' | 'unread';
export type PanelView = 'inbox' | 'preview' | 'settings';

export interface AppSettings {
  theme: Theme;
  viewMode: ViewMode;
  sortOrder: SortOrder;
  focusMode: boolean;
  compactMode: boolean;
  keyboardShortcutsEnabled: boolean;
  hiddenCategories: string[];
  notificationsEnabled: boolean;
  autoRefreshInterval: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  viewMode: 'stacks',
  sortOrder: 'priority',
  focusMode: false,
  compactMode: false,
  keyboardShortcutsEnabled: true,
  hiddenCategories: [],
  notificationsEnabled: true,
  autoRefreshInterval: 60000,
};

export interface KeyboardShortcut {
  key: string;
  modifiers: Array<'ctrl' | 'shift' | 'alt' | 'meta'>;
  action: string;
  label: string;
}
