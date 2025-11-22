"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ProfileMember } from "@/type/ProjectList/project";

export function useOwnProfile() {
  const [user, setUser] = useState<ProfileMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        

        setUser(data.profile); 
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { loading, user };
}

export function useProfile(id: string) {
  const [user, setUser] = useState<ProfileMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/profile/${id}`);
        

        setUser(data.profile); 
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return { loading, user };
}