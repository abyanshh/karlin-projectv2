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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import api from "@/lib/axios";
import type { Task } from "@/type/ProjectList/project";

export const TaskList = ({
  initialTasks,
  projectId,
  onTaskCreated,
}: {
  initialTasks: Task[];
  projectId: string | undefined;
  onTaskCreated: () => void;
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName) return;

    setLoading(true);

    try {
      const res = await api.post(`/project/${projectId}/tasks`, {
        nama: taskName,
        deskripsi: taskDesc,
      });

      setTaskName("");
      setTaskDesc("");
      setDialogOpen(false);

      onTaskCreated();

    } catch (error) {
      console.error(error);
      alert("Gagal membuat task");
    }

    setLoading(false);
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

            <form onSubmit={handleAddTask} className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="task-name">Nama Task</Label>
                <Input
                  className="text-xs"
                  id="task-name"
                  type="text"
                  value={taskName}
                  placeholder="Nama task"
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="task-desc">Deskripsi (opsional)</Label>
                <Input
                  className="text-xs"
                  id="task-desc"
                  type="text"
                  value={taskDesc}
                  placeholder="Deskripsi"
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {initialTasks.map((task) => (
        <Card className="cursor-pointer hover:bg-muted" key={task.id}>
          <Link href={`/dashboard/projects/${projectId}/${task.id}`}>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <LayoutList className="w-4 h-4 mr-2" />
                  <span className="text-sm">{task.nama}</span>
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
};
