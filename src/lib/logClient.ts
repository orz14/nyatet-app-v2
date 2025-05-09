type LogLevel = "info" | "warning" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  content: any;
}

export async function writeLogClient(level: LogLevel, content: any): Promise<boolean> {
  try {
    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, content }),
    });

    return res.ok;
  } catch (error) {
    console.error("Gagal mengirim log:", error);
    return false;
  }
}

export async function readLogsClient(): Promise<LogEntry[]> {
  try {
    const res = await fetch("/api/log");
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal membaca log:", error);
    return [];
  }
}
