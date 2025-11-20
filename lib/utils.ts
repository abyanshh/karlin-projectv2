import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { User, Project } from "@/type/ProjectList/project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasAccess(
  user: User | null,
  project: Project | null,
  action: string
): boolean {
  if (!user) return false;

  // Admin -> semua bisa
  if (user.role === "admin") return true;

  switch (user.role) {
    case "sales":
      // Sales hanya bisa action tertentu
      return ["view", "edit", "add"].includes(action);

    case "pm":
      // PM bisa kalau dia adalah PIC
      if (project && user.id === project.ID_pic) {
        return ["view", "edit", "add", "take-project"].includes(action);
      }
      return false;

    case "staff":
      // Staff hanya bisa aksi kecil (contoh)
      return ["view"].includes(action);

    default:
      return false;
  }
}
