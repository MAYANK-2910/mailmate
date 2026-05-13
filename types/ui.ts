export type Theme = 'dark' | 'light';
export type ViewMode = 'stacks' | 'senders';
export type SortOrder = 'priority' | 'date' | 'unread';
export type PanelView = 'inbox' | 'preview' | 'settings';

export interface AppSettings {
  enableSmartStacks: boolean;
  enablePriorityRanking: boolean;
  enableFocusMode: boolean;
  viewMode: ViewMode;
  sortOrder: SortOrder;
  compactMode: boolean;
  keyboardShortcutsEnabled: boolean;
  hiddenCategories: string[];
  notificationsEnabled: boolean;
  autoRefreshInterval: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  enableSmartStacks: true,
  enablePriorityRanking: true,
  enableFocusMode: false,
  viewMode: 'stacks',
  sortOrder: 'priority',
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
