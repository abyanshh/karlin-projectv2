"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { User, Clock, Handshake, SquarePen } from "lucide-react";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { useProjectTasks } from "@/hooks/useProjectTasks";
// import { useProjectMembers } from "@/hooks/useProjectMembers";

import { TaskList } from "./TaskList";
import { TeamList } from "./TeamList";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { project, loading: loadingProject } = useProjectDetail(id);
  const { tasks, loading: loadingTasks, refetch } = useProjectTasks(id);
  const loading = loadingProject || loadingTasks;

  if (loading) return <Card className="text-muted-foreground text-center">Loading...</Card>;
  if (!project) return <Card>Projek tidak Tersedia</Card>

  return (
    <Card>
      {/* ==== HEADER ==== */}
      <CardHeader>
        <div className="relative mt-2">
          <div className="dark:hidden bg-gradient-to-r from-orange-500/70 to-amber-400/50 h-50 md:h-100 rounded-xl mask-b-from-0"></div>
          <div className="dark:block hidden bg-gradient-to-r from-slate-900/80 to-blue-600/50 h-50 md:h-100 rounded-xl mask-b-from-0"></div>
          <div className="absolute inset-0 bg-black/20 rounded-t-xl mask-b-from-0"></div>
          <div className="absolute space-y-2 w-full bottom-0 p-6 md:block hidden">
            <div className="flex justify-between">
              <CardTitle className="text-xl md:text-3xl">
                {project?.po}
              </CardTitle>
              <Link href={`/dashboard/projects/${project?.id}/edit`}>
                <Button className="cursor-pointer">
                  <SquarePen className="mr-2" />
                  Edit Proyek
                </Button>
              </Link>
            </div>
            <div className="flex gap-6">
              <span className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                <span>PIC : </span>
                <h2>{project?.pic}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Handshake className="h-4 w-4" />
                <span>Client : </span>
                <h2>{project?.client}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                {project?.deadline}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ==== HEADER (Mobile) ==== */}
      <CardContent>
        <div className="space-y-2 w-full md:hidden block">
          <div className="flex justify-between">
            <CardTitle className="text-xl md:text-3xl capitalized">
              {project?.po}
            </CardTitle>
            <Button asChild>
              <Link href={`/dashboard/projects/${project?.id}/edit`}>
                <SquarePen className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-6 text-xs md:text-md">
            <span className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <h2>{project?.pic}</h2>
            </span>
            <span className="flex gap-2 items-center">
              <Handshake className="h-4 w-4" />
              <h2>{project?.client}</h2>
            </span>
            <span className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              {project?.deadline}
            </span>
          </div>
          {/* <p className="text-muted-foreground text-sm max-w-3xl mt-5">
            {project?.description}
          </p> */}
        </div>
      </CardContent>

      {/* ==== TASK LIST ==== */}
      <CardContent>
        <TaskList
          initialTasks={tasks}
          projectId={project?.id}
          onTaskCreated={refetch}
        />
      </CardContent>

      {/* ==== TEAM LIST ==== */}
      <CardContent>
        <TeamList
          initialMembers={Object.values(project.team ?? {})}
          allUsers={Object.values(project.team ?? {})}
          projectId={project?.id}
        />
      </CardContent>
    </Card>
  );
}
