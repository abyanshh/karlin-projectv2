// app/lib/auth.ts
import axios from "axios";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await axios.post("http://localhost:5000/api/auth/refresh", {}, { withCredentials: true });
    return data.accessToken;
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
  } catch {
  } finally {
    sessionStorage.clear();
  }
};
