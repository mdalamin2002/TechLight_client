import { useState, useEffect, useCallback, useRef } from 'react';
import useAxiosSecure from '@/utils/useAxiosSecure';

/**
 * Custom hook for product search with debouncing
 * @param {string} query - Search query string
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns {Object} - { results, loading, error, hasMore, total, page, loadMore }
 */
export default function useProductSearch(query = '', debounceMs = 300) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  
  const axiosSecure = useAxiosSecure();
  const abortControllerRef = useRef(null);

  // Search function
  const performSearch = useCallback(async (searchQuery, pageNum = 1) => {
    if (!searchQuery?.trim()) {
      setResults([]);
      setTotal(0);
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const response = await axiosSecure.get('/products/search', {
        params: {
          q: searchQuery,
          page: pageNum,
          limit: 20,
        },
        signal: abortControllerRef.current.signal,
      });

      const { data, total: totalResults, hasMore: more } = response.data;

      if (pageNum === 1) {
        setResults(data);
      } else {
        setResults((prev) => [...prev, ...data]);
      }

      setTotal(totalResults);
      setHasMore(more);
      setPage(pageNum);
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('Search error:', err);
        setError(err.message || 'Failed to search products');
      }
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // Debounced search effect
  useEffect(() => {
    const trimmedQuery = query?.trim();

    if (!trimmedQuery) {
      setResults([]);
      setTotal(0);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(trimmedQuery, 1);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debounceMs, performSearch]);

  // Load more function for pagination
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      performSearch(query, page + 1);
    }
  }, [query, page, loading, hasMore, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    loading,
    error,
    hasMore,
    total,
    page,
    loadMore,
  };
}
