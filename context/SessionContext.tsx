"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api, { setupInterceptors } from "@/lib/axios"; 

const SessionContext = createContext<any>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    setupInterceptors(
      (token) => setAccessToken(token),
      () => handleLogout()
    );
  }, []);

  // useEffect(() => {
  //   api.post("/refresh-token")
  //     .then(async (res) => {
  //       const newAccessToken = res.data.accessToken;
  //       setAccessToken(newAccessToken);
  //       api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        
  //       const me = await api.get("/me");
  //       setUser(me.data);
  //     })
  //     .catch(() => {
  //       setUser(null);
  //       setAccessToken(null);
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    
    const newAccessToken = res.data.accessToken;
    setAccessToken(newAccessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

    const me = await api.get("/me");
    setUser(me.data);
  };

  const logout = async () => {
    await api.post("/logout"); 
    setUser(null);
    setAccessToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <SessionContext.Provider value={{ user, accessToken, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);