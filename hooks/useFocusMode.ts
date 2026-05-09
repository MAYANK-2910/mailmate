import { useMemo } from 'react';
import { useEmailStore } from '../store/emailStore';
import { FOCUS_MODE_HIDDEN } from '../constants/categories';
import type { Stack } from '../types/stack';
import type { SenderGroup } from '../types/stack';

export function useFocusMode() {
  const { stacks, senderGroups, focusMode, toggleFocusMode, setFocusMode } =
    useEmailStore();

  const filteredStacks = useMemo((): Stack[] => {
    if (!focusMode) return stacks;

    return stacks.filter((stack) => !FOCUS_MODE_HIDDEN.includes(stack.category));
  }, [stacks, focusMode]);

  const filteredSenderGroups = useMemo((): SenderGroup[] => {
    if (!focusMode) return senderGroups;

    return senderGroups.filter((group) => {
      const hasHumanEmails = group.emails.some(
        (email) => !FOCUS_MODE_HIDDEN.includes(email.category)
      );
      return hasHumanEmails;
    });
  }, [senderGroups, focusMode]);

  const focusStats = useMemo(() => {
    const hiddenStacks = stacks.length - filteredStacks.length;
    const hiddenEmails = stacks
      .filter((s) => FOCUS_MODE_HIDDEN.includes(s.category))
      .reduce((sum, s) => sum + s.totalCount, 0);

    return {
      hiddenStacks,
      hiddenEmails,
      isActive: focusMode,
    };
  }, [stacks, filteredStacks, focusMode]);

  return {
    filteredStacks,
    filteredSenderGroups,
    focusMode,
    focusStats,
    toggleFocusMode,
    setFocusMode,
  };
}
