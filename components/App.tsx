import { useState } from 'react';
import { useEmails } from '../hooks/useEmails';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useTheme } from '../hooks/useTheme';
import { useFocusMode } from '../hooks/useFocusMode';
import { useEmailStore } from '../store/emailStore';
import { Header } from './layout/Header';
import { NavTabs } from './layout/NavTabs';
import { StackList } from './stacks/StackList';
import { SenderList } from './senders/SenderList';
import { PreviewPanel } from './preview/PreviewPanel';
import { SearchBar } from './search/SearchBar';
import { SettingsModal } from './modals/SettingsModal';
import { VirtualInbox } from './inbox/VirtualInbox';
import { CommandPalette } from './command/CommandPalette';
import { keyboardEngine } from '../services/keyboard/keyboardEngine';
import { cn } from '../utils/cn';
import { useEffect } from 'react';

export function App() {
  const { isLoading, isAuthenticated, error, login, refresh } = useEmails();
  const { filteredStacks, filteredSenderGroups } = useFocusMode();
  const { viewMode, panelView, selectedEmail, isMinimized, setMinimized } = useEmailStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => {
    keyboardEngine.init();
  }, []);



  if (!isAuthenticated && !isLoading) {
    return (
      <div className="w-full h-full bg-bg-primary flex items-center justify-center">
        <div className="bg-bg-secondary w-full max-w-lg p-8 rounded-3xl shadow-sm border border-border flex flex-col items-center justify-center">
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center animate-fade-in">
              <span className="material-symbols-outlined text-[64px] text-accent mb-6 block">mail</span>
              <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">Welcome to Mailman</h1>
              <p className="text-sm text-text-secondary mb-8 max-w-xs leading-relaxed">Transform your Gmail into a calm, organized, stack-based workspace.</p>
              <button
                onClick={login}
                className={cn(
                  'flex items-center gap-3 mx-auto px-6 py-2.5 rounded-full text-sm font-medium border border-border',
                  'bg-bg-secondary text-text-primary hover:bg-bg-hover',
                  'transition-all duration-200 active:scale-[0.98]'
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
              <p className="text-[10px] text-text-muted mt-4 max-w-[260px] mx-auto">
                Read-only access to organize your inbox. Your data stays in your browser.
              </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-bg-primary text-text-primary flex flex-col rounded-t-2xl overflow-hidden relative z-10">
        <CommandPalette />
        <Header />
        <NavTabs />

        {error && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refresh} className="text-[10px] underline underline-offset-2 hover:no-underline">Retry</button>
          </div>
        )}

        <SearchBar />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

        <div className="flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <StackListSkeleton />
          ) : selectedEmail && panelView === 'preview' ? (
            <PreviewPanel />
          ) : (
            <>
              {viewMode === 'stacks' ? (
                <VirtualInbox stacks={filteredStacks} />
              ) : (
                <SenderList senderGroups={filteredSenderGroups} />
              )}
            </>
          )}
        </div>

        <footer className="flex items-center justify-between px-4 py-1.5 border-t border-border text-[10px] text-text-muted">
          <div className="flex items-center gap-3">
            <span>J↓ K↑</span>
            <span>F Focus</span>
            <span>⌘K Search</span>
          </div>
          <button onClick={() => setSettingsOpen(true)} className="hover:text-text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            Settings
          </button>
        </footer>
    </div>
  );
}
