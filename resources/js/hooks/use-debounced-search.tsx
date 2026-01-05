import { useState, useEffect, useCallback } from 'react';

interface UseDebouncedSearchOptions {
    delay?: number;
    minLength?: number;
}

export function useDebouncedSearch<T>(
    searchFunction: (query: string) => Promise<T>,
    options: UseDebouncedSearchOptions = {}
) {
    const { delay = 300, minLength = 1 } = options;
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useCallback(
        async (searchQuery: string) => {
            if (searchQuery.length < minLength && searchQuery.length > 0) {
                setResults(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const searchResults = await searchFunction(searchQuery);
                setResults(searchResults);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed');
                setResults(null);
            } finally {
                setLoading(false);
            }
        },
        [searchFunction, minLength]
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            debouncedSearch(query);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [query, debouncedSearch, delay]);

    const clearResults = useCallback(() => {
        setResults(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        clearResults
    };
}
