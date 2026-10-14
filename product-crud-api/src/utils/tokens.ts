import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

export const createAccessToken = (userId: number) =>
  jwt.sign({ userId }, accessSecret, { expiresIn: "15m" });

export const createRefreshToken = (userId: number) =>
  jwt.sign({ userId }, refreshSecret, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret) as { userId: number };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret) as { userId: number };
