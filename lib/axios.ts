// app/lib/api.ts
import axios from "axios";
import { refreshAccessToken } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// 🟢 Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔴 Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          console.log("✅Token Refreshed");
          sessionStorage.setItem("accessToken", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("❌ Refresh failed:", err);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
