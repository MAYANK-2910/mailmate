import { create } from 'zustand';
import type { Email } from '../types/email';
import type { Stack, SenderGroup } from '../types/stack';
import type { ViewMode, SortOrder, PanelView } from '../types/ui';

interface EmailStore {
  emails: Email[];
  stacks: Stack[];
  senderGroups: SenderGroup[];
  selectedEmail: Email | null;
  selectedStackId: string | null;
  viewMode: ViewMode;
  sortOrder: SortOrder;
  panelView: PanelView;
  focusMode: boolean;
  searchQuery: string;
  searchResults: Email[];
  isSearchOpen: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  totalUnread: number;

  isMinimized: boolean;

  setEmails: (emails: Email[]) => void;
  setStacks: (stacks: Stack[]) => void;
  setSenderGroups: (groups: SenderGroup[]) => void;
  selectEmail: (email: Email | null) => void;
  selectStack: (stackId: string | null) => void;
  toggleStackCollapse: (stackId: string) => void;
  toggleSenderExpand: (senderId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortOrder: (order: SortOrder) => void;
  setPanelView: (view: PanelView) => void;
  setFocusMode: (enabled: boolean) => void;
  toggleFocusMode: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Email[]) => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setError: (error: string | null) => void;
  setMinimized: (minimized: boolean) => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  emails: [],
  stacks: [],
  senderGroups: [],
  selectedEmail: null,
  selectedStackId: null,
  viewMode: 'stacks',
  sortOrder: 'priority',
  panelView: 'inbox',
  focusMode: false,
  searchQuery: '',
  searchResults: [],
  isSearchOpen: false,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  totalUnread: 0,
  isMinimized: true, // Start minimized so user isn't immediately blocked until they want it

  setEmails: (emails) =>
    set({
      emails,
      totalUnread: emails.filter((e) => e.isUnread).length,
    }),

  setStacks: (stacks) => set({ stacks }),
  setSenderGroups: (groups) => set({ senderGroups: groups }),

  selectEmail: (email) =>
    set({ selectedEmail: email, panelView: email ? 'preview' : 'inbox' }),

  selectStack: (stackId) => set({ selectedStackId: stackId }),

  toggleStackCollapse: (stackId) =>
    set((state) => ({
      stacks: state.stacks.map((s) =>
        s.id === stackId ? { ...s, isCollapsed: !s.isCollapsed } : s
      ),
    })),

  toggleSenderExpand: (senderId) =>
    set((state) => ({
      senderGroups: state.senderGroups.map((sg) =>
        sg.id === senderId ? { ...sg, isExpanded: !sg.isExpanded } : sg
      ),
    })),

  setViewMode: (mode) => set({ viewMode: mode }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setPanelView: (view) => set({ panelView: view }),
  setFocusMode: (enabled) => set({ focusMode: enabled }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setError: (error) => set({ error }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),
}));
