import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../lib/api";
import { useAuth } from "./useAuth";

export default function usePaginatedFetch(endpoint) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 🧠 Filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchData = useCallback(
    async (pageToFetch = 1, replace = false) => {
      if (!token) return;
      try {
        if (pageToFetch === 1 && !replace) setLoading(true);
        else setLoadingMore(true);

        const params = new URLSearchParams({
          page: pageToFetch,
          limit: 10,
          search,
          sortBy,
          sortOrder,
        });

        const res = await fetch(`${API_BASE}${endpoint}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Failed to fetch data");

        setItems(prev => {
          const merged = replace ? json.items : [...prev, ...json.items];
          // ✅ Remove duplicates by ID
          const map = new Map();
          merged.forEach(i => {
            if (i?.id) map.set(i.id, i);
          });
          return Array.from(map.values());
        });

        setError(null);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [endpoint, token, search, sortBy, sortOrder]
  );

  // 🚀 Initial load
  useEffect(() => {
    if (token) fetchData(1, true);
  }, [token, endpoint]);

  // 🔍 When search/sort changes — reset data
  useEffect(() => {
    if (!token) return;
    setPage(1);
    setItems([]);
    fetchData(1, true);
  }, [search, sortBy, sortOrder]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchData(1, true);
  }, [fetchData]);

  const onEndReached = useCallback(() => {
    if (!loadingMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  }, [loadingMore, fetchData]);

  return {
    items,
    loading,
    loadingMore,
    refreshing,
    error,
    search,
    setSearch,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    onRefresh,
    onEndReached,
  };
}