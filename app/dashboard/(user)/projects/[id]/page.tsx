import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Handshake,
  LayoutList,
  MoreHorizontal,
  SquarePen,
  User,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";
import type { Project, Task, Member } from "@/type/ProjectList/project";
import {
  projectDataList as data,
  teamList as users,
  taskList as tasks,
} from "@/data/project";
import { TaskList } from "./TaskList";
import { TeamList } from "./TeamList";

const metadata = {
  title: "Project Detail",
  description: "Project Detail",
};

async function getProject(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}`,
    { cache: "no-store" }
  );
  return res.json() as Promise<Project>;
}

async function getTasks(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}/tasks`,
    { cache: "no-store" }
  );
  return res.json() as Promise<Task[]>;
}

async function getMembers(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/project/${id}/members`,
    { cache: "no-store" }
  );
  return res.json() as Promise<Member[]>;
}

export const page = async (props: { params: Promise<{ id: number }> }) => {
  const { id } = await props.params;

  // const projectData = getProject(id);
  // const taskData = getTasks(id);
  // const userData = getMembers(id);

  // const [data, tasks, users] = await Promise.all([projectData, taskData, userData]);

  return (
    <Card>
      {/* ==== HEADER ==== */}
      <CardHeader>
        <div className="relative mt-2">
          <Image
            src="/task-list.png"
            alt="hero"
            width={512}
            height={512}
            className="object-cover object-center w-full h-50 md:h-100 rounded-t-xl mask-b-from-20"
          />
          <div className="absolute inset-0 bg-black/20 rounded-t-xl mask-b-from-0"></div>
          <div className="absolute space-y-2 w-full bottom-0 p-6 md:block hidden">
            <div className="flex justify-between">
              <CardTitle className="text-xl md:text-3xl">{data.name}</CardTitle>
              <Link href={`/dashboard/projects/${data.id}/edit`}>
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
                <h2>{data.pic}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Handshake className="h-4 w-4" />
                <span>Client : </span>
                <h2>{data.client}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                {data.deadline}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ==== HEADER (Mobile) ==== */}
      <CardContent>
        <div className="space-y-2 w-full md:hidden block">
          <div className="flex justify-between">
            <CardTitle className="text-xl md:text-3xl">{data.name}</CardTitle>
            <Button asChild>
              <Link href={`/dashboard/projects/${data.id}/edit`}>
                <SquarePen className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex gap-6">
            <span className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <h2>{data.pic}</h2>
            </span>
            <span className="flex gap-2 items-center">
              <Handshake className="h-4 w-4" />
              <h2>{data.client}</h2>
            </span>
            <span className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              {data.deadline}
            </span>
          </div>
          <p className="text-muted-foreground text-sm max-w-3xl mt-5">
            {data.description}
          </p>
        </div>
      </CardContent>

      {/* ==== TASK LIST ==== */}
      <CardContent>
        <TaskList initialTasks={tasks} projectId={data.id} />
      </CardContent>

      {/* ==== TEAM LIST ==== */}
      <CardContent>
        <TeamList initialMembers={users} allUsers={users} projectId={data.id} />
      </CardContent>
    </Card>
  );
};

export default page;
