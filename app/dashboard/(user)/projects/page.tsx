'use client';
import ProjectList from "@/components/project/ProjectList";
import SearchFragment from "@/components/project/search-bar";
import ProjectListSkeleton from "@/components/project/ProjectListSkeleton";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
const Page = () => {
  const user = useUser();
  const { projects, loading } = useProjects();
  const completed = projects.filter(p => p.status === "done");

  if (loading) {
    return (
      <ProjectListSkeleton />
    );
  }
  
  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 text-center bg-card w-full rounded-md py-10">
        <p className="text-muted-foreground text-sm">
          Belum ada proyek yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchFragment />
      <ProjectList data={projects} user={user} />
    </div>
  );
};

export default Page;

