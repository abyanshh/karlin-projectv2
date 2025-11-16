"use client";
import { useUser } from "@/hooks/useUser";
import { useProjects } from "@/hooks/useProjects";
import { AdminStatsSkeleton, ProjectListSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { AdminStats, ProjectList } from "@/components/dashboard/DashboardList";

export default function Page() {
  const user = useUser();
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {(user?.role === "admin" || user?.role === "sales") && <AdminStatsSkeleton />}
        <ProjectListSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {(user?.role === "admin" || user?.role === "sales") && (
        <>
          <AdminStats projects={projects} />
          <ProjectList title="Taken Project List" projects={projects} />
          <ProjectList title="Available Project List" projects={projects} />
        </>
      )}

      {user?.role === "pm" && (
        <>
          <ProjectList title="Taken Project List" projects={projects} />
          <ProjectList title="Available Project List" projects={projects} />
        </>
      )}

      {user?.role === "user" && (
        <>
          <ProjectList title="Project List" projects={projects} />
        </>
      )}
    </div>
  );
}
