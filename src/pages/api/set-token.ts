import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: boolean;
  statusCode: number;
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Token is required",
    });
  }

  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

  res.status(200).json({
    status: true,
    statusCode: 200,
    message: "Token set",
  });
}
