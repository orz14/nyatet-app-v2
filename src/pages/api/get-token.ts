import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  statusCode: number;
  token?: string | null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(204).json({
      status: true,
      statusCode: 204,
    });
  }

  res.status(200).json({
    status: true,
    statusCode: 200,
    token,
  });
}
