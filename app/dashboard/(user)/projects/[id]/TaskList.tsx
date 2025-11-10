"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutList, SquarePen } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import type { Task } from "@/type/ProjectList/project";

export function TaskList({
  initialTasks,
  projectId,
}: {
  initialTasks: Task[];
  projectId: string;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName) return; // const response = await fetch(`/api/project/${projectId}/tasks`, { //   method: "POST", //   body: JSON.stringify({ name: taskName }), // }); // const newTask = await response.json();

    // Simulasi penambahan task baru
    const newTask: Task = {
      id: "tasks.length + 1",
      name: taskName,
      status: "berlangsung",
      description: "",
      file_url: "",
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4 md:p-5">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
                  onChange={(e) => setTaskName(e.target.value)}
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

      {tasks.map((task) => (
        <Card className="cursor-pointer hover:bg-muted" key={task.id}>
          <Link href={`/dashboard/projects/${projectId}/${task.id}`}>
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
  );
}
