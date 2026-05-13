import { useCallback, useEffect, useRef } from 'react';
import { useEmailStore } from '../store/emailStore';
import { fetchInboxEmails } from '../services/gmail/api';
import { categorizeEmails } from '../services/grouping/categoryGrouper';
import { groupByCategory } from '../services/grouping/categoryGrouper';
import { groupBySender } from '../services/grouping/senderGrouper';
import { rankEmails } from '../services/ranking/priorityRanker';
import { authenticate, checkAuthStatus } from '../services/gmail/auth';
import { storeEmails, getStoredEmails } from '../storage/indexedDB';

export function useEmails() {
  const {
    emails,
    stacks,
    senderGroups,
    isLoading,
    isAuthenticated,
    error,
    setEmails,
    setStacks,
    setSenderGroups,
    setLoading,
    setAuthenticated,
    setError,
  } = useEmailStore();

  const isFetchingRef = useRef(false);

  const processEmails = useCallback(
    (rawEmails: ReturnType<typeof categorizeEmails>) => {
      const categorized = categorizeEmails(rawEmails);
      const ranked = rankEmails(categorized);
      const stackGroups = groupByCategory(ranked);
      const senderGroupsResult = groupBySender(ranked);

      setEmails(ranked);
      setStacks(stackGroups);
      setSenderGroups(senderGroupsResult);
    },
    [setEmails, setStacks, setSenderGroups]
  );

  const loadCachedEmails = useCallback(async () => {
    try {
      const cached = await getStoredEmails();
      if (cached.length > 0) {
        processEmails(cached);
      }
    } catch {
      // Cache miss is fine
    }
  }, [processEmails]);

  const fetchEmails = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      const rawEmails = await fetchInboxEmails(200);
      processEmails(rawEmails);

      await storeEmails(rawEmails).catch(() => {});
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch emails';
      setError(message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [processEmails, setLoading, setError]);

  const initializeAuth = useCallback(async () => {
    try {
      const hasAuth = await checkAuthStatus();
      setAuthenticated(hasAuth);
      if (hasAuth) {
        await loadCachedEmails();
        await fetchEmails();
      } else {
        setLoading(false);
      }
    } catch {
      setAuthenticated(false);
      setLoading(false);
    }
  }, [setAuthenticated, loadCachedEmails, fetchEmails, setLoading]);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      await authenticate(true);
      setAuthenticated(true);
      await fetchEmails();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setAuthenticated, setError, fetchEmails]);

  const refresh = useCallback(async () => {
    if (isAuthenticated) {
      await fetchEmails();
    }
  }, [isAuthenticated, fetchEmails]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    emails,
    stacks,
    senderGroups,
    isLoading,
    isAuthenticated,
    error,
    login,
    refresh,
    fetchEmails,
  };
}
