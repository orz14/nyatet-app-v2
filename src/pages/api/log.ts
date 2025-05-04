import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const LOG_FILE_PATH = path.join(process.cwd(), "logs", "next-logs.json");

type LogLevel = "info" | "warning" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

function getTimestamp(): string {
  const jakartaTime = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format ulang dari "DD/MM/YYYY, HH:MM:SS" → "YYYY-MM-DD HH:MM:SS"
  const [date, time] = jakartaTime.split(", ");
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day} ${time}`;
}

function writeLog(level: LogLevel, message: string): void {
  const logEntry: LogEntry = {
    timestamp: getTimestamp(),
    level,
    message,
  };

  const logDir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  let logs: LogEntry[] = [];

  if (fs.existsSync(LOG_FILE_PATH)) {
    const existing = fs.readFileSync(LOG_FILE_PATH, "utf-8");
    try {
      logs = JSON.parse(existing);
      if (!Array.isArray(logs)) logs = [];
    } catch {
      logs = [];
    }
  }

  logs.push(logEntry);
  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 4), "utf-8");
}

function readLogs(): LogEntry[] {
  if (!fs.existsSync(LOG_FILE_PATH)) return [];

  try {
    const data = fs.readFileSync(LOG_FILE_PATH, "utf-8");
    const logs = JSON.parse(data);
    return Array.isArray(logs) ? logs : [];
  } catch {
    return [];
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { level, message } = req.body;
    if (!level || !message) {
      return res.status(400).json({ error: "Level dan message dibutuhkan" });
    }

    writeLog(level, message);
    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    const logs = readLogs();
    return res.status(200).json(logs);
  }

  res.status(405).end(); // Method Not Allowed
}
