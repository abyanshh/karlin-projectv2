"use client";

import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Project } from "@/type/ProjectList/project";
import { createProject, editProject } from "@/action/project";


type ProjectFormData = Partial<Project>;

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project;
  id: string;
}

export default function ProjectForm({ mode, initialData, id }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ProjectFormData>(initialData || {});

  const handleChange = <K extends keyof Project>(field: K, value: Project[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      let result;
      if (mode === "edit") {
        result = await editProject(id, formData);
      } else {
        result = await createProject(formData);
      }

      if (result.success) {
        toast({
          title: result.message,
        });
        router.push(mode === "edit" ? `/dashboard/projects/${id}` : "/dashboard/projects");
      } else {
        toast({
          title: "Terjadi kesalahan",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "edit" ? "Edit Proyek" : "Buat Proyek Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Proyek</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Masukan nama proyek"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Klien</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleChange("client", e.target.value)}
                placeholder="Nama klien"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Deskripsi proyek"
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detail Proyek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po">Nomor PO</Label>
              <Input
                type="number"
                id="po"
                value={formData.po}
                onChange={(e) => handleChange("po", Number(e.target.value))}
                placeholder="Masukkan nomor PO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                type="date"
                id="deadline"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pic">PIC (Penanggung Jawab)</Label>
              <Input
                id="pic"
                value={formData.pic}
                onChange={(e) => handleChange("pic", e.target.value)}
                placeholder="Nama PIC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value: string) => handleChange("status", value)}
                value={formData.status}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Pilih status proyek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">Berlangsung</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="Planning">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                type="number"
                id="progress"
                value={formData.progress}
                placeholder="Progress"
                onChange={(e) =>
                  handleChange("progress", Number(e.target.value))
                }
                min={0}
                max={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team">Jumlah Tim</Label>
              <Input
                type="number"
                id="team"
                placeholder="Jumlah tim"
                value={formData.team}
                onChange={(e) => handleChange("team", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="NameSales">Nama Sales</Label>
              <Input
                id="NameSales"
                value={formData.NameSales}
                onChange={(e) => handleChange("NameSales", e.target.value)}
                placeholder="Nama sales"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {isPending
            ? "Menyimpan..."
            : mode === "edit"
            ? "Simpan Perubahan"
            : "Buat Proyek"}
        </Button>
      </div>
    </form>
  );
}



