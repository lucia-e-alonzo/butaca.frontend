import { useCallback, useEffect, useState } from "react";
import { getHistory, type HistoryPeriod } from "@/services/historyService";
import type { HistoryEntry } from "@/types/history";

export function useMoodHistory(period: HistoryPeriod = "30d") {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory(period);
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { entries, loading, error, reload };
}