"use client";
import { useUser } from "@/hooks/useUser";
import { useProjects } from "@/hooks/useProjects";
import { AdminStatsSkeleton, ProjectListSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { AdminStats, ProjectList } from "@/components/dashboard/DashboardList";
import { useEffect} from "react";


export default function Page() {
  const user = useUser();
  const { projects, loading, overview } = useProjects();

  if (loading || !projects) {
    return (
      <div className="p-6 space-y-6">
        {(user?.role === "admin") && <AdminStatsSkeleton />}
        <ProjectListSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {(user?.role === "admin") && (
        <>
           {overview && <AdminStats overview={overview} />}
          <ProjectList title="Taken Project List" 
            projects={projects?.filter(project=> project?.PIC !== null && project?.status == "active")} 
          />
          <ProjectList title="Available Project List" projects={projects?.filter(project=> project?.PIC == null && project?.status == "active")} />
        </>
      )}

      {(user?.role === "sales") && (
        <>
          <ProjectList title="Taken Project List" 
            projects={projects?.filter(project=> project?.PIC !== null && project?.status == "active")} 
          />
          <ProjectList title="Available Project List" projects={projects?.filter(project=> project?.PIC == null && project?.status == "active")} />
        </>
      )}

      {user?.role === "pm" && (
        <>
          <ProjectList title="Taken Project List" 
            projects={projects?.filter(projects=> projects?.ID_pic == user.id && projects?.status == "active")} 
          />
          <ProjectList title="Available Project List" projects={projects?.filter(project=> project?.PIC == null && project?.status == "active")} />
        </>
      )}

      {user?.role === "staff" && (
        <>
          <ProjectList title="Project List" 
          projects={ projects?.filter(project=> project?.status == "active" )} />
        </>
      )}
    </div>
  );
}
