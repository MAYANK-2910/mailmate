import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function Popup() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      setIsAuthenticated(!!token);
      setChecking(false);
    });
  }, []);

  const handleOpenSidePanel = () => {
    window.close();
  };

  const handleSignIn = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) {
        setIsAuthenticated(true);
      }
    });
  };

  return (
    <div className="w-[320px] bg-bg-primary text-text-primary">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[24px] text-accent">mail</span>
          <div>
            <h1 className="text-base font-bold tracking-tight">Mailman</h1>
            <p className="text-[10px] text-text-muted">Stack-based email workspace</p>
          </div>
        </div>

        {checking ? (
          <div className="py-6 text-center">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-success font-medium">Connected to Gmail</span>
            </div>

            <button
              onClick={handleOpenSidePanel}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold',
                'bg-accent text-white hover:bg-accent-hover',
                'transition-all duration-200 active:scale-[0.98]'
              )}
            >
              Close Popup
            </button>

            <p className="text-[10px] text-text-muted text-center">
              Look for the floating <span className="material-symbols-outlined text-[12px] align-middle">mail</span> button in the bottom right corner of your Gmail tab.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-text-secondary text-center">
              Sign in to start organizing your inbox into clean stacks.
            </p>

            <button
              onClick={handleSignIn}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold',
                'bg-accent text-white hover:bg-accent-hover',
                'transition-all duration-200 active:scale-[0.98]'
              )}
            >
              Sign in with Google
            </button>

            <p className="text-[10px] text-text-muted text-center">
              Read-only access · Data stays local
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-text-muted">v2.0.0</span>
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <span>⌘K Search</span>
          <span>F Focus</span>
        </div>
      </div>
    </div>
  );
}
