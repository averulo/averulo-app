import { useEffect, useState } from "react";
import { API_BASE } from "../lib/api";
import { useAuth } from "./useAuth";

export default function useAdminSummary(endpoint) {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchSummary = async () => {
    if (!token || !endpoint) return;
    try {
      setLoadingSummary(true);
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) setSummary(json.summary || json);
    } catch (err) {
      console.error("❌ Failed to load admin summary:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [token]);

  return { summary, loadingSummary, fetchSummary };
}