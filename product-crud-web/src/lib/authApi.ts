import { API_URL, parseResponse } from "./api";
import { saveAuth, clearAuth, getRefreshToken } from "./tokenStorage";

const post = (path: string, body: object) =>
  fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const registerUser = async (email: string, password: string) => {
  const res = await post("/api/auth/register", { email, password });
  return parseResponse(res);
};

export const loginUser = async (email: string, password: string) => {
  const res = await post("/api/auth/login", { email, password });
  const data = await parseResponse(res);
  saveAuth(data.accessToken, data.refreshToken, data.user);
};

export const logoutUser = async () => {
  const refreshToken = getRefreshToken();
  try {
    await post("/api/auth/logout", { refreshToken });
  } catch {
    // Local logout should still work if the API is unavailable.
  }
  clearAuth();
};
