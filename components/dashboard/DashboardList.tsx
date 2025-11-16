import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowDownToLine, CheckCircle2, TriangleAlert, AlertCircle, Clock, MoreHorizontal } from "lucide-react";
import type { Project } from "@/type/ProjectList/project";
import { Badge } from "../ui/badge";

export function AdminStats({ projects }: { projects: Project[] }) {
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
export function ProjectList({
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
                  <p className="text-sm font-medium line-clamp-1">{project.Sales.user_nama}</p>
                </div>
                <div className="flex flex-col w-1/5 text-center">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="text-sm font-medium">{project.deadline}</p>
                </div>
                <div className="flex flex-col w-1/5 text-center">
                  <p className="text-sm text-muted-foreground">PIC</p>
                  <p className="text-sm font-medium line-clamp-1">{project.PIC?.user_nama || "-"}</p>
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
