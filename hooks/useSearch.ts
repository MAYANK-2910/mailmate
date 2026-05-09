import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useEmailStore } from '../store/emailStore';
import { searchEmails } from '../services/search/searchEngine';
import { debounce } from '../utils/debounce';

export function useSearch() {
  const {
    emails,
    searchQuery,
    searchResults,
    isSearchOpen,
    setSearchQuery,
    setSearchResults,
    setSearchOpen,
    toggleSearch,
    selectEmail,
  } = useEmailStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }
        const results = searchEmails(emails, query, 30);
        setSearchResults(results);
      }, 250),
    [emails, setSearchResults]
  );

  const handleQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      performSearch(query);
    },
    [setSearchQuery, performSearch]
  );

  const handleSelectResult = useCallback(
    (emailId: string) => {
      const email = emails.find((e) => e.id === emailId);
      if (email) {
        selectEmail(email);
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    },
    [emails, selectEmail, setSearchOpen, setSearchQuery, setSearchResults]
  );

  const handleClose = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [setSearchOpen, setSearchQuery, setSearchResults]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return {
    searchQuery,
    searchResults,
    isSearchOpen,
    inputRef,
    handleQueryChange,
    handleSelectResult,
    handleClose,
    toggleSearch,
  };
}
