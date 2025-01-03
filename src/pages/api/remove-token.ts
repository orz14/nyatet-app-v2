import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  statusCode: number;
  message?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(204).json({
      status: false,
      statusCode: 204,
    });
  }

  res.setHeader("Set-Cookie", "token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");

  res.status(200).json({
    status: true,
    statusCode: 200,
    message: "Token removed",
  });
}
