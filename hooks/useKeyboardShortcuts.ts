import { useEffect, useCallback } from 'react';
import { useEmailStore } from '../store/emailStore';
import { useSettingsStore } from '../store/settingsStore';

export function useKeyboardShortcuts() {
  const {
    stacks,
    selectedEmail,
    selectedStackId,
    viewMode,
    selectEmail,
    selectStack,
    toggleFocusMode,
    toggleSearch,
    setViewMode,
    setPanelView,
  } = useEmailStore();

  const { toggleTheme } = useSettingsStore();

  const getVisibleEmails = useCallback(() => {
    if (selectedStackId) {
      const stack = stacks.find((s) => s.id === selectedStackId);
      return stack?.emails ?? [];
    }
    return stacks.flatMap((s) => s.emails);
  }, [stacks, selectedStackId]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMeta = event.metaKey || event.ctrlKey;

      if (isMeta && event.key === 'k') {
        event.preventDefault();
        toggleSearch();
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        toggleSearch();
        return;
      }

      const emails = getVisibleEmails();

      switch (event.key) {
        case 'j': {
          event.preventDefault();
          const currentIndex = selectedEmail
            ? emails.findIndex((e) => e.id === selectedEmail.id)
            : -1;
          const nextIndex = Math.min(currentIndex + 1, emails.length - 1);
          const nextEmail = emails[nextIndex];
          if (nextEmail) selectEmail(nextEmail);
          break;
        }
        case 'k': {
          event.preventDefault();
          const currentIdx = selectedEmail
            ? emails.findIndex((e) => e.id === selectedEmail.id)
            : 0;
          const prevIndex = Math.max(currentIdx - 1, 0);
          const prevEmail = emails[prevIndex];
          if (prevEmail) selectEmail(prevEmail);
          break;
        }
        case 'Enter': {
          break;
        }
        case 'Escape': {
          event.preventDefault();
          selectEmail(null);
          setPanelView('inbox');
          break;
        }
        case 'f': {
          event.preventDefault();
          toggleFocusMode();
          break;
        }
        case 't': {
          event.preventDefault();
          toggleTheme();
          break;
        }
        case '1': {
          event.preventDefault();
          setViewMode('stacks');
          break;
        }
        case '2': {
          event.preventDefault();
          setViewMode('senders');
          break;
        }
      }
    },
    [
      selectedEmail,
      getVisibleEmails,
      selectEmail,
      toggleFocusMode,
      toggleSearch,
      toggleTheme,
      setViewMode,
      setPanelView,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
