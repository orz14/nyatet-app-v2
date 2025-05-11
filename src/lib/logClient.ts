type LogLevel = "info" | "warning" | "error";

export async function writeLogClient(level: LogLevel, content: any): Promise<boolean> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/next-log` : "https://be-nyatet.orzverse.com/api/next-log";

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

  try {
    const res = await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, content, timestamp: getTimestamp() }),
    });

    return res.ok;
  } catch (err) {
    console.error("Gagal mengirim log:", err);
    return false;
  }
}
