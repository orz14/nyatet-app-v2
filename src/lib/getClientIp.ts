import type { NextApiRequest } from "next";

export function getClientIp(req: NextApiRequest): string | null {
  const headers = req.headers;

  let ip = typeof headers["x-vercel-forwarded-for"] === "string" ? headers["x-vercel-forwarded-for"] : typeof headers["x-forwarded-for"] === "string" ? headers["x-forwarded-for"].split(",")[0].trim() : req.socket.remoteAddress || null;

  // Konversi ::1 (IPv6 loopback) ke 127.0.0.1 (IPv4 loopback)
  if (ip === "::1") {
    ip = "127.0.0.1";
  }

  // Hapus prefix IPv6-to-IPv4 (misal ::ffff:192.168.1.1)
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
}
