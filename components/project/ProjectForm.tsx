"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import type { Project } from "@/type/ProjectList/project";

// ==========================
// ✅ Schema Validasi
// ==========================
const projectSchema = z.object({
  po: z.string().min(1, "Nomor PO wajib diisi"),
  client: z.string().min(1, "Nama client wajib diisi"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
  nama_sales: z.string().min(1, "Nama sales wajib diisi"),
});

// Tipe Form
type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectTemplate {
  po: string;
  client: string;
  deadline: string;
  salesName: string;
  tasks: Array<{ nama: string; deskripsi: string }>;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  id?: string;
  initialData?: Project;
  templateData?: {
    po: string;
    client: string;
    deadline: string;
    salesName: string;
    tasks: Array<{ nama: string; deskripsi: string }>;
  } | null;
}

// ==========================
// ✅ Component mulai di sini
// ==========================
export default function ProjectForm({
  mode,
  id,
  initialData,
  templateData,
}: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Array<{ nama: string; deskripsi: string }>>([]);

  // ==========================
  // Form handling
  // ==========================
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData
      ? {
          po: initialData.po || "",
          client: initialData.client || "",
          deadline: initialData.deadline?.split("T")[0] || "",
          nama_sales: initialData.Sales.user_nama || "",
        }
      : {
          po: "",
          client: "",
          deadline: "",
          nama_sales: "",
        },
  });

  // ==========================
  // Auto-fill and reset effects
  // ==========================
  // Auto-fill from scanned template
  useEffect(() => {
    if (templateData && mode === "create") {
      form.setValue("po", templateData.po);
      form.setValue("client", templateData.client);
      form.setValue("deadline", templateData.deadline);
      form.setValue("nama_sales", templateData.salesName);
      setTasks(templateData.tasks || []);
    }
  }, [templateData, mode, form]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        po: initialData.po || "",
        client: initialData.client || "",
        deadline: initialData.deadline?.split("T")[0] || "",
        nama_sales: initialData.Sales.user_nama|| "",
      });
    }
  }, [initialData, form]);

  // ==========================
  // Task handlers
  // ==========================
  const handleAddTask = () => {
    setTasks([...tasks, { nama: '', deskripsi: '' }]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, field: 'nama' | 'deskripsi', value: string) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  // ==========================
  // Submit handler
  // ==========================
  const onSubmit = async (values: ProjectFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        tasks: tasks.filter(t => t.nama.trim() !== ''),
      };

      if (mode === "create") {
        await api.post("/project", payload);
        toast({ title: "Tambah proyek berhasil!" });
      } else if (mode === "edit" && id) {
        await api.put(`/project/${id}`, payload);
        toast({ title: "Perubahan berhasil disimpan!" });
      }

      router.push("/dashboard/projects");
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error submit:", error.response?.data || error);
      toast({
        title: "Gagal Menyimpan",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🧱 UI FORM
  // ==========================
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 bg-card p-6 rounded-lg border"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nomor PO */}
        <div>
          <Label className="mb-2" htmlFor="po">Nomor PO</Label>
          <Input id="po" {...form.register("po")} placeholder="Masukkan nomor PO" />
          {form.formState.errors.po && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.po.message}
            </p>
          )}
        </div>

        {/* Client */}
        <div>
          <Label className="mb-2" htmlFor="client">Client</Label>
          <Input id="client" {...form.register("client")} placeholder="Nama client" />
          {form.formState.errors.client && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.client.message}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <Label className="mb-2" htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" {...form.register("deadline")} />
          {form.formState.errors.deadline && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.deadline.message}
            </p>
          )}
        </div>

        {/* Nama Sales */}
        <div>
          <Label className="mb-2" htmlFor="nama_sales">Nama Sales</Label>
          <Input
            id="nama_sales"
            {...form.register("nama_sales")}
            placeholder="Masukkan nama sales"
          />
          {form.formState.errors.nama_sales && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.nama_sales.message}
            </p>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      {mode === "create" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Tasks (Optional)</Label>
            <Button type="button" size="sm" variant="outline" onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
          
          {tasks.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {tasks.map((task, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Task {index + 1}</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveTask(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Nama Task"
                    value={task.nama}
                    onChange={(e) => handleTaskChange(index, 'nama', e.target.value)}
                  />
                  <Input
                    placeholder="Deskripsi (optional)"
                    value={task.deskripsi}
                    onChange={(e) => handleTaskChange(index, 'deskripsi', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
