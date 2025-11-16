"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/type/ProjectList/project";
import api from "@/lib/axios";

interface TaskFormProps {
  projectId: string;
  taskId: string;
  defaultValues?: Task;
}

const TaskForm = ({ projectId, taskId, defaultValues }: TaskFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState(
    defaultValues || {
      nama: "",
      deskripsi: "",
      status: "belum mulai",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.put(`/project/${projectId}/tasks/${taskId}`, formData);
    console.log("Update task:", formData);

    toast({
      title: "Berhasil disimpan!",
      description: "Task berhasil diperbarui.",
    });

    router.push(`/dashboard/projects/${projectId}/${taskId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Form Edit Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nama">Judul Task</Label>
            <Input
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Belum Mulai</SelectItem>
                  <SelectItem value="berlangsung">Berlangsung</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;

