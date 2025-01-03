import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  statusCode: number;
  ip: string | null | unknown;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  const realIp = Array.isArray(ip) ? ip[0] : ip;

  res.status(200).json({
    status: true,
    statusCode: 200,
    ip: realIp,
  });
}
