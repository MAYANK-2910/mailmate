import { create } from 'zustand';

export type WorkspaceMode = 'inbox' | 'triage' | 'focus';

interface WorkspaceState {
  mode: WorkspaceMode;
  pinnedStacks: Set<string>;
  
  setMode: (mode: WorkspaceMode) => void;
  togglePin: (stackId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  mode: 'inbox',
  pinnedStacks: new Set(),

  setMode: (mode) => set({ mode }),

  togglePin: (stackId) => set((state) => {
    const next = new Set(state.pinnedStacks);
    if (next.has(stackId)) next.delete(stackId);
    else next.add(stackId);
    return { pinnedStacks: next };
  }),
}));
