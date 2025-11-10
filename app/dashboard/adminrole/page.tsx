import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowDownToLine,
  Calendar,
  CheckCircle2,
  Clock,
  Ellipsis,
  MoreHorizontal,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { projectData } from "@/data/project";
import type { Project } from "@/type/ProjectList/project";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Selesai
        </Badge>
      );
    case "in-progress":
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
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "planning":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default:
      return null;
  }
};



export default async function page() {

  let projects : Project[] = [];

  try {
    // const { data } = await api.get("/api/project");
    projects = projectData;
  } catch (error) {
    console.error("Gagal memuat data project:", error);
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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1/3">
        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Projek Masuk</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <ArrowDownToLine className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Projek telah diambil</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Projek mendekati deadline
                  </p>
                  <p className="text-3xl font-bold">
                    {projects.filter((p) => p.status === "in-progress")
                      .length}
                  </p>
                </div>
                <TriangleAlert className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Projek melewati deadline</p>
                  <p className="text-3xl font-bold">
                    {projects.filter((p) => p.status === "completed")
                      .length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== Projects Table ===== */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Taken Project List</CardTitle>
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
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.client}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 w-2/3">
                    <div className="flex flex-col w-1/5">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {project.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col w-1/5 text-center">
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium">{project.deadline}</p>
                    </div>

                    <div className="flex flex-col w-1/5 text-center">
                      <p className="text-sm text-muted-foreground">Tim</p>
                      <p className="text-sm font-medium">
                        {project.team} orang
                      </p>
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
          </CardContent>
        </Card>

        {/* ===== Projects Table ===== */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Available Project List</CardTitle>
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
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.client}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 w-2/3">
                    <div className="flex flex-col w-1/5">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {project.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col w-1/5 text-center">
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium">{project.deadline}</p>
                    </div>

                    <div className="flex flex-col w-1/5 text-center">
                      <p className="text-sm text-muted-foreground">PIC</p>
                      <p className="text-sm font-medium">
                        {project.pic ? project.pic : "-"}
                      </p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
