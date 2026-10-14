import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";

const userRepo = () => AppDataSource.getRepository(User);

const sendTokens = async (user: User, res: Response) => {
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  user.refreshToken = refreshToken;
  await userRepo().save(user);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email },
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password;

    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await userRepo().findOneBy({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo().create({ email, password: hashed, refreshToken: null });
    await userRepo().save(user);

    return res.status(201).json({ message: "Account created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password;

    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepo().findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await sendTokens(user, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (typeof refreshToken !== "string" || !refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepo().findOneBy({ id: payload.userId });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    await sendTokens(user, res);
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const user =
      typeof refreshToken === "string"
        ? await userRepo().findOneBy({ refreshToken })
        : null;

    if (user) {
      user.refreshToken = null;
      await userRepo().save(user);
    }

    return res.json({ message: "Logged out" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
