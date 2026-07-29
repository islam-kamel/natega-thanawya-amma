'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './SearchBox.module.css';
import ResultCard from './ResultCard';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'seating' | 'name' | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string, type: 'seating' | 'name') => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isNumber = /^\d+$/.test(query.trim());
    const newSearchMode = query.trim() ? (isNumber ? 'seating' : 'name') : null;
    setSearchMode(newSearchMode);

    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    if (newSearchMode === 'seating') {
      performSearch(query.trim(), 'seating');
    } else {
      timeoutId = setTimeout(() => {
        performSearch(query.trim(), 'name');
      }, 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [query, performSearch]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="ابحث برقم الجلوس أو الاسم..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {searchMode && (
        <div className={styles.hint}>
          {searchMode === 'seating' ? 'البحث برقم الجلوس' : 'البحث بالاسم'}
        </div>
      )}

      <div className={styles.results}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.loading}></div>
          ))
        ) : hasSearched && results.length === 0 ? (
          <div className={styles.noResults}>لم يتم العثور على نتائج</div>
        ) : (
          results.map((student, i) => (
            <ResultCard key={student.seating_no || i} student={student} />
          ))
        )}
      </div>
    </div>
  );
}
