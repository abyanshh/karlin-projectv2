import React, { useState } from "react"; // Pastikan import useState dari React
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Loader2, // Jangan lupa import Loader2
} from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import type { ProfileMember, Project } from "@/type/ProjectList/project";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface ProjectListProps {
  data: Project[];
  user: ProfileMember | null;
}

// Helper functions tetap boleh di luar karena tidak pakai hooks
const getStatusBadge = (status: string) => {
  switch (status) {
    case "done":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Selesai
        </Badge>
      );
    case "active":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Berlangsung
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    default:
      return null;
  }
};

const ProjectList: React.FC<ProjectListProps> = ({ data: projects, user }) => {
  // ✅ BENAR: Hooks dipanggil DI DALAM component
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleActivateProject = async (projectId: string) => {

    setLoadingId(projectId);

    try {
      await api.put(`/project/${projectId}`, {
        status: "active",
      });
      router.refresh();
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
      alert("Gagal mengubah status proyek.");
    } finally {
      setLoadingId(null);
    }
  };

  // Logic filter: Sembunyikan yang statusnya "done" (Sesuai permintaan sebelumnya)
  // Jika Anda ingin MENAMPILKAN yang done, ganti menjadi project.status === "done"
  const filteredProjects = projects.filter((project) => project.status == "done");

  return (
    <div className="grid gap-6">
      {filteredProjects.map((project) => (
        <Card
          key={project.id}
          className="hover:shadow-elegant transition-all duration-300"
        >
          <CardContent>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(project.status)}
                <div>
                  <h3 className="text-xl font-semibold">{project.po}</h3>
                  <p className="text-muted-foreground">{project.client}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(project.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Progress */}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Sales</p>
                  <p className="text-sm font-medium">
                    {project.Sales.user_nama}
                  </p>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="text-sm font-medium">{project.deadline}</p>
                </div>
              </div>

              {/* Team */}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">PIC</p>
                  <p className="text-sm font-medium">
                    {project.PIC?.user_nama || "Belum ada"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 items-center gap-2 justify-end">
                {/* Tombol Set Active (Hanya muncul jika belum active) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActivateProject(project.id)}
                  disabled={loadingId === project.id}
                  className="gap-2"
                >
                <Link href={`/dashboard/projects/${project.id}`}>
                   Revisi
                  </Link>
                </Button>

                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    Detail
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;