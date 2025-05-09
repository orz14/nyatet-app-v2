import { setCookie } from "cookies-next";
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

  setCookie("token", token, {
    req,
    res,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    status: true,
    statusCode: 200,
    message: "Token set",
  });
}
