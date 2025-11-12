"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  TriangleAlert,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProfileMember, Project } from "@/type/ProjectList/project";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// === Util untuk tampilkan status ===
const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
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
    case "planning":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          Perencanaan
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "active":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "planning":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default:
      return null;
  }
};

// === Skeleton untuk AdminStats ===
function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-8 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// === Skeleton untuk ProjectList ===
function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4 w-1/3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex items-center justify-end w-2/3 gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
        <Skeleton className="h-10 w-32 mt-4" />
      </CardContent>
    </Card>
  );
}

// === Komponen Statistik Admin ===
function AdminStats({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Card>
        <CardContent className="p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Projek Masuk</p>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <ArrowDownToLine className="h-8 w-8 text-blue-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Projek Diambil</p>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Mendekati Deadline</p>
            <p className="text-3xl font-bold">
              {projects.filter((p) => p.status === "in-progress").length}
            </p>
          </div>
          <TriangleAlert className="h-8 w-8 text-yellow-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Melewati Deadline</p>
            <p className="text-3xl font-bold">
              {projects.filter((p) => p.status === "completed").length}
            </p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600" />
        </CardContent>
      </Card>
    </div>
  );
}

// === Komponen Daftar Project ===
function ProjectList({
  title,
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4 w-1/3">
                {getStatusIcon(project.status)}
                <div>
                  <h3 className="font-semibold capitalize">{project.po}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.client}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 w-2/3">
                <div className="flex flex-col w-1/5 text-center">
                  <p className="text-sm text-muted-foreground">Sales</p>
                  <p className="text-sm font-medium line-clamp-1">{project.ID_sales}</p>
                </div>
                <div className="flex flex-col w-1/5 text-center">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="text-sm font-medium">{project.deadline}</p>
                </div>
                <div className="flex flex-col w-1/5 text-center">
                  <p className="text-sm text-muted-foreground">PIC</p>
                  <p className="text-sm font-medium line-clamp-1">{project?.ID_pic || "-"}</p>
                </div>
                <div className="flex w-2/5 items-center justify-end gap-4">
                  {getStatusBadge(project.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/projects">Lihat Semua</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// === Komponen Utama Page ===
export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<ProfileMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("accessToken");

        if (!storedUser || !token) {
          console.warn("Tidak ada token atau user di sessionStorage");
          setLoading(false);
          return;
        }

        setUser(JSON.parse(storedUser));

        const { data } = await api.get<{ projects: Project[] }>("/project");
        setProjects(data.projects);
      } catch (error: any) {
        console.error("❌ Gagal fetch project:", error.response?.status, error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {(user?.role === "admin" || user?.role === "sales") && <AdminStatsSkeleton />}
        <ProjectListSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {(user?.role === "admin" || user?.role === "sales") && (
        <>
          <AdminStats projects={projects} />
          <ProjectList title="Taken Project List" projects={projects} />
          <ProjectList title="Available Project List" projects={projects} />
        </>
      )}

      {user?.role === "pm" && (
        <>
          <ProjectList title="Taken Project List" projects={projects} />
          <ProjectList title="Available Project List" projects={projects} />
        </>
      )}

      {user?.role === "user" && (
        <>
          <ProjectList title="Project List" projects={projects} />
        </>
      )}
    </div>
  );
}
