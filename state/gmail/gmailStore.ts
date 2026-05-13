import { create } from 'zustand';
import { GmailRoute } from '../../services/gmail/routeManager';

interface GmailState {
  currentRoute: GmailRoute;
  totalUnreadCount: number;
  isGmailReady: boolean;
  
  setRoute: (route: GmailRoute) => void;
  setUnreadCount: (count: number) => void;
  setGmailReady: (ready: boolean) => void;
}

export const useGmailStore = create<GmailState>((set) => ({
  currentRoute: 'unknown',
  totalUnreadCount: 0,
  isGmailReady: false,

  setRoute: (route) => set({ currentRoute: route }),
  setUnreadCount: (count) => set({ totalUnreadCount: count }),
  setGmailReady: (ready) => set({ isGmailReady: ready }),
}));
