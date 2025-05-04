type LogLevel = "info" | "warning" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export async function writeLogClient(level: LogLevel, message: string): Promise<boolean> {
  try {
    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, message }),
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
