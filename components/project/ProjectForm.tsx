"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/type/ProjectList/project";


// ✅ Schema Validasi
const projectSchema = z.object({
  po: z.string().min(1, "Nomor PO wajib diisi"),
  client: z.string().min(1, "Nama client wajib diisi"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
  ID_sales: z.string().min(1, "ID Sales wajib diisi"),
});

// ✅ Tipe Form
type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  mode: "create" | "edit";
  id?: string;
  initialData?: Project;
}

export default function ProjectForm({ mode, id, initialData }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // ✅ Setup React Hook Form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData
      ? {
          po: initialData.po || "",
          client: initialData.client || "",
          deadline: initialData.deadline?.split("T")[0] || "",
          status: initialData.status || "",
          ID_sales: initialData.ID_sales || "",
        }
      : {
          po: "",
          client: "",
          deadline: "",
          status: "",
          ID_sales: "",
        },
  });

  // ✅ Submit handler
  const onSubmit = async (values: ProjectFormValues) => {
    setLoading(true);
    try {
      if (mode === "create") {
        await api.post("/project", values);
        toast({
        title: "Tambah berhasil!",
      });
      } else if (mode === "edit" && id) {
        await api.put(`/project/${id}`, values);
        toast({
        title: "Edit berhasil!",
      });
      }
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error submit:", error.response?.data || error);
       toast({
        title: "Gagal Menyimpan",
        description: `${error.response?.data?.message || "Terjadi kesalahan saat menyimpan data."}`,
      });
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 bg-card p-6 rounded-lg border"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* PO */}
        <div>
          <Label htmlFor="po">Nomor PO</Label>
          <Input
            id="po"
            {...form.register("po")}
            placeholder="Masukkan nomor PO"
          />
          {form.formState.errors.po && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.po.message}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            {...form.register("client")}
            placeholder="Nama client"
          />
          {form.formState.errors.client && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.client.message}</p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" {...form.register("deadline")} />
          {form.formState.errors.deadline && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.deadline.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Input
            id="status"
            {...form.register("status")}
            placeholder="cth: In Progress, Done"
          />
          {form.formState.errors.status && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.status.message}</p>
          )}
        </div>

        {/* Sales ID */}
        <div>
          <Label htmlFor="ID_sales">ID Sales</Label>
          <Input
            id="ID_sales"
            {...form.register("ID_sales")}
            placeholder="Masukkan ID Sales"
          />
          {form.formState.errors.ID_sales && (
            <p className="text-red-500 text-sm mt-2">{form.formState.errors.ID_sales.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Menyimpan..."
            : mode === "create"
            ? "Tambah Proyek"
            : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
