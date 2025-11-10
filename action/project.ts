"use server";

import api from "@/lib/axios";
import type { Project } from "@/type/ProjectList/project";
import { revalidatePath } from "next/cache";

export async function createProject(formData: Partial<Project>) {
  try {
    await api.post("/api/project", formData);
    revalidatePath("/dashboard/projects");
    return { success: true, message: "Proyek dibuat!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function editProject(id: string, formData: Partial<Project>) {
  try {
    await api.put(`/api/project/${id}`, formData);
    revalidatePath("/dashboard/projects");
    return { success: true, message: "Proyek diperbarui!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}