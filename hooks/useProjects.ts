"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { OverviewStats, Project } from "@/type/ProjectList/project";
import { useUser } from "./useUser";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const user = useUser()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/project")
        setProjects(data.projects);
        if(user?.role === "admin" || user?.role === "sales"){
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
  }, []);

  return { loading, projects, overview };
}
