'use client'

import { use } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectForm from "@/components/project/ProjectForm";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function Page({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get(`/project/${id}`);
        setData(res.data);
      } catch (error: any) {
        console.error("❌ Gagal fetch project:", error.response?.status);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProjects();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">Data proyek tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/projects/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Proyek</h1>
            <p className="text-muted-foreground">Edit informasi proyek</p>
          </div>
        </div>
      </div>

      <ProjectForm mode="edit" initialData={data.project} id={id} />
    </div>
  );
}
