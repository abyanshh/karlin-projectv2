import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Ellipsis,
  MoreHorizontal,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    client: "PT. Teknologi Maju",
    status: "in-progress",
    progress: 75,
    dueDate: "2024-01-15",
    team: 5,
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "CV. Inovasi Digital",
    status: "completed",
    progress: 100,
    dueDate: "2023-12-20",
    team: 8,
  },
  {
    id: 3,
    name: "Infrastructure Setup",
    client: "PT. Infrastruktur Nusa",
    status: "planning",
    progress: 25,
    dueDate: "2024-02-28",
    team: 12,
  },
  {
    id: 4,
    name: "ERP Implementation",
    client: "PT. Manufaktur Indo",
    status: "in-progress",
    progress: 45,
    dueDate: "2024-03-10",
    team: 6,
  },
];

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

const taskToday = {
  title: "Creating Awesome Mobile Apps",
  role: "UI/UX Designer",
  time: "10:00 - 12:00",
  progress: 90,
  details: [
    { id: 1, name: "Riset kebutuhan pengguna dan alur aplikasi" },
    { id: 2, name: "Membuat wireframe dan flow dasar" },
    { id: 3, name: "Desain UI utama di Figma" },
    { id: 4, name: "Review hasil desain bersama tim dev" },
    { id: 5, name: "Finalisasi dan export aset" },
  ],
};

const page = () => {
  return (
    <>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1/3">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Projek Masuk</p>
                  <p className="text-3xl font-bold">15</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Sedang Berjalan</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Deadline</p>
                  <p className="text-3xl font-bold">42</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Proyek Terbaru</CardTitle>
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
                      <p className="text-sm font-medium">{project.dueDate}</p>
                    </div>

                    <div className="flex flex-col w-1/5 text-center">
                      <p className="text-sm text-muted-foreground">Tim</p>
                      <p className="text-sm font-medium">{project.team} orang</p>
                    </div>

                    <div className="flex w-2/5 items-center justify-end gap-4">
                      {getStatusBadge(project.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/projects">Lihat Semua Proyek</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card className=" h-fit">
          <CardHeader>
            <div className="flex justify-between mb-4 font-semibold">
              <CardTitle>Project Today</CardTitle>
              <Ellipsis className="w-4 h-4" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2">
              {/* Judul utama task */}
              <h2 className="font-semibold text-lg">{taskToday.title}</h2>
              <p className="text-sm text-muted-foreground">{taskToday.role}</p>

              {/* Progress */}
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm">Progress</span>
                <span className="text-sm font-medium">
                  {taskToday.progress}%
                </span>
              </div>
              <Progress value={taskToday.progress} />

              {/* Waktu */}
              <div className="flex gap-2 items-center mt-2">
                <Calendar className="w-4 h-4" />
                <p className="text-sm text-muted-foreground">
                  {taskToday.time}
                </p>
              </div>

              {/* Detail tasks */}
              <div className="mt-8">
                <h2 className="font-semibold mb-3">Detail Tasks</h2>

                {taskToday.details.map((detail) => (
                  <div
                    key={detail.id}
                    className="flex gap-3 items-start border-b border-border/40 pb-2 last:border-none"
                  >
                    <span className="text-sm font-medium text-muted-foreground w-4">
                      {detail.id}.
                    </span>
                    <p className="text-sm text-foreground leading-snug">
                      {detail.name}
                    </p>
                  </div>
                ))}
              </div>

              <Button className="mt-6 bg-primary hover:bg-primary/90">
                Go to Detail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default page;
