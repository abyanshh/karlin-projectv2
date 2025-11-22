"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import type { ProfileMember } from "@/type/ProjectList/project";


export const useStaffList = () => {
  const [staffList, setStaffList] = useState<ProfileMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
      const res = await api.get(`/profile`);
      setStaffList(res.data.profiles);
      console.log(res.data.profiles);
      setLoading(false);
    };

  useEffect(() => {
    load();
  }, []);

  return { staffList, loading, refetch: load };
};

export const handleDelete = async (id: string) => {
  await api.delete(`/staff/${id}`);
  
};

export const useStaffRole = (role: string) => {
  const [staffRoleList, setStaffRoleList] = useState<ProfileMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRole = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/profile/role/${role}`);
      // Pastikan response strukturnya sesuai
      setStaffRoleList(res.data.profiles || []); 
      setError(null);
    } catch (err: any) {
      console.error("Gagal mengambil data staff:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [role]); // Re-create function jika role berubah

  useEffect(() => {
    if (role) {
      loadRole();
    }
  }, [loadRole]); // Jalankan effect saat loadRole berubah

  return { staffRoleList, loading, error, refetch: loadRole };
};


