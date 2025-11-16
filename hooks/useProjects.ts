"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Project } from "@/type/ProjectList/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/project")

        setProjects(data.projects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { loading, projects };
}
