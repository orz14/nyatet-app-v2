import { getClientIp } from "@/lib/getClientIp";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  statusCode: number;
  ip: string | null | unknown;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const ip = getClientIp(req);

  res.status(200).json({
    status: true,
    statusCode: 200,
    ip,
  });
}
