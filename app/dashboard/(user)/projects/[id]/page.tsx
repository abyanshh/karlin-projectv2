"use client";

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

const metadata = {
  title: "Project Detail",
  description: "Project Detail",
};

const data = {
  id: 1,
  title: "Creating Awesome Mobile Apps",
  pic: "John Doe",
  klien: "PT. Abadi Jaya",
  deadline: "2024-01-15",
  deskripsi:
    "Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn how to make a good and correct design. Starting from spacing, typography, content, and many other design hierarchies. Then try to make it yourself with your imagination and inspiration.",
  progress: 50,
  tasks: [
    { id: 101, name: "Dokumentasi Projek Tahap 1", status: "berlangsung" },
    {
      id: 102,
      name: "Membuat wireframe dan flow dasar",
      status: "berlangsung",
    },
    { id: 103, name: "Desain UI utama di Figma", status: "berlangsung" },
    {
      id: 104,
      name: "Review hasil desain bersama tim dev",
      status: "completed",
    },
    { id: 105, name: "Finalisasi dan export aset", status: "pending" },
  ],
  team: [
    {
      id: 1,
      name: "Alice",
      role: "UI Designer",
      avatar: "/avatars/alice.png",
      lastOnline: "Online 2 jam lalu",
    },
    {
      id: 2,
      name: "Bob",
      role: "Frontend Developer",
      avatar: "/avatars/bob.png",
      lastOnline: "Online kemarin",
    },
    {
      id: 3,
      name: "Charlie",
      role: "Backend Developer",
      avatar: "/avatars/charlie.png",
      lastOnline: "Online 5 jam lalu",
    },
  ],
};

const users = [
  { id: 1001, name: "Diana", role: "Project Manager" },
  { id: 1002, name: "Evan", role: "Mobile Developer" },
  { id: 1003, name: "Fiona", role: "QA Engineer" },
  { id: 1004, name: "Fiona", role: "QA Engineer" },
  { id: 1005, name: "Fiona", role: "QA Engineer" },
  { id: 1006, name: "Fiona", role: "QA Engineer" },
  { id: 1007, name: "Fiona", role: "QA Engineer" },
];

const page = () => {
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
              <CardTitle className="text-xl md:text-3xl">
                {data.title}
              </CardTitle>
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
                <span>Klien : </span>
                <h2>{data.klien}</h2>
              </span>
              <span className="flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                {data.deadline}
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl mt-5">
              {data.deskripsi}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 w-full md:hidden block">
          <div className="flex justify-between">
            <CardTitle className="text-xl md:text-3xl">{data.title}</CardTitle>
            <Button asChild>
              <Link href={`/dashboard/projects/${data.id}/edit`}>
                <SquarePen className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex gap-6">
            <span className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>PIC : </span>
              <h2>{data.pic}</h2>
            </span>
            <span className="flex gap-2 items-center">
              <Handshake className="h-4 w-4" />
              <span>Klien : </span>
              <h2>{data.klien}</h2>
            </span>
            <span className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              {data.deadline}
            </span>
          </div>
          <p className="text-muted-foreground text-sm max-w-3xl mt-5">
            {data.deskripsi}
          </p>
        </div>
      </CardContent>

      {/* ==== TASK LIST ==== */}
      <CardContent>
        <div className="space-y-4 md:p-5">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link">
                  <SquarePen className="mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <form className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="task-name" className="sr-only">
                      Task Name
                    </Label>
                    <Input
                      id="task-name"
                      type="text"
                      placeholder="Task Name"
                      className="text-sm"
                    />
                  </div>
                </form>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="submit" variant="default">
                      Create Task
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {data.tasks.map((task) => (
            <Card className="cursor-pointer hover:bg-muted" key={task.id}>
              <Link href={`/dashboard/projects/${data.id}/${task.id}`}>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <LayoutList className="w-4 h-4 mr-2" />
                      <span className="text-sm">{task.name}</span>
                    </div>
                    <Badge
                      variant={
                        task.status === "berlangsung"
                          ? "progress"
                          : task.status === "completed"
                          ? "success"
                          : "failed"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* ==== TEAM LIST ==== */}
      <CardContent>
        <div className="space-y-4 md:p-5">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Team</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link">
                  <SquarePen className="mr-2" />
                  Add Anggota
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Pilih Anggota</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 overflow-y-auto h-56 pr-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="text-xs cursor-pointer">
                          Tambahkan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Tutup</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {data.team.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        {member.lastOnline}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default page;
