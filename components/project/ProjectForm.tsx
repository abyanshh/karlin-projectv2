"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Project {
  name: string;
  client: string;
  description: string;
  deadline: string;
  pic: string;
  status: string;
}

interface ProjectFormProps {
  mode: "create" | "edit"; // menentukan apakah form ini buat tambah atau edit
  initialData?: Project; // data awal untuk edit
  id?: string; // dipakai untuk PUT saat edit
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  mode,
  initialData,
  id,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Project>(
    initialData || {
      name: "",
      client: "",
      description: "",
      deadline: "",
      pic: "",
      status: "",
    }
  );

  const handleChange = (field: keyof Project, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = mode === "edit" ? "PUT" : "POST";
      const url =
        mode === "edit"
          ? `/api/projects/${id}` // edit
          : "/api/projects"; // create

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data proyek");

      toast({
        title: mode === "edit" ? "Perubahan disimpan!" : "Proyek dibuat!",
        description:
          mode === "edit"
            ? "Data proyek berhasil diperbarui."
            : "Proyek baru berhasil ditambahkan.",
      });

      router.push("/dashboard/projects");
    } catch (error: any) {
      toast({
        title: "Terjadi kesalahan",
        description: error.message,
        variant: "destructive",
      });
    }
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
              <Label htmlFor="pic">PIC (Person in Charge)</Label>
              <Input
                id="pic"
                value={formData.pic}
                onChange={(e) => handleChange("pic", e.target.value)}
                placeholder="Nama penanggung jawab"
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
                  <SelectItem value="Berlangsung">Berlangsung</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {mode === "edit" ? "Simpan Perubahan" : "Buat Proyek"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
