"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { OverviewStats, Project } from "@/type/ProjectList/project";
import { useUser } from "./useUser";

export function useProjects() {
  const user  = useUser();        
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewStats | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/project");
        console.log("Data proyek diterima:", data);
        console.log("User role:", user.role);
        setProjects(data.projects);

        if (user.role === "admin") {
          const data2 = await api.get("/project/overview");
          setOverview(data2.data.overview);
        }
      } catch (error) {
        console.error("Gagal mengambil data proyek:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return { loading, projects, overview };
}
