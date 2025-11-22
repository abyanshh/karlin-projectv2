"use client";

import { useEffect, useState, useCallback } from "react"; // 1. Import useCallback
import api from "@/lib/axios";
import type { Project } from "@/type/ProjectList/project";

export const useProjectDetail = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Bungkus logika fetching dengan useCallback agar stabil dan bisa dipanggil ulang
  const fetchData = useCallback(async () => {
    try {
      // Anda bisa uncomment baris di bawah jika ingin loading muncul lagi saat refetch
      // setLoading(true); 
      
      const res = await api.get(`/project/${id}`);
      setProject(res.data.project);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  }, [id]); // Function ini hanya akan dibuat ulang jika 'id' berubah

  // 3. Jalankan fetchData saat component mount atau id berubah
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 4. Return 'fetchData' dengan nama alias 'refetch'
  return { project, loading, refetch: fetchData };
};