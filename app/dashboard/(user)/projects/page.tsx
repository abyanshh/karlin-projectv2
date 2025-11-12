'use client';
import ProjectList from "@/components/project/ProjectList";
import api from "@/lib/axios";
import { projectData } from "@/data/project";
import type { Project } from "@/type/ProjectList/project";
import { useEffect, useState } from "react";
const page = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get<{ projects: Project[] }>("/project");
        setProjects(data.projects);
      } catch (error: any) {
        console.error("❌ Gagal fetch project:", error.response?.status, error.response?.data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }
  
  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">
          Belum ada proyek yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProjectList data={projects} />
    </div>
  );
};

export default page;

