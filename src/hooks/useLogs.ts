import { readLogsClient } from "@/lib/logClient";
import { useEffect, useState } from "react";

export function useLogs() {
  const [logs, setLogs] = useState<ReturnType<typeof readLogsClient> extends Promise<infer T> ? T : []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const data = await readLogsClient();
      setLogs(data);
      setLoading(false);
    }

    fetchLogs();
  }, []);

  return { logs, loading };
}
