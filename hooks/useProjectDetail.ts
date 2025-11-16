"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Project } from "@/type/ProjectList/project";

export const useProjectDetail = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/project/${id}`);
      setProject(res.data.project);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  return { project, loading };
};
