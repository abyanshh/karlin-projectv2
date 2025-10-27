"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const SessionContext = createContext<any>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

    const me = await api.get("/me");
    setUser(me.data);
  };

  const logout = async () => {
    await api.post("/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
