"use client";

import { ProfileMember } from "@/type/ProjectList/project";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<ProfileMember | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        console.error("⚠️ Gagal parse sessionStorage user");
        setUser(null);
      }
    }
  }, []);

  return user;
}
