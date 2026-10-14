import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearAuth,
} from "./tokenStorage";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
let refreshing: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearAuth();
      return false;
    }

    const data = await res.json();
    saveTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const send = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${getAccessToken() || ""}`,
      },
    });

  let res = await send();

  if (res.status === 401) {
    if (!refreshing) {
      refreshing = refreshAccessToken().finally(() => {
        refreshing = null;
      });
    }
    const ok = await refreshing;

    if (!ok) {
      clearAuth();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired");
    }

    res = await send();
  }

  return res;
};

export const parseResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};
