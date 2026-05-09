import { useState } from 'react';
import { useEmails } from '../../hooks/useEmails';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useTheme } from '../../hooks/useTheme';
import { useFocusMode } from '../../hooks/useFocusMode';
import { useEmailStore } from '../../store/emailStore';
import { Header } from '../../components/layout/Header';
import { NavTabs } from '../../components/layout/NavTabs';
import { StackList } from '../../components/stacks/StackList';
import { SenderList } from '../../components/senders/SenderList';
import { PreviewPanel } from '../../components/preview/PreviewPanel';
import { SearchBar } from '../../components/search/SearchBar';
import { SettingsModal } from '../../components/modals/SettingsModal';
import { StackListSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../utils/cn';

export function App() {
  const { isLoading, isAuthenticated, error, login, refresh } = useEmails();
  const { filteredStacks, filteredSenderGroups } = useFocusMode();
  const { viewMode, panelView, selectedEmail } = useEmailStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useTheme();
  useKeyboardShortcuts();

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex flex-col h-screen bg-bg-primary">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center animate-fade-in">
            <span className="text-6xl mb-6 block">📬</span>
            <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">Welcome to Mailman</h1>
            <p className="text-sm text-text-secondary mb-8 max-w-xs leading-relaxed">Transform your Gmail into a calm, organized, stack-based workspace.</p>
            <button
              onClick={login}
              className={cn(
                'flex items-center gap-3 mx-auto px-6 py-3 rounded-xl text-sm font-semibold',
                'bg-accent text-white hover:bg-accent-hover',
                'transition-all duration-200 hover:shadow-lg hover:shadow-accent/25',
                'active:scale-[0.98]'
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <p className="text-[10px] text-text-muted mt-4 max-w-[260px] mx-auto">
              Read-only access to organize your inbox. Your data stays in your browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary">
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
              <StackList stacks={filteredStacks} />
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
        <button onClick={() => setSettingsOpen(true)} className="hover:text-text-secondary transition-colors">
          ⚙️ Settings
        </button>
      </footer>
    </div>
  );
}
